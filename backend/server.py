import os
import re
import csv
import uuid
import asyncio
import logging
import secrets
from io import StringIO
from html import escape
from datetime import datetime, timezone
from typing import Optional, List

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, APIRouter, Request, HTTPException, Depends, Query
from fastapi.responses import PlainTextResponse, Response
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, field_validator

from db import db, client
from auth import auth_router, get_current_user, seed_admin
from email_utils import send_email, EMAIL_FROM_NAME
from whatsapp_utils import send_whatsapp_alert
from seed_data import seed_content

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="VORTEX Digital API")
api_router = APIRouter(prefix="/api")

FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")
cors_env = os.environ.get("CORS_ORIGINS", "")
allow_origins = [FRONTEND_URL, "http://localhost:3000"] if "*" in cors_env else cors_env.split(",")

INQUIRY_STATUSES = ["new", "contacted", "proposal_sent", "in_progress", "completed", "cancelled"]

# Simple in-memory rate limiter for the public inquiry endpoint
_inquiry_hits: dict = {}


def rate_limit(ip: str, max_hits: int = 5, window_sec: int = 600):
    now = datetime.now(timezone.utc).timestamp()
    hits = [t for t in _inquiry_hits.get(ip, []) if now - t < window_sec]
    if len(hits) >= max_hits:
        raise HTTPException(status_code=429, detail="Too many submissions. Please try again later.")
    hits.append(now)
    _inquiry_hits[ip] = hits


def clean(doc: dict) -> dict:
    doc = dict(doc)
    doc.pop("_id", None)
    return doc


# ----------------------------- Models -----------------------------

class InquiryIn(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    business_name: str = Field(min_length=1, max_length=160)
    email: EmailStr
    phone: Optional[str] = Field(default="", max_length=30)

    @field_validator("phone")
    @classmethod
    def valid_phone(cls, v):
        if v and not re.match(r"^\+?[0-9\s\-()]{6,30}$", v):
            raise ValueError("Invalid phone number")
        return v or ""
    industry: str = Field(max_length=80)
    project_type: str = Field(max_length=80)
    is_redesign: str = Field(default="new", max_length=20)
    features: List[str] = Field(default_factory=list)
    budget_range: Optional[str] = Field(default="", max_length=80)
    target_date: Optional[str] = Field(default="", max_length=40)
    existing_website: Optional[str] = Field(default="", max_length=300)
    description: str = Field(min_length=10, max_length=4000)
    preferred_contact: str = Field(default="email", max_length=40)
    language: str = Field(default="en", max_length=5)
    consent: bool
    website: Optional[str] = ""  # honeypot — must stay empty

    @field_validator("consent")
    @classmethod
    def must_consent(cls, v):
        if not v:
            raise ValueError("Consent is required")
        return v


class StatusUpdate(BaseModel):
    status: str


class NoteIn(BaseModel):
    text: str = Field(min_length=1, max_length=2000)


# ----------------------------- Public -----------------------------

@api_router.get("/")
async def root():
    return {"message": "VORTEX Digital API"}


@api_router.get("/health")
async def health():
    return {"status": "ok"}


@api_router.get("/public/services")
async def public_services():
    docs = await db.services.find({"is_published": True}, {"_id": 0}).sort("display_order", 1).to_list(100)
    return docs


@api_router.get("/public/services/{slug}")
async def public_service(slug: str):
    doc = await db.services.find_one({"slug": slug, "is_published": True}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Service not found")
    return doc


@api_router.get("/public/projects")
async def public_projects(category: Optional[str] = None):
    q = {"is_published": True}
    if category and category != "all":
        q["category"] = category
    return await db.projects.find(q, {"_id": 0}).sort("display_order", 1).to_list(100)


@api_router.get("/public/projects/{slug}")
async def public_project(slug: str):
    doc = await db.projects.find_one({"slug": slug, "is_published": True}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    return doc


@api_router.get("/public/packages")
async def public_packages():
    return await db.packages.find({"is_published": True}, {"_id": 0}).sort("display_order", 1).to_list(20)


@api_router.get("/public/settings")
async def public_settings():
    doc = await db.settings.find_one({"key": "site"}, {"_id": 0})
    return doc or {}


@api_router.post("/inquiries")
async def create_inquiry(body: InquiryIn, request: Request):
    if body.website:  # honeypot filled -> bot
        raise HTTPException(status_code=400, detail="Invalid submission")
    rate_limit(request.client.host if request.client else "unknown")

    # Duplicate guard: same email + description within 60 seconds
    recent = await db.inquiries.find_one({
        "email": body.email.lower(),
        "description": body.description,
        "created_at": {"$gte": datetime.fromtimestamp(datetime.now(timezone.utc).timestamp() - 60, tz=timezone.utc)},
    })
    if recent:
        raise HTTPException(status_code=409, detail="Duplicate submission detected")

    now = datetime.now(timezone.utc)
    reference = "VX-" + secrets.token_hex(3).upper()
    doc = body.model_dump()
    doc.pop("website", None)
    doc.update({
        "id": str(uuid.uuid4()),
        "reference": reference,
        "email": body.email.lower(),
        "status": "new",
        "archived": False,
        "internal_notes": [],
        "consent_timestamp": now.isoformat(),
        "created_at": now.isoformat(),
        "updated_at": now.isoformat(),
    })
    await db.inquiries.insert_one(doc)

    settings = await db.settings.find_one({"key": "site"}, {"_id": 0}) or {}
    notify_to = settings.get("contact_email") or os.environ.get("ADMIN_EMAIL")
    if notify_to:
        rows = "".join(
            f'<tr><td style="padding:6px 12px;color:#888;font-size:13px">{escape(k)}</td>'
            f'<td style="padding:6px 12px;font-size:13px">{escape(str(v))}</td></tr>'
            for k, v in [
                ("Reference", reference), ("Name", body.full_name), ("Business", body.business_name),
                ("Email", body.email), ("Phone", body.phone), ("Industry", body.industry),
                ("Project type", body.project_type), ("Budget", body.budget_range or "-"),
                ("Target date", body.target_date or "-"), ("Preferred contact", body.preferred_contact),
                ("Language", body.language), ("Description", body.description),
            ])
        html = (f'<table role="presentation" width="100%"><tr><td style="padding:24px;font-family:Arial,sans-serif">'
                f'<h2 style="margin:0 0 16px">New project inquiry — {escape(reference)}</h2>'
                f'<table role="presentation" style="border-collapse:collapse">{rows}</table>'
                f'<p style="font-size:12px;color:#888;margin-top:16px">Sent by {escape(EMAIL_FROM_NAME)}. '
                f'View this inquiry in the admin dashboard.</p></td></tr></table>')
        asyncio.create_task(send_email(to=notify_to, subject=f"New inquiry {reference} — {body.business_name}", html=html))

    asyncio.create_task(send_whatsapp_alert(
        reference=reference, name=body.full_name, business=body.business_name,
        project_type=body.project_type, language=body.language,
    ))

    doc.pop("_id", None)
    return {"status": "success", "reference": reference}


# ----------------------------- Admin -----------------------------

admin = APIRouter(prefix="/admin", dependencies=[Depends(get_current_user)])


@admin.get("/stats")
async def admin_stats():
    total = await db.inquiries.count_documents({"archived": {"$ne": True}})
    by_status = {}
    for s in INQUIRY_STATUSES:
        by_status[s] = await db.inquiries.count_documents({"status": s, "archived": {"$ne": True}})
    projects_published = await db.projects.count_documents({"is_published": True})
    recent = await db.inquiries.find({"archived": {"$ne": True}}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    return {"total_inquiries": total, "by_status": by_status,
            "projects_published": projects_published, "recent_inquiries": recent}


@admin.get("/inquiries")
async def list_inquiries(search: str = "", status: str = "", project_type: str = "",
                         sort: str = "desc", page: int = 1, limit: int = 15, archived: bool = False):
    q: dict = {"archived": archived}
    if status:
        q["status"] = status
    if project_type:
        q["project_type"] = project_type
    if search:
        rx = {"$regex": re.escape(search), "$options": "i"}
        q["$or"] = [{"full_name": rx}, {"business_name": rx}, {"email": rx}, {"reference": rx}]
    total = await db.inquiries.count_documents(q)
    items = await (db.inquiries.find(q, {"_id": 0})
                   .sort("created_at", -1 if sort == "desc" else 1)
                   .skip((page - 1) * limit).limit(limit).to_list(limit))
    return {"items": items, "total": total, "page": page, "pages": max(1, (total + limit - 1) // limit)}


@admin.get("/inquiries/export/csv")
async def export_inquiries():
    items = await db.inquiries.find({"archived": {"$ne": True}}, {"_id": 0}).sort("created_at", -1).to_list(5000)
    buf = StringIO()
    writer = csv.writer(buf)
    writer.writerow(["reference", "full_name", "business_name", "email", "phone", "industry",
                     "project_type", "budget_range", "target_date", "preferred_contact",
                     "language", "status", "created_at"])
    for i in items:
        writer.writerow([i.get(k, "") for k in ["reference", "full_name", "business_name", "email", "phone",
                                                "industry", "project_type", "budget_range", "target_date",
                                                "preferred_contact", "language", "status", "created_at"]])
    return Response(content=buf.getvalue(), media_type="text/csv",
                    headers={"Content-Disposition": "attachment; filename=inquiries.csv"})


@admin.get("/inquiries/{inquiry_id}")
async def get_inquiry(inquiry_id: str):
    doc = await db.inquiries.find_one({"id": inquiry_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return doc


@admin.patch("/inquiries/{inquiry_id}")
async def update_inquiry(inquiry_id: str, body: StatusUpdate):
    if body.status not in INQUIRY_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    res = await db.inquiries.update_one({"id": inquiry_id},
                                        {"$set": {"status": body.status,
                                                  "updated_at": datetime.now(timezone.utc).isoformat()}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"status": "ok"}


@admin.post("/inquiries/{inquiry_id}/notes")
async def add_note(inquiry_id: str, body: NoteIn, user: dict = Depends(get_current_user)):
    note = {"text": body.text, "author": user.get("email", "admin"),
            "created_at": datetime.now(timezone.utc).isoformat()}
    res = await db.inquiries.update_one({"id": inquiry_id}, {"$push": {"internal_notes": note}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return note


@admin.post("/inquiries/{inquiry_id}/archive")
async def archive_inquiry(inquiry_id: str):
    await db.inquiries.update_one({"id": inquiry_id}, {"$set": {"archived": True}})
    return {"status": "ok"}


@admin.delete("/inquiries/{inquiry_id}")
async def delete_inquiry(inquiry_id: str):
    res = await db.inquiries.delete_one({"id": inquiry_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"status": "ok"}


def bilingual_guard(payload: dict):
    if not payload.get("slug"):
        raise HTTPException(status_code=400, detail="Slug is required")
    title = payload.get("title") or payload.get("name") or {}
    if not isinstance(title, dict) or not title.get("en"):
        raise HTTPException(status_code=400, detail="English title/name is required")


def make_crud(collection: str, name: str):
    router = APIRouter(prefix=f"/{name}")
    col = db[collection]

    @router.get("")
    async def list_all():
        return await col.find({}, {"_id": 0}).sort("display_order", 1).to_list(200)

    @router.post("")
    async def create_item(payload: dict):
        bilingual_guard(payload)
        if await col.find_one({"slug": payload["slug"]}):
            raise HTTPException(status_code=409, detail="Slug already exists")
        now = datetime.now(timezone.utc)
        payload.setdefault("is_published", True)
        payload.setdefault("display_order", 99)
        payload["created_at"] = payload["updated_at"] = now
        await col.insert_one(payload)
        return clean(payload)

    @router.put("/{slug}")
    async def update_item(slug: str, payload: dict):
        payload.pop("_id", None)
        payload["updated_at"] = datetime.now(timezone.utc)
        res = await col.update_one({"slug": slug}, {"$set": payload})
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="Not found")
        return {"status": "ok"}

    @router.delete("/{slug}")
    async def delete_item(slug: str):
        res = await col.delete_one({"slug": slug})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Not found")
        return {"status": "ok"}

    return router


admin.include_router(make_crud("projects", "projects"))
admin.include_router(make_crud("services", "services"))
admin.include_router(make_crud("packages", "packages"))


@admin.get("/settings")
async def get_settings():
    return await db.settings.find_one({"key": "site"}, {"_id": 0}) or {}


@admin.put("/settings")
async def put_settings(payload: dict):
    payload.pop("_id", None)
    payload.pop("key", None)
    payload["updated_at"] = datetime.now(timezone.utc)
    await db.settings.update_one({"key": "site"}, {"$set": payload}, upsert=True)
    return {"status": "ok"}


# ----------------------------- SEO -----------------------------

@api_router.get("/sitemap.xml")
async def sitemap():
    base = FRONTEND_URL.rstrip("/")
    static_paths = ["", "/services", "/portfolio", "/pricing", "/about", "/contact", "/quote",
                    "/privacy", "/terms"]
    urls = []
    for lang in ("en", "ar"):
        for p in static_paths:
            urls.append(f"{base}/{lang}{p}")
        for s in await db.services.find({"is_published": True}, {"slug": 1}).to_list(100):
            urls.append(f"{base}/{lang}/services/{s['slug']}")
        for p in await db.projects.find({"is_published": True}, {"slug": 1}).to_list(100):
            urls.append(f"{base}/{lang}/portfolio/{p['slug']}")
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
           + "\n".join(f"  <url><loc>{escape(u)}</loc></url>" for u in urls)
           + "\n</urlset>")
    return Response(content=xml, media_type="application/xml")


@api_router.get("/robots.txt")
async def robots():
    base = FRONTEND_URL.rstrip("/")
    return PlainTextResponse(f"User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: {base}/api/sitemap.xml\n")


# ----------------------------- App wiring -----------------------------

api_router.include_router(auth_router)
api_router.include_router(admin)
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.inquiries.create_index("reference", unique=True)
    await db.inquiries.create_index("status")
    await db.inquiries.create_index("created_at")
    await db.services.create_index("slug", unique=True)
    await db.projects.create_index("slug", unique=True)
    await db.packages.create_index("slug", unique=True)
    await db.login_attempts.create_index("identifier")
    await seed_admin()
    await seed_content(db)
    logger.info("VORTEX API started; admin seeded; content seeded")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
