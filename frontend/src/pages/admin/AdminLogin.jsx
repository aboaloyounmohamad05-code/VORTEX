import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { formatApiError } from "@/lib/api";
import { Logo } from "@/components/Navbar";

const inputCls = "w-full bg-[#0A0A0D] border border-zinc-800 px-4 py-3.5 text-sm text-[#F7F7F4] placeholder:text-zinc-600 focus:border-[#CCFF00] focus:outline-none transition-colors duration-300";

export default function AdminLogin() {
  const { t, lang, setLang } = useLang();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(formatApiError(err, t("admin.login.failed")));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-[#F7F7F4] flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-10">
          <Logo />
          <button data-testid="admin-lang-switcher" onClick={() => setLang(lang === "en" ? "ar" : "en")}
                  className="font-mono-x text-xs font-bold uppercase border border-zinc-700 px-3 py-2 hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors">
            {t("nav.switchTo")}
          </button>
        </div>
        <div className="border border-zinc-800 bg-[#0A0A0D] p-8 sm:p-10">
          <p className="font-mono-x text-[10px] uppercase tracking-[0.3em] text-[#CCFF00] mb-2">{t("admin.login.title")}</p>
          <h1 className="text-2xl font-extrabold tracking-tight mb-8">{t("admin.login.sub")}</h1>
          <form onSubmit={submit} data-testid="admin-login-form" className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">{t("admin.login.email")}</label>
              <input id="admin-email" data-testid="admin-email-input" type="email" dir="ltr" className={inputCls}
                     value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">{t("admin.login.password")}</label>
              <input id="admin-password" data-testid="admin-password-input" type="password" dir="ltr" className={inputCls}
                     value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            {error && <p data-testid="admin-login-error" className="text-sm text-red-400" role="alert">{error}</p>}
            <button type="submit" data-testid="admin-login-submit" disabled={loading}
                    className="w-full bg-[#CCFF00] text-[#08080A] font-extrabold uppercase tracking-wide text-sm px-6 py-4 hover:bg-[#E6FF66] transition-colors duration-300 disabled:opacity-50">
              {loading ? t("admin.login.signingIn") : t("admin.login.signIn")}
            </button>
          </form>
        </div>
        <Link to={`/${lang}`} className="block mt-6 text-center text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          ← {t("admin.login.back")}
        </Link>
      </div>
    </div>
  );
}
