import EntityPage from "@/components/admin/EntityPage";
import { useLang } from "@/context/LangContext";

const FIELDS = [
  { key: "category", type: "select", label: "admin.entity.category", options: [
    { value: "restaurants", label: "Restaurants" }, { value: "hospitality", label: "Hospitality" },
    { value: "ecommerce", label: "E-commerce" }, { value: "corporate", label: "Corporate" },
    { value: "real-estate", label: "Real Estate" }, { value: "professional-services", label: "Professional Services" },
  ]},
  { key: "title", type: "bi", label: "admin.entity.title" },
  { key: "short", type: "bitextarea", label: "admin.entity.shortDesc" },
  { key: "description", type: "bitextarea", label: "admin.entity.fullDesc" },
  { key: "overview", type: "bitextarea", label: "admin.entity.overview" },
  { key: "objectives", type: "bitextarea", label: "admin.entity.objectives" },
  { key: "approach", type: "bitextarea", label: "admin.entity.approach" },
  { key: "challenges", type: "bitextarea", label: "admin.entity.challenges" },
  { key: "features", type: "features" },
  { key: "image", type: "text", label: "admin.entity.image", ltr: true },
  { key: "gallery", type: "textarea", label: "admin.entity.gallery", ltr: true },
  { key: "preview_url", type: "text", label: "admin.entity.previewUrl", ltr: true },
  { key: "seo.title", type: "bi", label: "admin.entity.seoTitle" },
  { key: "seo.description", type: "bi", label: "admin.entity.seoDesc" },
  { key: "is_concept", type: "bool", label: "admin.entity.concept" },
  { key: "is_published", type: "bool", label: "admin.entity.published" },
  { key: "display_order", type: "number", label: "admin.entity.order" },
];

export default function ProjectsAdmin() {
  const { t } = useLang();
  return (
    <EntityPage
      endpoint="projects"
      titleKey="admin.nav.projects"
      fields={FIELDS}
      testPrefix="projects"
      columns={(item) =>
        item.is_concept ? (
          <span className="hidden sm:inline font-mono-x text-[9px] uppercase tracking-[0.15em] px-2 py-1 border border-amber-600/50 text-amber-400">
            {t("portfolio.concept")}
          </span>
        ) : null
      }
    />
  );
}
