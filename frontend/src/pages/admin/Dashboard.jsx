import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";
import { useLang } from "@/context/LangContext";

export default function Dashboard() {
  const { t } = useLang();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((r) => setStats(r.data)).catch(() => {});
  }, []);

  const cards = stats
    ? [
        { label: t("admin.dashboard.totalInquiries"), value: stats.total_inquiries, id: "stat-total" },
        { label: t("admin.dashboard.newInquiries"), value: stats.by_status?.new ?? 0, id: "stat-new" },
        { label: t("admin.dashboard.inProgress"), value: stats.by_status?.in_progress ?? 0, id: "stat-progress" },
        { label: t("admin.dashboard.completed"), value: stats.by_status?.completed ?? 0, id: "stat-completed" },
        { label: t("admin.dashboard.projectsPublished"), value: stats.projects_published, id: "stat-projects" },
      ]
    : [];

  return (
    <div data-testid="admin-dashboard">
      <h1 className="text-3xl font-extrabold tracking-tight uppercase mb-10">{t("admin.dashboard.title")}</h1>
      {!stats ? (
        <p className="font-mono-x text-sm text-zinc-500">{t("common.loading")}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-zinc-800/70 border border-zinc-800/70">
            {cards.map((c) => (
              <div key={c.id} data-testid={c.id} className="bg-[#0A0A0D] p-6">
                <p className="font-mono-x text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-3">{c.label}</p>
                <p className="text-4xl font-extrabold tracking-tighter text-[#CCFF00]">{c.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-between mb-5">
            <h2 className="font-mono-x text-xs uppercase tracking-[0.25em] text-zinc-400">{t("admin.dashboard.recentInquiries")}</h2>
            <Link to="/admin/inquiries" data-testid="dashboard-view-all" className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#CCFF00] hover:text-[#E6FF66]">
              {t("admin.dashboard.viewAll")}
              <ArrowUpRight size={13} className="rtl:-scale-x-100" />
            </Link>
          </div>
          {stats.recent_inquiries.length === 0 ? (
            <p className="text-sm text-zinc-500 border border-zinc-800 p-6" data-testid="dashboard-empty">{t("admin.dashboard.empty")}</p>
          ) : (
            <div className="border border-zinc-800 divide-y divide-zinc-800">
              {stats.recent_inquiries.map((inq) => (
                <Link key={inq.id} to={`/admin/inquiries?open=${inq.id}`} data-testid={`recent-inquiry-${inq.reference}`}
                      className="flex items-center justify-between gap-4 p-4 hover:bg-[#0C0C0F] transition-colors">
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{inq.full_name} — <span className="text-zinc-400">{inq.business_name}</span></p>
                    <p className="text-xs text-zinc-500 font-mono-x mt-1">{inq.reference} · {inq.project_type}</p>
                  </div>
                  <span className="shrink-0 font-mono-x text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 border border-zinc-700 text-zinc-400">
                    {t(`admin.inquiries.statuses.${inq.status}`)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
