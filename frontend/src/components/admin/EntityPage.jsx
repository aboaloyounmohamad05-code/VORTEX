import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { useLang } from "@/context/LangContext";

const inputCls = "w-full bg-[#08080A] border border-zinc-800 px-3.5 py-2.5 text-sm text-[#F7F7F4] focus:border-[#CCFF00] focus:outline-none transition-colors";
const labelCls = "block font-mono-x text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1.5";

const getPath = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
const setPath = (obj, path, value) => {
  const keys = path.split(".");
  const clone = { ...obj };
  let cur = clone;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) cur[k] = value;
    else { cur[k] = { ...(cur[k] || {}) }; cur = cur[k]; }
  });
  return clone;
};

function BilingualField({ form, setForm, path, label, textarea = false }) {
  const { t } = useLang();
  const val = getPath(form, path) || {};
  const missingAr = (val.en || "") && !(val.ar || "");
  const update = (l, v) => setForm(setPath(form, path, { ...val, [l]: v }));
  return (
    <div>
      <span className={labelCls}>
        {label}
        {missingAr && (
          <span className="ms-2 inline-flex items-center gap-1 text-amber-400 normal-case tracking-normal">
            <AlertTriangle size={11} /> {t("admin.entity.translationMissing")}
          </span>
        )}
      </span>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <span className="block text-[10px] text-zinc-600 mb-1">EN</span>
          {textarea
            ? <textarea rows={3} className={inputCls} value={val.en || ""} onChange={(e) => update("en", e.target.value)} dir="ltr" />
            : <input className={inputCls} value={val.en || ""} onChange={(e) => update("en", e.target.value)} dir="ltr" />}
        </div>
        <div>
          <span className="block text-[10px] text-zinc-600 mb-1">AR</span>
          {textarea
            ? <textarea rows={3} className={inputCls} value={val.ar || ""} onChange={(e) => update("ar", e.target.value)} dir="rtl" />
            : <input className={inputCls} value={val.ar || ""} onChange={(e) => update("ar", e.target.value)} dir="rtl" />}
        </div>
      </div>
    </div>
  );
}

function FeaturesEditor({ form, setForm, path }) {
  const { t } = useLang();
  const features = getPath(form, path) || [];
  const update = (i, l, v) => {
    const copy = features.map((f, fi) => (fi === i ? { ...f, [l]: v } : f));
    setForm(setPath(form, path, copy));
  };
  return (
    <div>
      <span className={labelCls}>{t("admin.entity.features")}</span>
      <div className="space-y-2">
        {features.map((f, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <input className={inputCls} placeholder={t("admin.entity.featureEn")} value={f.en || ""} dir="ltr" onChange={(e) => update(i, "en", e.target.value)} />
            <input className={inputCls} placeholder={t("admin.entity.featureAr")} value={f.ar || ""} dir="rtl" onChange={(e) => update(i, "ar", e.target.value)} />
            <button type="button" onClick={() => setForm(setPath(form, path, features.filter((_, fi) => fi !== i)))}
                    className="p-2 text-zinc-600 hover:text-red-400 transition-colors" aria-label="Remove feature">
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" data-testid="entity-add-feature"
              onClick={() => setForm(setPath(form, path, [...features, { en: "", ar: "" }]))}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#CCFF00] hover:text-[#E6FF66]">
        <Plus size={13} /> {t("admin.entity.addFeature")}
      </button>
    </div>
  );
}

export default function EntityPage({ endpoint, titleKey, fields, columns, testPrefix }) {
  const { t, bi } = useLang();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | {} for new | item for edit
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get(`/admin/${endpoint}`).then((r) => setItems(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, [endpoint]);

  const startNew = () => {
    const blank = { is_published: true, display_order: items.length + 1, features: [], seo: {} };
    fields.forEach((f) => {
      if (f.type === "bi" || f.type === "bitextarea") blank[f.key] = { en: "", ar: "" };
      if (f.type === "bool") blank[f.key] = false;
      if (f.default !== undefined) blank[f.key] = f.default;
    });
    setEditing(blank);
    setIsNew(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...editing };
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
      if (typeof payload.gallery === "string")
        payload.gallery = payload.gallery.split(",").map((s) => s.trim()).filter(Boolean);
      if (isNew) await api.post(`/admin/${endpoint}`, payload);
      else await api.put(`/admin/${endpoint}/${editing.slug}`, payload);
      toast.success(t("admin.entity.saved"));
      setEditing(null);
      load();
    } catch (e) {
      toast.error(formatApiError(e, t("common.error")));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (slug) => {
    if (!window.confirm(t("admin.entity.deleteConfirm"))) return;
    try {
      await api.delete(`/admin/${endpoint}/${slug}`);
      toast.success(t("admin.entity.deleted"));
      load();
    } catch (e) { toast.error(formatApiError(e, t("common.error"))); }
  };

  const renderField = (f) => {
    const key = `${f.key}`;
    if (f.type === "bi") return <BilingualField key={key} form={editing} setForm={setEditing} path={f.key} label={t(f.label)} />;
    if (f.type === "bitextarea") return <BilingualField key={key} form={editing} setForm={setEditing} path={f.key} label={t(f.label)} textarea />;
    if (f.type === "features") return <FeaturesEditor key={key} form={editing} setForm={setEditing} path={f.key} />;
    if (f.type === "bool") {
      return (
        <label key={key} className="flex items-center gap-2.5 text-sm text-zinc-300 cursor-pointer">
          <input type="checkbox" checked={!!getPath(editing, f.key)} onChange={(e) => setEditing(setPath(editing, f.key, e.target.checked))}
                 className="w-4 h-4 accent-[#CCFF00]" />
          {t(f.label)}
        </label>
      );
    }
    if (f.type === "select") {
      return (
        <div key={key}>
          <span className={labelCls}>{t(f.label)}</span>
          <select className={inputCls} value={getPath(editing, f.key) || ""} onChange={(e) => setEditing(setPath(editing, f.key, e.target.value))}>
            {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      );
    }
    if (f.type === "number") {
      return (
        <div key={key}>
          <span className={labelCls}>{t(f.label)}</span>
          <input type="number" className={inputCls} value={getPath(editing, f.key) ?? ""}
                 onChange={(e) => setEditing(setPath(editing, f.key, e.target.value === "" ? null : Number(e.target.value)))} dir="ltr" />
        </div>
      );
    }
    if (f.type === "textarea") {
      return (
        <div key={key}>
          <span className={labelCls}>{t(f.label)}</span>
          <textarea rows={2} className={inputCls} value={getPath(editing, f.key) || ""} dir="ltr"
                    onChange={(e) => setEditing(setPath(editing, f.key, e.target.value))} />
        </div>
      );
    }
    return (
      <div key={key}>
        <span className={labelCls}>{t(f.label)}</span>
        <input className={inputCls} value={getPath(editing, f.key) ?? ""} dir={f.ltr ? "ltr" : undefined}
               onChange={(e) => setEditing(setPath(editing, f.key, e.target.value))} />
      </div>
    );
  };

  return (
    <div data-testid={`admin-${testPrefix}`}>
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight uppercase">{t(titleKey)}</h1>
        <button data-testid={`${testPrefix}-add`} onClick={startNew}
                className="inline-flex items-center gap-2 bg-[#CCFF00] text-[#08080A] px-4 py-2.5 text-xs font-extrabold uppercase tracking-widest hover:bg-[#E6FF66] transition-colors">
          <Plus size={14} /> {t("admin.entity.add")}
        </button>
      </div>

      {editing && (
        <div className="border border-zinc-700 bg-[#0A0A0D] p-6 sm:p-8 mb-10 space-y-5" data-testid={`${testPrefix}-editor`}>
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold tracking-tight">{isNew ? t("admin.entity.add") : t("admin.entity.edit")}</h2>
            <button onClick={() => setEditing(null)} aria-label="Close editor" className="p-1.5 text-zinc-500 hover:text-zinc-200"><X size={18} /></button>
          </div>
          {renderField({ key: "slug", label: "admin.entity.slug", ltr: true })}
          <div className="grid gap-5">{fields.map(renderField)}</div>
          <div className="flex gap-3 pt-3 border-t border-zinc-800">
            <button data-testid={`${testPrefix}-save`} onClick={save} disabled={saving}
                    className="bg-[#CCFF00] text-[#08080A] px-6 py-3 text-xs font-extrabold uppercase tracking-widest hover:bg-[#E6FF66] transition-colors disabled:opacity-50">
              {saving ? t("admin.entity.saving") : t("admin.entity.save")}
            </button>
            <button onClick={() => setEditing(null)}
                    className="border border-zinc-700 px-6 py-3 text-xs font-extrabold uppercase tracking-widest hover:border-zinc-500 transition-colors">
              {t("admin.entity.cancel")}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="font-mono-x text-sm text-zinc-500">{t("common.loading")}</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-zinc-500 border border-zinc-800 p-6">{t("admin.entity.empty")}</p>
      ) : (
        <div className="border border-zinc-800 divide-y divide-zinc-800/70">
          {items.map((item) => (
            <div key={item.slug} data-testid={`${testPrefix}-row-${item.slug}`}
                 className="flex items-center justify-between gap-4 p-4 hover:bg-[#0C0C0F] transition-colors">
              <div className="min-w-0 flex items-center gap-4">
                {item.image && <img src={item.image} alt="" className="w-14 h-10 object-cover border border-zinc-800 shrink-0 hidden sm:block" />}
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">{bi(item.title || item.name)}</p>
                  <p className="text-[11px] text-zinc-500 font-mono-x truncate" dir="ltr">/{item.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {columns?.(item)}
                <span className={`hidden sm:inline font-mono-x text-[9px] uppercase tracking-[0.15em] px-2 py-1 border ${item.is_published ? "border-[#CCFF00]/50 text-[#CCFF00]" : "border-zinc-700 text-zinc-500"}`}>
                  {item.is_published ? t("admin.entity.published") : t("admin.entity.unpublished")}
                </span>
                <button data-testid={`${testPrefix}-edit-${item.slug}`} onClick={() => { setEditing(JSON.parse(JSON.stringify(item))); setIsNew(false); }}
                        className="p-2 text-zinc-500 hover:text-[#CCFF00] transition-colors" aria-label="Edit">
                  <Pencil size={15} />
                </button>
                <button data-testid={`${testPrefix}-delete-${item.slug}`} onClick={() => remove(item.slug)}
                        className="p-2 text-zinc-500 hover:text-red-400 transition-colors" aria-label="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
