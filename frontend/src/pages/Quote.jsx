import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Check } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { api, formatApiError } from "@/lib/api";
import { Reveal, Eyebrow } from "@/components/Reveal";
import Seo from "@/components/Seo";

const inputCls = "w-full bg-[#0A0A0D] border border-zinc-800 px-4 py-3.5 text-sm text-[#F7F7F4] placeholder:text-zinc-600 focus:border-[#CCFF00] focus:outline-none transition-colors duration-300";
const labelCls = "block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2";

export default function Quote() {
  const { lang, t } = useLang();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    industry: "", project_type: "", is_redesign: "new", features: [], budget_range: "",
    target_date: "", existing_website: "", description: "",
    full_name: "", business_name: "", email: "", phone: "", preferred_contact: "Email", consent: false, website: "",
  });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle");
  const [reference, setReference] = useState("");
  const [serverError, setServerError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleFeature = (f) =>
    set("features", form.features.includes(f) ? form.features.filter((x) => x !== f) : [...form.features, f]);

  const stepLabels = t("quote.steps");
  const industryOpts = t("quote.industryOptions");
  const typeOpts = t("quote.projectTypeOptions");
  const budgetOpts = t("quote.budgetOptions");
  const contactOpts = t("quote.contactOptions");
  const featureOpts = t("quote.featureOptions");

  const validateStep = (s) => {
    const errs = {};
    if (s === 0) {
      if (!form.industry) errs.industry = t("validation.required");
      if (!form.project_type) errs.project_type = t("validation.required");
    }
    if (s === 1 && form.description.trim().length < 10) errs.description = t("validation.minDesc");
    if (s === 3) {
      if (form.full_name.trim().length < 2) errs.full_name = t("validation.required");
      if (!form.business_name.trim()) errs.business_name = t("validation.required");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t("validation.invalidEmail");
      if (!/^\+?[0-9\s\-()]{6,30}$/.test(form.phone)) errs.phone = t("validation.invalidPhone");
      if (!form.consent) errs.consent = t("validation.consentRequired");
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep(step + 1); };
  const back = () => setStep(step - 1);

  const submit = async () => {
    if (!validateStep(3) || state === "sending") return;
    setState("sending");
    setServerError("");
    try {
      const { data } = await api.post("/inquiries", { ...form, language: lang });
      setReference(data.reference);
      setState("done");
    } catch (err) {
      setServerError(formatApiError(err, t("quote.errorMsg")));
      setState("idle");
    }
  };

  if (state === "done") {
    return (
      <section className="pt-40 pb-32 min-h-[80vh] flex items-center">
        <div className="max-w-[700px] mx-auto px-5 sm:px-8 w-full">
          <div data-testid="quote-success" className="border border-[#CCFF00]/50 bg-[#CCFF00]/[0.05] p-10 sm:p-14 text-center">
            <CheckCircle2 size={48} className="text-[#CCFF00] mx-auto mb-6" />
            <h1 className="text-3xl font-extrabold tracking-tight mb-4">{t("quote.successTitle")}</h1>
            <p className="text-zinc-300">{t("quote.successMsg")}</p>
            <p className="font-mono-x text-2xl font-bold text-[#CCFF00] mt-3 tracking-widest" data-testid="quote-reference">{reference}</p>
            <p className="text-sm text-zinc-500 mt-6">{t("quote.successNote")}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo title={`${t("quote.eyebrow")} — VORTEX`} description={t("quote.sub")} />
      <section className="pt-40 pb-24">
        <div className="max-w-[860px] mx-auto px-5 sm:px-8">
          <Eyebrow>{t("quote.eyebrow")}</Eyebrow>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tighter uppercase">{t("quote.heading")}</h1>
          <p className="mt-4 text-zinc-400">{t("quote.sub")}</p>

          <div className="mt-12 mb-10 grid grid-cols-4 gap-2">
            {stepLabels.map((s, i) => (
              <div key={i} data-testid={`quote-step-indicator-${i}`} className={`border-t-2 pt-3 transition-colors duration-300 ${i <= step ? "border-[#CCFF00]" : "border-zinc-800"}`}>
                <p className={`font-mono-x text-[10px] uppercase tracking-[0.15em] ${i <= step ? "text-[#CCFF00]" : "text-zinc-600"}`}>
                  {t("quote.stepOf").replace("{n}", i + 1)}
                </p>
                <p className={`text-xs sm:text-sm font-bold mt-1 ${i <= step ? "text-[#F7F7F4]" : "text-zinc-600"}`}>{s.title}</p>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="border border-zinc-800 bg-[#0A0A0D] p-7 sm:p-9"
            >
              {step === 0 && (
                <div className="space-y-6">
                  <div>
                    <label className={labelCls}>{t("quote.fields.newOrRedesign")}</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[["new", t("quote.fields.newWebsite")], ["redesign", t("quote.fields.redesign")]].map(([v, l]) => (
                        <button key={v} type="button" data-testid={`quote-redesign-${v}`} onClick={() => set("is_redesign", v)}
                                className={`px-4 py-3.5 text-sm font-bold border transition-colors duration-300 ${form.is_redesign === v ? "border-[#CCFF00] bg-[#CCFF00]/10 text-[#CCFF00]" : "border-zinc-800 text-zinc-400 hover:border-zinc-600"}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="quote-industry" className={labelCls}>{t("quote.fields.industry")} *</label>
                    <select id="quote-industry" data-testid="quote-industry" className={inputCls} value={form.industry} onChange={(e) => set("industry", e.target.value)}>
                      <option value="">{t("quote.fields.selectPlaceholder")}</option>
                      {industryOpts.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    {errors.industry && <p className="mt-1.5 text-xs text-red-400" role="alert">{errors.industry}</p>}
                  </div>
                  <div>
                    <label htmlFor="quote-type" className={labelCls}>{t("quote.fields.projectType")} *</label>
                    <select id="quote-type" data-testid="quote-type" className={inputCls} value={form.project_type} onChange={(e) => set("project_type", e.target.value)}>
                      <option value="">{t("quote.fields.selectPlaceholder")}</option>
                      {typeOpts.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    {errors.project_type && <p className="mt-1.5 text-xs text-red-400" role="alert">{errors.project_type}</p>}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <span className={labelCls}>{t("quote.fields.features")}</span>
                    <div className="flex flex-wrap gap-2">
                      {featureOpts.map((f) => (
                        <button key={f} type="button" data-testid={`quote-feature-${f.slice(0, 12).replace(/\W/g, "-")}`} onClick={() => toggleFeature(f)}
                                aria-pressed={form.features.includes(f)}
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-bold border transition-colors duration-300 ${form.features.includes(f) ? "border-[#CCFF00] bg-[#CCFF00]/10 text-[#CCFF00]" : "border-zinc-800 text-zinc-400 hover:border-zinc-600"}`}>
                          {form.features.includes(f) && <Check size={12} />}
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="quote-description" className={labelCls}>{t("quote.fields.description")} *</label>
                    <textarea id="quote-description" data-testid="quote-description" rows={5} className={inputCls} value={form.description} onChange={(e) => set("description", e.target.value)} />
                    {errors.description && <p className="mt-1.5 text-xs text-red-400" role="alert">{errors.description}</p>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="quote-budget" className={labelCls}>{t("quote.fields.budget")}</label>
                    <select id="quote-budget" data-testid="quote-budget" className={inputCls} value={form.budget_range} onChange={(e) => set("budget_range", e.target.value)}>
                      <option value="">{t("quote.fields.selectPlaceholder")}</option>
                      {budgetOpts.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="quote-date" className={labelCls}>{t("quote.fields.targetDate")}</label>
                      <input id="quote-date" data-testid="quote-date" type="date" className={inputCls} value={form.target_date} onChange={(e) => set("target_date", e.target.value)} />
                    </div>
                    <div>
                      <label htmlFor="quote-existing" className={labelCls}>{t("quote.fields.existingWebsite")}</label>
                      <input id="quote-existing" data-testid="quote-existing" type="url" dir="ltr" placeholder="https://" className={inputCls} value={form.existing_website} onChange={(e) => set("existing_website", e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="quote-name" className={labelCls}>{t("quote.fields.fullName")} *</label>
                      <input id="quote-name" data-testid="quote-name" className={inputCls} value={form.full_name} onChange={(e) => set("full_name", e.target.value)} />
                      {errors.full_name && <p className="mt-1.5 text-xs text-red-400" role="alert">{errors.full_name}</p>}
                    </div>
                    <div>
                      <label htmlFor="quote-business" className={labelCls}>{t("quote.fields.businessName")} *</label>
                      <input id="quote-business" data-testid="quote-business" className={inputCls} value={form.business_name} onChange={(e) => set("business_name", e.target.value)} />
                      {errors.business_name && <p className="mt-1.5 text-xs text-red-400" role="alert">{errors.business_name}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="quote-email" className={labelCls}>{t("quote.fields.email")} *</label>
                      <input id="quote-email" data-testid="quote-email" type="email" dir="ltr" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} />
                      {errors.email && <p className="mt-1.5 text-xs text-red-400" role="alert">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="quote-phone" className={labelCls}>{t("quote.fields.phone")} *</label>
                      <input id="quote-phone" data-testid="quote-phone" type="tel" dir="ltr" placeholder="+971 …" className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                      {errors.phone && <p className="mt-1.5 text-xs text-red-400" role="alert">{errors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <span className={labelCls}>{t("quote.fields.preferredContact")}</span>
                    <div className="flex gap-2">
                      {contactOpts.map((c) => (
                        <button key={c} type="button" data-testid={`quote-contact-${c}`} onClick={() => set("preferred_contact", c)}
                                className={`px-4 py-2.5 text-[12px] font-bold border transition-colors duration-300 ${form.preferred_contact === c ? "border-[#CCFF00] bg-[#CCFF00]/10 text-[#CCFF00]" : "border-zinc-800 text-zinc-400 hover:border-zinc-600"}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-2">
                    <input id="quote-consent" data-testid="quote-consent" type="checkbox" checked={form.consent} onChange={(e) => set("consent", e.target.checked)}
                           className="mt-0.5 w-4 h-4 accent-[#CCFF00]" />
                    <label htmlFor="quote-consent" className="text-xs text-zinc-400 leading-relaxed">{t("quote.fields.consent")} *</label>
                  </div>
                  {errors.consent && <p className="text-xs text-red-400" role="alert">{errors.consent}</p>}
                  {serverError && <p data-testid="quote-error" className="text-sm text-red-400" role="alert">{serverError}</p>}
                </div>
              )}

              {/* Honeypot */}
              <input type="text" name="website" value={form.website} onChange={(e) => set("website", e.target.value)}
                     tabIndex={-1} autoComplete="off" aria-hidden="true"
                     style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }} />

              <div className="mt-9 flex items-center justify-between gap-4">
                {step > 0 ? (
                  <button type="button" data-testid="quote-back" onClick={back}
                          className="inline-flex items-center gap-2 border border-zinc-700 px-5 py-3 text-sm font-extrabold uppercase tracking-wide hover:border-zinc-500 transition-colors duration-300">
                    <ArrowLeft size={15} className="rtl:-scale-x-100" />
                    {t("quote.back")}
                  </button>
                ) : <span />}
                {step < 3 ? (
                  <button type="button" data-testid="quote-next" onClick={next}
                          className="inline-flex items-center gap-2 bg-[#CCFF00] text-[#08080A] px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide hover:bg-[#E6FF66] transition-colors duration-300">
                    {t("quote.next")}
                    <ArrowRight size={15} className="rtl:-scale-x-100" />
                  </button>
                ) : (
                  <button type="button" data-testid="quote-submit" onClick={submit} disabled={state === "sending"}
                          className="inline-flex items-center gap-2 bg-[#CCFF00] text-[#08080A] px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide hover:bg-[#E6FF66] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {state === "sending" ? t("quote.submitting") : t("quote.submit")}
                    <ArrowRight size={15} className="rtl:-scale-x-100" />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
