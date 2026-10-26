import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Inbox, Images, Layers, Tag, Settings, ExternalLink, LogOut, Globe } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { Logo } from "@/components/Navbar";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();

  if (user === null) {
    return (
      <div className="min-h-screen bg-[#08080A] flex items-center justify-center">
        <span className="font-mono-x text-sm text-zinc-500 animate-pulse">…</span>
      </div>
    );
  }
  if (user === false) return <Navigate to="/admin/login" replace />;

  const nav = [
    { to: "/admin", end: true, label: t("admin.nav.dashboard"), Icon: LayoutDashboard, id: "admin-nav-dashboard" },
    { to: "/admin/inquiries", label: t("admin.nav.inquiries"), Icon: Inbox, id: "admin-nav-inquiries" },
    { to: "/admin/projects", label: t("admin.nav.projects"), Icon: Images, id: "admin-nav-projects" },
    { to: "/admin/services", label: t("admin.nav.services"), Icon: Layers, id: "admin-nav-services" },
    { to: "/admin/packages", label: t("admin.nav.packages"), Icon: Tag, id: "admin-nav-packages" },
    { to: "/admin/settings", label: t("admin.nav.settings"), Icon: Settings, id: "admin-nav-settings" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-[#F7F7F4] flex flex-col lg:flex-row">
      <aside className="lg:w-60 shrink-0 border-b lg:border-b-0 lg:border-e border-zinc-800 bg-[#0A0A0D] lg:min-h-screen flex lg:flex-col">
        <div className="p-5 border-b border-zinc-800 hidden lg:block">
          <Logo />
          <p className="font-mono-x text-[9px] uppercase tracking-[0.3em] text-zinc-600 mt-2">{t("admin.login.title")}</p>
        </div>
        <nav className="flex lg:flex-col flex-1 overflow-x-auto lg:overflow-visible" aria-label="Admin">
          {nav.map(({ to, end, label, Icon, id }) => (
            <NavLink key={id} to={to} end={end} data-testid={id}
                     className={({ isActive }) =>
                       `flex items-center gap-3 px-5 py-3.5 text-[13px] font-bold border-s-2 transition-colors duration-200 whitespace-nowrap ${
                         isActive ? "border-[#CCFF00] text-[#CCFF00] bg-[#CCFF00]/[0.05]" : "border-transparent text-zinc-400 hover:text-zinc-200"
                       }`
                     }>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="lg:border-t border-zinc-800 flex lg:flex-col">
          <button data-testid="admin-lang-toggle" onClick={() => setLang(lang === "en" ? "ar" : "en")}
                  className="flex items-center gap-3 px-5 py-3.5 text-[13px] font-bold text-zinc-400 hover:text-[#CCFF00] transition-colors">
            <Globe size={16} />
            {t("nav.switchTo")}
          </button>
          <NavLink to={`/${lang}`} data-testid="admin-view-site"
                   className="flex items-center gap-3 px-5 py-3.5 text-[13px] font-bold text-zinc-400 hover:text-zinc-200 transition-colors">
            <ExternalLink size={16} />
            {t("admin.nav.viewSite")}
          </NavLink>
          <button onClick={handleLogout} data-testid="admin-logout"
                  className="flex items-center gap-3 px-5 py-3.5 text-[13px] font-bold text-zinc-400 hover:text-red-400 transition-colors">
            <LogOut size={16} />
            {t("admin.nav.logout")}
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-5 sm:p-8 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}
