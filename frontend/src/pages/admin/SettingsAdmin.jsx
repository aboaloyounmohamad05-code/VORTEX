import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { useLang } from "@/context/LangContext";

const inputCls = "w-full bg-[#08080A] border border-zinc-800 px-3.5 py-2.5 text-sm text-[#F7F7F4] focus:border-[#CCFF00] focus:outline-none transition-colors";
const labelCls = "block font-mono-x text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1.5";

function BiField({ label, value, onChange, textarea = false }) {
  const v = value || {};
  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <span className="block text-[10px] text-zinc-600 mb-1">EN</span>
          {textarea
            ? <textarea rows={3} className={inputCls} dir="ltr" value={v.en || ""} onChange={(e) => onChange({ ...v, en: e.target.value })} />
            : <input className={inputCls} dir="ltr" value={v.en || ""} onChange={(e) => onChange({ ...v, en: e.target.value })} />}
        </div>
        <div>
          <span className="block text-[10px] text-zinc-600 mb-1">AR</span>
          {textarea
            ? <textarea rows={3} className={inputCls} dir="rtl" value={v.ar || ""} onChange={(e) => onChange({ ...v, ar: e.target.value })} />
            : <input className={inputCls} dir="rtl" value={v.ar || ""} onChange={(e) => onChange({ ...v, ar: e.target.value })} />}
        </div>
      </div>
    </div>
  );
}

export default function SettingsAdmin() {
  const { t } = useLang();
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/admin/settings").then((r) => setSettings(r.data || {})).catch(() => setSettings({}));
  }, []);

  if (!settings) return <p className="font-mono-x text-sm text-zinc-500">{t("common.loading")}</p>;

  const set = (k, v) => setSettings((s) => ({ ...s, [k]: v }));
  const setSocial = (k, v) => setSettings((s) => ({ ...s, socials: { ...(s.socials || {}), [k]: v } }));

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/admin/settings", settings);
      toast.success(t("admin.settingsPage.saved"));
    } catch (e) {
      toast.error(formatApiError(e, t("common.error")));
    } finally {
      setSaving(false);
    }
  };

  const S = t("admin.settingsPage");
  const singles = [
    ["contact_email", S.contactEmail], ["phone", S.phone], ["whatsapp", S.whatsapp],
  ];
  const socialKeys = [["instagram", S.instagram], ["twitter", S.twitter], ["linkedin", S.linkedin], ["behance", S.behance]];

  return (
    <div data-testid="admin-settings">
      <h1 className="text-3xl font-extrabold tracking-tight uppercase mb-10">{S.title}</h1>
      <div className="max-w-3xl space-y-6 border border-zinc-800 bg-[#0A0A0D] p-6 sm:p-8">
        <BiField label={S.agencyName} value={settings.agency_name} onChange={(v) => set("agency_name", v)} />
        <BiField label={S.tagline} value={settings.tagline} onChange={(v) => set("tagline", v)} />
        <BiField label={S.footerText} value={settings.footer_text} onChange={(v) => set("footer_text", v)} textarea />
        <BiField label={S.address} value={settings.address} onChange={(v) => set("address", v)} />
        {singles.map(([k, label]) => (
          <div key={k}>
            <span className={labelCls}>{label}</span>
            <input className={inputCls} dir="ltr" value={settings[k] || ""} onChange={(e) => set(k, e.target.value)} data-testid={`settings-${k}`} />
          </div>
        ))}
        <div className="grid sm:grid-cols-2 gap-4">
          {socialKeys.map(([k, label]) => (
            <div key={k}>
              <span className={labelCls}>{label}</span>
              <input className={inputCls} dir="ltr" value={settings.socials?.[k] || ""} onChange={(e) => setSocial(k, e.target.value)} data-testid={`settings-social-${k}`} />
            </div>
          ))}
        </div>
        <BiField label={S.seoTitle} value={settings.seo_title} onChange={(v) => set("seo_title", v)} />
        <BiField label={S.seoDesc} value={settings.seo_description} onChange={(v) => set("seo_description", v)} textarea />
        <div className="pt-4 border-t border-zinc-800">
          <button data-testid="settings-save" onClick={save} disabled={saving}
                  className="bg-[#CCFF00] text-[#08080A] px-8 py-3.5 text-xs font-extrabold uppercase tracking-widest hover:bg-[#E6FF66] transition-colors disabled:opacity-50">
            {saving ? t("admin.entity.saving") : S.save}
          </button>
        </div>
      </div>
    </div>
  );
}
