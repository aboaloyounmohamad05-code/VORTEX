import EntityPage from "@/components/admin/EntityPage";

const FIELDS = [
  { key: "title", type: "bi", label: "admin.entity.title" },
  { key: "short", type: "bitextarea", label: "admin.entity.shortDesc" },
  { key: "description", type: "bitextarea", label: "admin.entity.fullDesc" },
  { key: "features", type: "features" },
  { key: "icon", type: "text", label: "admin.entity.icon", ltr: true },
  { key: "image", type: "text", label: "admin.entity.image", ltr: true },
  { key: "seo.title", type: "bi", label: "admin.entity.seoTitle" },
  { key: "seo.description", type: "bi", label: "admin.entity.seoDesc" },
  { key: "is_published", type: "bool", label: "admin.entity.published" },
  { key: "display_order", type: "number", label: "admin.entity.order" },
];

export default function ServicesAdmin() {
  return <EntityPage endpoint="services" titleKey="admin.nav.services" fields={FIELDS} testPrefix="services" />;
}
