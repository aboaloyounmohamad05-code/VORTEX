import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Instagram, Twitter, Linkedin, Dribbble, Mail, Phone, MapPin } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { api } from "@/lib/api";
import { Logo } from "@/components/Navbar";

export default function Footer() {
  const { lang, t, bi } = useLang();
  const [settings, setSettings] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get("/public/settings").then((r) => setSettings(r.data)).catch(() => {});
    api.get("/public/services").then((r) => setServices((r.data || []).slice(0, 5))).catch(() => {});
  }, []);

  const socials = settings?.socials || {};
  const socialLinks = [
    { key: "instagram", url: socials.instagram, Icon: Instagram, id: "social-instagram" },
    { key: "twitter", url: socials.twitter, Icon: Twitter, id: "social-twitter" },
    { key: "linkedin", url: socials.linkedin, Icon: Linkedin, id: "social-linkedin" },
    { key: "behance", url: socials.behance, Icon: Dribbble, id: "social-behance" },
  ].filter((s) => s.url);

  const explore = [
    { to: `/${lang}`, label: t("nav.home") },
    { to: `/${lang}/services`, label: t("nav.services") },
    { to: `/${lang}/portfolio`, label: t("nav.work") },
    { to: `/${lang}/pricing`, label: t("nav.pricing") },
    { to: `/${lang}/about`, label: t("nav.about") },
    { to: `/${lang}/contact`, label: t("nav.contact") },
  ];

  return (
    <footer data-testid="site-footer" className="border-t border-zinc-800/80 bg-[#0A0A0D]">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="mb-5" />
          <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
            {settings ? bi(settings.footer_text) : ""}
          </p>
          {socialLinks.length > 0 && (
            <div className="flex gap-3 mt-6">
              {socialLinks.map(({ key, url, Icon, id }) => (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer" data-testid={id}
                   aria-label={key}
                   className="w-9 h-9 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors duration-300">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          )}
        </div>

        <nav aria-label="Footer explore">
          <h3 className="font-mono-x text-xs uppercase tracking-[0.25em] text-[#CCFF00] mb-5">{t("footer.explore")}</h3>
          <ul className="space-y-2.5">
            {explore.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-zinc-400 hover:text-[#F7F7F4] transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer services">
          <h3 className="font-mono-x text-xs uppercase tracking-[0.25em] text-[#CCFF00] mb-5">{t("footer.servicesTitle")}</h3>
          <ul className="space-y-2.5">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to={`/${lang}/services/${s.slug}`} className="text-sm text-zinc-400 hover:text-[#F7F7F4] transition-colors">
                  {bi(s.title)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="font-mono-x text-xs uppercase tracking-[0.25em] text-[#CCFF00] mb-5">{t("footer.contactTitle")}</h3>
          <ul className="space-y-3 text-sm text-zinc-400">
            {settings?.contact_email && (
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-zinc-600 shrink-0" />
                <a href={`mailto:${settings.contact_email}`} dir="ltr" className="hover:text-[#F7F7F4] transition-colors">{settings.contact_email}</a>
              </li>
            )}
            {settings?.phone && (
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-zinc-600 shrink-0" />
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} dir="ltr" className="hover:text-[#F7F7F4] transition-colors">{settings.phone}</a>
              </li>
            )}
            {settings?.address && (
              <li className="flex items-center gap-2.5">
                <MapPin size={14} className="text-zinc-600 shrink-0" />
                <span>{bi(settings.address)}</span>
              </li>
            )}
          </ul>
          <Link to={`/${lang}/quote`} data-testid="footer-cta"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-[#CCFF00] hover:text-[#E6FF66] transition-colors">
            {t("nav.startProject")}
            <ArrowUpRight size={15} className="rtl:-scale-x-100" />
          </Link>
        </div>
      </div>

      <div className="border-t border-zinc-800/60">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} VORTEX. {t("footer.rights")}</p>
          <div className="flex items-center gap-5">
            <Link to={`/${lang}/privacy`} data-testid="footer-privacy" className="hover:text-zinc-300 transition-colors">{t("footer.privacy")}</Link>
            <Link to={`/${lang}/terms`} data-testid="footer-terms" className="hover:text-zinc-300 transition-colors">{t("footer.terms")}</Link>
            <span className="font-mono-x text-zinc-600">{t("footer.madeWith")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
