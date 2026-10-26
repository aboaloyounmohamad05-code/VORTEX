import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, CheckCircle2 } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { api, formatApiError } from "@/lib/api";
import { Reveal, Eyebrow } from "@/components/Reveal";
import Seo from "@/components/Seo";

const inputCls = "w-full bg-[#0A0A0D] border border-zinc-800 px-4 py-3.5 text-sm text-[#F7F7F4] placeholder:text-zinc-600 focus:border-[#CCFF00] focus:outline-none transition-colors duration-300";

export default function Contact() {
  const { lang, t, bi } = useLang();
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | sending | done
  const [reference, setReference] = useState("");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    api.get("/public/settings").then((r) => setSettings(r.data)).catch(() => {});
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const errs = {};
    if (form.full_name.trim().length < 2) errs.full_name = t("validation.required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t("validation.invalidEmail");
    if (form.phone && !/^\+?[0-9\s\-()]{6,30}$/.test(form.phone)) errs.phone = t("validation.invalidPhone");
    if (form.message.trim().length < 10) errs.message = t("validation.minDesc");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (state === "sending" || !validate()) return;
    setState("sending");
    setServerError("");
    try {
      const { data } = await api.post("/inquiries", {
        full_name: form.full_name,
        business_name: "—",
        email: form.email,
        phone: form.phone || "",
        industry: "General",
        project_type: "General inquiry",
        is_redesign: "new",
        features: [],
        description: form.message,
        preferred_contact: "email",
        language: lang,
        consent: true,
        website: "",
      });
      setReference(data.reference);
      setState("done");
    } catch (err) {
      setServerError(formatApiError(err, t("quote.errorMsg")));
      setState("idle");
    }
  };

  return (
    <>
      <Seo title={`${t("nav.contact")} — VORTEX`} description={t("contact.sub")} />
      <section className="pt-40 pb-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-5">
            <Eyebrow>{t("contact.eyebrow")}</Eyebrow>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tighter uppercase">{t("contact.heading")}</h1>
            <p className="mt-5 text-zinc-400 leading-relaxed">{t("contact.sub")}</p>
            <Reveal delay={0.1}>
              <div className="mt-10 border border-zinc-800 bg-[#0A0A0D] p-7">
                <h2 className="font-mono-x text-xs uppercase tracking-[0.25em] text-[#CCFF00] mb-6">{t("contact.infoTitle")}</h2>
                <ul className="space-y-4 text-sm">
                  {settings?.contact_email && (
                    <li className="flex items-center gap-3">
                      <Mail size={16} className="text-zinc-600 shrink-0" />
                      <span className="text-zinc-500 w-20">{t("contact.emailLabel")}</span>
                      <a href={`mailto:${settings.contact_email}`} dir="ltr" className="text-zinc-200 hover:text-[#CCFF00] transition-colors">{settings.contact_email}</a>
                    </li>
                  )}
                  {settings?.phone && (
                    <li className="flex items-center gap-3">
                      <Phone size={16} className="text-zinc-600 shrink-0" />
                      <span className="text-zinc-500 w-20">{t("contact.phoneLabel")}</span>
                      <a href={`tel:${settings.phone.replace(/\s/g, "")}`} dir="ltr" className="text-zinc-200 hover:text-[#CCFF00] transition-colors">{settings.phone}</a>
                    </li>
                  )}
                  {settings?.whatsapp && (
                    <li className="flex items-center gap-3">
                      <MessageCircle size={16} className="text-zinc-600 shrink-0" />
                      <span className="text-zinc-500 w-20">{t("contact.whatsappLabel")}</span>
                      <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer" dir="ltr" className="text-zinc-200 hover:text-[#CCFF00] transition-colors">{t("contact.whatsappLabel")}</a>
                    </li>
                  )}
                  {settings?.address && (
                    <li className="flex items-center gap-3">
                      <MapPin size={16} className="text-zinc-600 shrink-0" />
                      <span className="text-zinc-500 w-20">{t("contact.addressLabel")}</span>
                      <span className="text-zinc-200">{bi(settings.address)}</span>
                    </li>
                  )}
                </ul>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            {state === "done" ? (
              <div data-testid="contact-success" className="border border-[#CCFF00]/50 bg-[#CCFF00]/[0.05] p-10 text-center">
                <CheckCircle2 size={40} className="text-[#CCFF00] mx-auto mb-5" />
                <h2 className="text-2xl font-extrabold tracking-tight mb-3">{t("contact.successTitle")}</h2>
                <p className="text-zinc-400">{t("contact.successMsg")} <span className="font-mono-x text-[#CCFF00] font-bold">{reference}</span></p>
              </div>
            ) : (
              <Reveal delay={0.1}>
                <form onSubmit={submit} data-testid="contact-form" className="border border-zinc-800 bg-[#0A0A0D] p-7 sm:p-9 space-y-5" noValidate>
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">{t("contact.name")} *</label>
                    <input id="contact-name" data-testid="contact-name-input" className={inputCls} value={form.full_name} onChange={set("full_name")} />
                    {errors.full_name && <p className="mt-1.5 text-xs text-red-400" role="alert">{errors.full_name}</p>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">{t("contact.email")} *</label>
                      <input id="contact-email" data-testid="contact-email-input" type="email" dir="ltr" className={inputCls} value={form.email} onChange={set("email")} />
                      {errors.email && <p className="mt-1.5 text-xs text-red-400" role="alert">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">{t("contact.phone")}</label>
                      <input id="contact-phone" data-testid="contact-phone-input" type="tel" dir="ltr" className={inputCls} value={form.phone} onChange={set("phone")} />
                      {errors.phone && <p className="mt-1.5 text-xs text-red-400" role="alert">{errors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">{t("contact.message")} *</label>
                    <textarea id="contact-message" data-testid="contact-message-input" rows={6} className={inputCls} value={form.message} onChange={set("message")} />
                    {errors.message && <p className="mt-1.5 text-xs text-red-400" role="alert">{errors.message}</p>}
                  </div>
                  {serverError && <p data-testid="contact-error" className="text-sm text-red-400" role="alert">{serverError}</p>}
                  <button type="submit" data-testid="contact-submit" disabled={state === "sending"}
                          className="w-full sm:w-auto bg-[#CCFF00] text-[#08080A] font-extrabold uppercase tracking-wide text-sm px-8 py-4 hover:bg-[#E6FF66] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {state === "sending" ? t("contact.sending") : t("contact.send")}
                  </button>
                </form>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
