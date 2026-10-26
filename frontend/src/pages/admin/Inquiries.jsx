import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Download, X, Trash2, Archive, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { useLang } from "@/context/LangContext";

const STATUSES = ["new", "contacted", "proposal_sent", "in_progress", "completed", "cancelled"];
const TYPES = ["Business website", "Restaurant website", "Hotel website", "E-commerce website", "Corporate website", "Landing page", "Website redesign", "Custom web application", "General inquiry", "Other"];

const selectCls = "bg-[#0A0A0D] border border-zinc-800 px-3 py-2.5 text-xs text-zinc-300 focus:border-[#CCFF00] focus:outline-none";

export default function Inquiries() {
  const { t } = useLang();
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [archived, setArchived] = useState(false);
  const [open, setOpen] = useState(null); // full inquiry object
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/admin/inquiries", { params: { search, status, project_type: type, page, limit: 15, archived } })
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, status, type, page, archived]);

  useEffect(() => { load(); }, [load]);

  // Open inquiry via ?open=id (from dashboard)
  useEffect(() => {
    const id = params.get("open");
    if (id) {
      api.get(`/admin/inquiries/${id}`).then((r) => setOpen(r.data)).catch(() => {});
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  const openDetail = async (id) => {
    try {
      const { data } = await api.get(`/admin/inquiries/${id}`);
      setOpen(data);
      setNote("");
    } catch { toast.error(t("common.error")); }
  };

  const changeStatus = async (id, newStatus) => {
    try {
      await api.patch(`/admin/inquiries/${id}`, { status: newStatus });
      setOpen((o) => (o ? { ...o, status: newStatus } : o));
      toast.success(t("admin.entity.saved"));
      load();
    } catch { toast.error(t("common.error")); }
  };

  const addNote = async () => {
    if (!note.trim() || !open) return;
    try {
      const { data } = await api.post(`/admin/inquiries/${open.id}/notes`, { text: note });
      setOpen((o) => ({ ...o, internal_notes: [...(o.internal_notes || []), data] }));
      setNote("");
      toast.success(t("admin.entity.saved"));
    } catch { toast.error(t("common.error")); }
  };

  const remove = async (id) => {
    if (!window.confirm(t("admin.inquiries.deleteConfirm"))) return;
    try {
      await api.delete(`/admin/inquiries/${id}`);
      setOpen(null);
      toast.success(t("admin.entity.deleted"));
      load();
    } catch { toast.error(t("common.error")); }
  };

  const archive = async (id) => {
    await api.post(`/admin/inquiries/${id}/archive`).catch(() => {});
    setOpen(null);
    load();
  };

  const exportCsv = async () => {
    try {
      const r = await api.get("/admin/inquiries/export/csv", { responseType: "blob" });
      const url = URL.createObjectURL(r.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "inquiries.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { toast.error(formatApiError(e, t("common.error"))); }
  };

  return (
    <div data-testid="admin-inquiries">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight uppercase">{t("admin.inquiries.title")}</h1>
        <div className="flex gap-2">
          <button data-testid="inquiries-archived-toggle" onClick={() => { setArchived(!archived); setPage(1); }}
                  className="border border-zinc-700 px-4 py-2.5 text-xs font-extrabold uppercase tracking-widest hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors">
            {archived ? t("admin.inquiries.showActive") : t("admin.inquiries.showArchived")}
          </button>
          <button data-testid="inquiries-export" onClick={exportCsv}
                  className="inline-flex items-center gap-2 bg-[#CCFF00] text-[#08080A] px-4 py-2.5 text-xs font-extrabold uppercase tracking-widest hover:bg-[#E6FF66] transition-colors">
            <Download size={14} />
            {t("admin.inquiries.exportCsv")}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-zinc-600" />
          <input data-testid="inquiries-search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                 placeholder={t("admin.inquiries.search")}
                 className="w-full bg-[#0A0A0D] border border-zinc-800 ps-9 pe-3 py-2.5 text-xs focus:border-[#CCFF00] focus:outline-none" />
        </div>
        <select data-testid="inquiries-filter-status" className={selectCls} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">{t("admin.inquiries.status")}</option>
          {STATUSES.map((s) => <option key={s} value={s}>{t(`admin.inquiries.statuses.${s}`)}</option>)}
        </select>
        <select data-testid="inquiries-filter-type" className={selectCls} value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
          <option value="">{t("admin.inquiries.type")}</option>
          {TYPES.map((ty) => <option key={ty} value={ty}>{ty}</option>)}
        </select>
      </div>

      <div className="border border-zinc-800 overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="border-b border-zinc-800 bg-[#0A0A0D]">
              {[t("admin.inquiries.reference"), t("admin.inquiries.name"), t("admin.inquiries.business"), t("admin.inquiries.type"), t("admin.inquiries.status"), t("admin.inquiries.date")].map((h, i) => (
                <th key={i} className="text-start font-mono-x text-[10px] uppercase tracking-[0.2em] text-zinc-500 px-4 py-3.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/70">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-zinc-500 font-mono-x text-xs">{t("common.loading")}</td></tr>
            ) : data.items.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-zinc-500" data-testid="inquiries-empty">{t("admin.inquiries.empty")}</td></tr>
            ) : (
              data.items.map((inq) => (
                <tr key={inq.id} data-testid={`inquiry-row-${inq.reference}`} onClick={() => openDetail(inq.id)}
                    className="hover:bg-[#0C0C0F] cursor-pointer transition-colors">
                  <td className="px-4 py-3.5 font-mono-x text-xs text-[#CCFF00]">{inq.reference}</td>
                  <td className="px-4 py-3.5 font-bold">{inq.full_name}</td>
                  <td className="px-4 py-3.5 text-zinc-400">{inq.business_name}</td>
                  <td className="px-4 py-3.5 text-zinc-400 text-xs">{inq.project_type}</td>
                  <td className="px-4 py-3.5">
                    <span className={`font-mono-x text-[10px] uppercase tracking-[0.12em] px-2 py-1 border ${inq.status === "new" ? "border-[#CCFF00]/60 text-[#CCFF00]" : "border-zinc-700 text-zinc-400"}`}>
                      {t(`admin.inquiries.statuses.${inq.status}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-zinc-500" dir="ltr">{(inq.created_at || "").slice(0, 10)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data.pages > 1 && (
        <div className="mt-5 flex items-center justify-between text-xs text-zinc-500">
          <span>{t("admin.inquiries.page")} {data.page} {t("admin.inquiries.of")} {data.pages}</span>
          <div className="flex gap-2">
            <button data-testid="inquiries-prev" disabled={page <= 1} onClick={() => setPage(page - 1)}
                    className="p-2 border border-zinc-800 hover:border-[#CCFF00] disabled:opacity-30 transition-colors">
              <ChevronLeft size={14} className="rtl:-scale-x-100" />
            </button>
            <button data-testid="inquiries-next" disabled={page >= data.pages} onClick={() => setPage(page + 1)}
                    className="p-2 border border-zinc-800 hover:border-[#CCFF00] disabled:opacity-30 transition-colors">
              <ChevronRight size={14} className="rtl:-scale-x-100" />
            </button>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[80] flex justify-end" role="dialog" aria-modal="true" data-testid="inquiry-drawer">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(null)} />
          <div className="relative w-full max-w-xl bg-[#0A0A0D] border-s border-zinc-800 h-full overflow-y-auto p-7 sm:p-9">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <p className="font-mono-x text-[10px] uppercase tracking-[0.25em] text-[#CCFF00]">{open.reference}</p>
                <h2 className="text-2xl font-extrabold tracking-tight mt-2">{open.full_name}</h2>
                <p className="text-sm text-zinc-400">{open.business_name}</p>
              </div>
              <button onClick={() => setOpen(null)} data-testid="inquiry-close" aria-label="Close" className="p-2 text-zinc-500 hover:text-zinc-200">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm border border-zinc-800 p-5 mb-8">
              {[["Email", open.email], ["Phone", open.phone || "—"], [t("quote.fields.industry"), open.industry],
                [t("quote.fields.projectType"), open.project_type], [t("admin.inquiries.budget"), open.budget_range || "—"],
                [t("admin.inquiries.targetDate"), open.target_date || "—"], [t("admin.inquiries.preferred"), open.preferred_contact],
                [t("admin.inquiries.lang"), open.language?.toUpperCase()],
              ].map(([k, v], i) => (
                <div key={i} className="flex justify-between gap-4">
                  <span className="text-zinc-500">{k}</span>
                  <span className="text-zinc-200 text-end break-all" dir="auto">{v}</span>
                </div>
              ))}
              {open.existing_website && (
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500">{t("admin.inquiries.existingWebsite")}</span>
                  <a href={open.existing_website} target="_blank" rel="noopener noreferrer" dir="ltr" className="text-[#CCFF00] break-all">{open.existing_website}</a>
                </div>
              )}
            </div>

            {(open.features || []).length > 0 && (
              <div className="mb-8">
                <h3 className="font-mono-x text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-3">{t("admin.inquiries.features")}</h3>
                <div className="flex flex-wrap gap-2">
                  {open.features.map((f, i) => (
                    <span key={i} className="text-xs border border-zinc-700 px-2.5 py-1 text-zinc-300">{f}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h3 className="font-mono-x text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-3">{t("admin.inquiries.description")}</h3>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap border border-zinc-800 p-4" dir="auto">{open.description}</p>
            </div>

            <div className="mb-8">
              <label htmlFor="inquiry-status" className="font-mono-x text-[10px] uppercase tracking-[0.25em] text-zinc-500 block mb-3">{t("admin.inquiries.status")}</label>
              <select id="inquiry-status" data-testid="inquiry-status-select" className={selectCls} value={open.status}
                      onChange={(e) => changeStatus(open.id, e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{t(`admin.inquiries.statuses.${s}`)}</option>)}
              </select>
            </div>

            <div className="mb-8">
              <h3 className="font-mono-x text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-3">{t("admin.inquiries.notes")}</h3>
              <div className="space-y-3 mb-4">
                {(open.internal_notes || []).map((n, i) => (
                  <div key={i} className="border-s-2 border-[#CCFF00]/50 ps-3 py-1">
                    <p className="text-sm text-zinc-300">{n.text}</p>
                    <p className="text-[10px] text-zinc-600 font-mono-x mt-1">{n.author} · {(n.created_at || "").slice(0, 10)}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input data-testid="inquiry-note-input" value={note} onChange={(e) => setNote(e.target.value)}
                       placeholder={t("admin.inquiries.notePlaceholder")}
                       className="flex-1 bg-[#08080A] border border-zinc-800 px-3 py-2.5 text-sm focus:border-[#CCFF00] focus:outline-none" />
                <button data-testid="inquiry-add-note" onClick={addNote}
                        className="inline-flex items-center gap-1.5 bg-[#CCFF00] text-[#08080A] px-4 text-xs font-extrabold uppercase tracking-widest hover:bg-[#E6FF66] transition-colors">
                  <Plus size={13} />
                  {t("admin.inquiries.addNote")}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-5 border-t border-zinc-800">
              <button data-testid="inquiry-archive" onClick={() => archive(open.id)}
                      className="inline-flex items-center gap-2 border border-zinc-700 px-4 py-2.5 text-xs font-extrabold uppercase tracking-widest text-zinc-400 hover:border-zinc-500 transition-colors">
                <Archive size={13} />
                {t("admin.inquiries.archive")}
              </button>
              <button data-testid="inquiry-delete" onClick={() => remove(open.id)}
                      className="inline-flex items-center gap-2 border border-red-900 px-4 py-2.5 text-xs font-extrabold uppercase tracking-widest text-red-400 hover:bg-red-950/40 transition-colors">
                <Trash2 size={13} />
                {t("admin.inquiries.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
