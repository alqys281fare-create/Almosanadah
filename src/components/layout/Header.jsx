
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import SmartLink from "../common/SmartLink.jsx";
import { useContent } from "../../context/ContentContext.jsx";
import { useLang } from "../../i18n/LanguageContext.jsx";
import Icon from "../common/Icons.jsx";

/* Header fit levels.
   0 = full header, 1 / 2 = progressively tighter spacing (every link stays visible),
   3 (MAX_FIT) = burger + drawer. Nothing is ever hidden: if the links cannot fit, the burger menu takes over. */
const MAX_FIT = 3;
const GAP = 14;

const overlaps = (a, b) =>
  a.right + GAP > b.left && b.right + GAP > a.left;

/* Default actions */
const DEFAULT_ACTIONS = [
  {
    id: "services",
    label: "خدماتى التعليمية",
    href: "#services",
    variant: "ghost",
  },
  {
    id: "register",
    label: "سجل الان",
    href: "#register",
    variant: "primary",
  },
];

export default function Header() {
  const { content } = useContent();
  const { t, toggle, lang } = useLang();
  const { site, nav } = content;

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  const headerRef = useRef(null);
  const innerRef = useRef(null);
  const navRef = useRef(null);

  const [fit, setFit] = useState(0);
  const [measureKey, setMeasureKey] = useState(0);

  const { pathname, hash } = useLocation();

  /* Always leave the drawer when the user navigates */
  useEffect(() => {
    setOpen(false);
  }, [pathname, hash]);

  /* Topbar actions */
  const topbar = useMemo(() => {
    const tb = site.topbar || {};

    return {
      dashboard: {
        show: true,
        label: "",
        href: "/dashboard",
        icon: "user",
        ...(tb.dashboard || {}),
      },
      lang: {
        show: true,
        label: "",
        icon: "globe",
        ...(tb.lang || {}),
      },
    };
  }, [site.topbar]);

  const dashLabel =
    topbar.dashboard.label?.trim() || t("dashboard");

  const langLabel =
    topbar.lang.label?.trim() || t("switchLang");

  /* Custom CTA actions */
  const actions = useMemo(() => {
    const list = Array.isArray(site.actions) ? site.actions : [];
    return list.length ? list : DEFAULT_ACTIONS;
  }, [site.actions]);

  useEffect(() => {
    document.title = `${site.name} — ${site.subtitle}`;
  }, [site.name, site.subtitle]);

  /* Scroll detection */
  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        frame = 0;
      });
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);

      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isRoute = pathname !== "/";

  const go = (item) => {
    setActive(item.id);
    setOpen(false);
  };

  /* Navigation items */
  const navItems = nav;

  /* Header responsive measurement */
  const sig = [
    lang,
    site.name,
    site.subtitle,
    navItems.map((n) => n.label).join("|"),
    actions.map((a) => a.label).join("|"),
  ].join("¦");

  const [seenSig, setSeenSig] = useState(sig);

  if (seenSig !== sig) {
    setSeenSig(sig);
    setFit(0);
  }

  useEffect(() => {
    let raf = 0;
    let lastW = window.innerWidth;

    const remeasure = (force) => {
      cancelAnimationFrame(raf);

      raf = requestAnimationFrame(() => {
        if (!force && window.innerWidth === lastW) return;

        lastW = window.innerWidth;
        setFit(0);
        setMeasureKey((k) => k + 1);
      });
    };

    const onResize = () => remeasure(false);
    const onFonts = () => remeasure(true);

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    document.fonts?.ready?.then(onFonts);
    document.fonts?.addEventListener?.("loadingdone", onFonts);

    return () => {
      cancelAnimationFrame(raf);

      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);

      document.fonts?.removeEventListener?.("loadingdone", onFonts);
    };
  }, []);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    const navEl = navRef.current;

    if (!inner || !navEl) return;

    const burger = inner.querySelector(".burger");
    const drawerMode =
      !!burger && getComputedStyle(burger).display !== "none";

    if (drawerMode) return;

    if (open) setOpen(false);

    const brand = inner.querySelector(".brand");
    const end = inner.querySelector(".header__end");

    const b = brand.getBoundingClientRect();
    const n = navEl.getBoundingClientRect();
    const e = end.getBoundingClientRect();
    const i = inner.getBoundingClientRect();

    const brandCut = [
      ...brand.querySelectorAll(
        ".brand__text strong, .brand__text small"
      ),
    ].some((el) => el.scrollWidth > el.clientWidth + 1);

    /* the nav box itself is clamped to its grid column, so also compare the REAL width of its links */
    const navClipped = navEl.scrollWidth > navEl.clientWidth + 1;

    const fits =
      !navClipped &&
      !overlaps(n, b) &&
      !overlaps(n, e) &&
      !overlaps(b, e) &&
      !brandCut &&
      e.left >= i.left - 1 &&
      e.right <= i.right + 1;

    if (!fits && fit < MAX_FIT) {
      setFit(fit + 1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fit, measureKey, sig]);

  const compact = fit >= MAX_FIT;

  /* Prevent the services button from performing any action */
  const handleActionClick = (e, action) => {
    if (action.id === "services") {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <div className="topbar">
        <div className="container topbar__inner">

          <p className="institution-name">
            <img
              src="/flag.png"
              width={30}
              height={25}
              alt="Saudi flag"
            />

            <span className="institution-full" dir="auto">
              {t("institutionName")}
            </span>

            <span className="institution-short" dir="auto">
              {t("institutionShortName")}
            </span>
          </p>

          <div className="topbar__contact">
            <a href={`tel:${site.phone}`}>
              <Icon name="phone" size={15} />
              <span dir="ltr">{site.phone}</span>
            </a>

            <a href={`mailto:${site.email}`}>
              <Icon name="mail" size={15} />
              <span dir="ltr">{site.email}</span>
            </a>
          </div>

          <div className="topbar__actions">
            {topbar.dashboard.show && (
              <SmartLink
                href={topbar.dashboard.href || "/dashboard"}
                className="topbar__btn"
              >
                {topbar.dashboard.icon && (
                  <Icon name={topbar.dashboard.icon} size={14} />
                )}
                {dashLabel}
              </SmartLink>
            )}

            {topbar.lang.show && (
              <button
                type="button"
                className="topbar__lang"
                onClick={toggle}
              >
                {topbar.lang.icon && (
                  <Icon name={topbar.lang.icon} size={15} />
                )}
                {langLabel}
              </button>
            )}
          </div>
        </div>
      </div>

      <header
        ref={headerRef}
        className={`header ${
          scrolled ? "header--scrolled" : ""
        } ${open ? "header--menu-open" : ""} ${
          compact ? "header--compact" : ""
        }`}
        data-fit={fit}
      >
        <div
          className="container header__inner"
          ref={innerRef}
        >

          {/* Brand */}
          <SmartLink
            href={isRoute ? "/" : "#home"}
            className="brand"
            onClick={() => setActive("home")}
          >
            <span className="brand__logo">
              <img src="/almosanadah.png" alt={site.name} />
            </span>

            <span className="brand__text">
              <strong>{site.name}</strong>
              <small>{site.subtitle}</small>
            </span>
          </SmartLink>

          {/* Navigation */}
          <nav
            ref={navRef}
            id="main-nav"
            className={`nav ${open ? "nav--open" : ""}`}
            aria-label={t("mainNav")}
          >

            {/* Mobile brand */}
            <div className="nav__brand--mobile">
              <img src="/almosanadah.png" alt={site.name} />

              <div className="nav__brand-text">
                <strong>{site.name}</strong>
                <small>{site.subtitle}</small>
              </div>

              <button
                type="button"
                className="nav__close"
                aria-label={t("closeMenu")}
                onClick={() => setOpen(false)}
              >
                <Icon name="close" size={22} />
              </button>
            </div>

            {navItems.map((item) => {
              const isActive = isRoute
                ? item.href === pathname
                : active === item.id;

              return (
                <SmartLink
                  key={item.id}
                  href={item.href}
                  className={`nav__link${isActive ? " is-active" : ""}`}
                  onClick={() => go(item)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </SmartLink>
              );
            })}

            {/* Mobile dashboard */}
            {topbar.dashboard.show && (
              <SmartLink
                href={topbar.dashboard.href || "/dashboard"}
                className="nav__link nav__link--mobile"
                onClick={() => setOpen(false)}
              >
                {dashLabel}
              </SmartLink>
            )}

            {/* Mobile language */}
            {topbar.lang.show && (
              <button
                type="button"
                className="nav__link nav__link--mobile nav__lang"
                onClick={() => {
                  toggle();
                  setOpen(false);
                }}
              >
                {topbar.lang.icon && (
                  <Icon name={topbar.lang.icon} size={18} />
                )}
                {langLabel}
              </button>
            )}

            {/* Mobile CTA actions */}
            <div className="nav__actions-mobile">
              {actions.map((action) => (
                <SmartLink
                  key={`drawer-${action.id}`}
                  href={
                    action.id === "services"
                      ? undefined
                      : action.href
                  }
                  className={`nav__link nav__link--mobile nav__action ${
                    action.variant === "primary"
                      ? "nav__action--primary"
                      : ""
                  }`}
                  onClick={(e) =>
                    handleActionClick(e, action)
                  }
                >
                  {action.icon && (
                    <Icon name={action.icon} size={18} />
                  )}

                  <span>{action.label}</span>
                </SmartLink>
              ))}
            </div>
          </nav>

          {/* Header actions and burger */}
          <div className="header__end">

            <div className="header__actions">
              {actions.map((action) => (
                <SmartLink
                  key={action.id}
                  href={
                    action.id === "services"
                      ? undefined
                      : action.href
                  }
                  className={`header__action header__action--${
                    action.variant || "ghost"
                  }`}
                  onClick={(e) =>
                    handleActionClick(e, action)
                  }
                >
                  {action.icon && (
                    <Icon name={action.icon} size={14} />
                  )}

                  <span>{action.label}</span>
                </SmartLink>
              ))}
            </div>

            {/* Burger */}
            <button
              type="button"
              className="burger"
              aria-label={
                open ? t("closeMenu") : t("openMenu")
              }
              aria-expanded={open}
              aria-controls="main-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <Icon
                name={open ? "close" : "menu"}
                size={26}
              />
            </button>
          </div>
        </div>

        {/* Mobile backdrop */}
        {open && (
          <button
            type="button"
            className="nav-backdrop"
            aria-label={t("close")}
            onClick={() => setOpen(false)}
          />
        )}
      </header>
    </>
  );
}
