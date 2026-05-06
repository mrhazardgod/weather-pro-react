import { NavLink, Link } from "react-router-dom";
import type { Language, Theme, Translations } from "../types";

interface Props {
  t: Translations;
  language: Language;
  theme: Theme;
  onSetLanguage: (l: Language) => void;
  onToggleTheme: () => void;
}

export default function Header({ t, language, theme, onSetLanguage, onToggleTheme }: Props) {
  return (
    <header id="site-header" className="site-header" data-edit-id="site-header">
      <div className="header-inner">
        <Link to="/" id="logo-text" className="logo-text" data-edit-id="header-logo">
          {t.appName}
        </Link>
        <nav className="header-nav" data-edit-id="header-nav">
          <NavLink to="/" id="nav-home" className={({ isActive }) => "nav-link" + (isActive ? " nav-link--active" : "")} end data-edit-id="nav-home">
            {t.navHome}
          </NavLink>
          <NavLink to="/favorites" id="nav-favorites" className={({ isActive }) => "nav-link" + (isActive ? " nav-link--active" : "")} data-edit-id="nav-favorites">
            {t.navFavorites}
          </NavLink>
          <NavLink to="/history" id="nav-history" className={({ isActive }) => "nav-link" + (isActive ? " nav-link--active" : "")} data-edit-id="nav-history">
            {t.navHistory}
          </NavLink>
        </nav>
        <div className="header-controls" data-edit-id="header-controls">
          <div id="lang-switcher" className="lang-switcher" data-edit-id="lang-switcher">
            <button className={"lang-btn" + (language === "ru" ? " lang-btn--active" : "")} onClick={() => onSetLanguage("ru")} data-edit-id="lang-btn-ru">RU</button>
            <button className={"lang-btn" + (language === "en" ? " lang-btn--active" : "")} onClick={() => onSetLanguage("en")} data-edit-id="lang-btn-en">EN</button>
          </div>
          <button id="theme-switcher" className="theme-btn" onClick={onToggleTheme} data-edit-id="theme-switcher">
            {theme === "day" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}