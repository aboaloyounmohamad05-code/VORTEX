import EntityPage from "@/components/admin/EntityPage";
import { useLang } from "@/context/LangContext";

const FIELDS = [
  { key: "name", type: "bi", label: "admin.entity.name" },
  { key: "description", type: "bitextarea", label: "admin.entity.shortDesc" },
  { key: "features", type: "features" },
  { key: "is_custom_quote", type: "bool", label: "admin.entity.customQuote" },
  { key: "price", type: "number", label: "admin.entity.price" },
  { key: "currency", type: "text", label: "admin.entity.currency", ltr: true, default: "USD" },
  { key: "is_featured", type: "bool", label: "admin.entity.featured" },
  { key: "is_published", type: "bool", label: "admin.entity.published" },
  { key: "display_order", type: "number", label: "admin.entity.order" },
];

export default function PackagesAdmin() {
  const { t } = useLang();
  return (
    <EntityPage
      endpoint="packages"
      titleKey="admin.nav.packages"
      fields={FIELDS}
      testPrefix="packages"
      columns={(item) =>
        item.is_featured ? (
          <span className="hidden sm:inline font-mono-x text-[9px] uppercase tracking-[0.15em] px-2 py-1 border border-[#CCFF00]/50 text-[#CCFF00]">
            {t("pricing.featured")}
          </span>
        ) : null
      }
    />
  );
}
