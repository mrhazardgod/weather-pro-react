import type { Translations } from "../types";

interface Props { t: Translations }

export default function Footer({ t }: Props) {
  return (
    <footer id="site-footer" className="site-footer" data-edit-id="site-footer">
      <span id="footer-copyright" data-edit-id="footer-copyright">{t.footerCopyright}</span>
      <span id="footer-datasource" data-edit-id="footer-datasource">{t.footerDatasource}</span>
    </footer>
  );
}