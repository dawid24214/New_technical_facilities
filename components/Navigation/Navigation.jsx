import { useEffect, useMemo, useRef, useState } from "react";
import "./Navigation.scss";

// Inline icons to avoid 'lucide-react' dependency
const IconMenu = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);
const IconX = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const NAV_ITEMS = [
    { label: "Start", href: "#start", desc: "Wróć na stronę główną" },
    { label: "O mnie", href: "#o-mnie", desc: "Poznaj mnie lepiej" },
    { label: "Projekty", href: "#projekty", desc: "Moje realizacje" },
    { label: "Cennik", href: "#cennik", desc: "Oferta i ceny" },
    { label: "Kontakt", href: "#kontakt", desc: "Skontaktuj się ze mną" },
];

export const Navigation = () => {
    const wrapRef = useRef(null);
    const railRef = useRef(null);
    const itemRefs = useRef([]);

    const [indicator, setIndicator] = useState({ x: 0, width: 0, ready: false });
    const [active, setActive] = useState(0);
    const [hover, setHover] = useState(null);
    const [openMobile, setOpenMobile] = useState(false);
    const [mouseIn, setMouseIn] = useState(false);
    const [mouseX, setMouseX] = useState(0);

    const techFontStyle = useMemo(
        () => ({
            fontFamily:
                '"Orbitron","Michroma","Exo 2", system-ui, ui-sans-serif, Segoe UI, Roboto, Arial, sans-serif',
        }),
        []
    );

    const targetIndex = hover ?? active;

    const recalcIndicator = () => {
        const el = itemRefs.current[targetIndex];
        const rail = railRef.current;
        if (!el || !rail) return;
        const rb = el.getBoundingClientRect();
        const wb = rail.getBoundingClientRect();
        setIndicator({ x: rb.left - wb.left + 8, width: rb.width - 16, ready: true });
    };

    useEffect(() => {
        // Recalc when target changes
        recalcIndicator();
        const on = () => recalcIndicator();
        window.addEventListener("resize", on);
        // keep simple & broadly compatible; passive not required here
        window.addEventListener("scroll", on, true);
        return () => {
            window.removeEventListener("resize", on);
            window.removeEventListener("scroll", on, true);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetIndex]);

    useEffect(() => {
        // Initial calc after first paint
        const id = setTimeout(() => recalcIndicator(), 50);
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const beamX = useMemo(() => {
        const wrap = wrapRef.current;
        if (!wrap) return 0;

        if (mouseIn) return mouseX;

        const el = itemRefs.current[active];
        const wb = wrap.getBoundingClientRect();
        if (!el) return wb.width / 2;
        const rb = el.getBoundingClientRect();
        return rb.left - wb.left + rb.width / 2;
    }, [mouseIn, mouseX, active]);

    const onMouseMove = (e) => {
        const wrap = wrapRef.current;
        if (!wrap) return;
        const wb = wrap.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - wb.left, wb.width));
        setMouseX(x);
    };

    return (
        <header className="nav-header" style={techFontStyle}>
            <div className="page-glow" />

            <div
                className="nav-wrap"
                ref={wrapRef}
                onMouseEnter={() => setMouseIn(true)}
                onMouseLeave={() => {
                    setMouseIn(false);
                    setHover(null);
                }}
                onMouseMove={onMouseMove}
            >
                <nav className="neon-nav" role="navigation" aria-label="Główna nawigacja">
                    {/* Laser background */}
                    <div className="laser-bg" aria-hidden>
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div
                                key={`h-${i}`}
                                className="laser-line-h"
                                style={{
                                    top: `${(i / 20) * 100}%`,
                                    animationDelay: `${(i % 6) * 0.25}s`,
                                    animationDuration: `${6 + (i % 6)}s`,
                                }}
                            />
                        ))}
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                key={`d-${i}`}
                                className="laser-line-d"
                                style={{
                                    top: `${(i / 12) * 100}%`,
                                    animationDelay: `${(i % 5) * 0.35}s`,
                                    animationDuration: `${5 + (i % 5)}s`,
                                }}
                            />
                        ))}
                        <div className="scanline" />
                        <div className="beam" style={{ left: `${beamX}px` }} aria-hidden />
                        <div className="beam-glow" style={{ left: `${beamX}px` }} aria-hidden />
                    </div>

                    {/* Head */}
                    <div className="nav-head">
                        <a href="#start" className="brand">
                            <span className="brand-dot" />
                            <span className="brand-text">
                GRO<span className="brand-accent">SZEK</span>
              </span>
                        </a>

                        <button
                            className="burger"
                            onClick={() => setOpenMobile((v) => !v)}
                            aria-label={openMobile ? "Zamknij menu" : "Otwórz menu"}
                            aria-expanded={openMobile}
                            aria-controls="mobile-menu"
                        >
                            {openMobile ? <IconX size={18} /> : <IconMenu size={18} />}
                            <span>Menu</span>
                        </button>
                    </div>

                    {/* Desktop links */}
                    <div className="rail-wrap" ref={railRef}>
                        <div className="rail">
                            {NAV_ITEMS.map((item, i) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    ref={(el) => (itemRefs.current[i] = el)}
                                    className={`nav-item ${i === active ? "is-active" : ""}`}
                                    onMouseEnter={() => setHover(i)}
                                    onMouseLeave={() => setHover(null)}
                                    onMouseMove={() => {
                                        const el = itemRefs.current[i];
                                        const wrap = wrapRef.current;
                                        if (!el || !wrap) return;
                                        const rb = el.getBoundingClientRect();
                                        const wb = wrap.getBoundingClientRect();
                                        setMouseX(rb.left - wb.left + rb.width / 2);
                                    }}
                                    onClick={() => {
                                        setActive(i);
                                        setHover(null);
                                    }}
                                >
                                    <span className="item-glow" aria-hidden />
                                    <div className="item-inner">
                                        <span className="item-label">{item.label}</span>
                                        <span className="item-desc">{item.desc}</span>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Bottom indicator */}
                        {indicator.ready && (
                            <>
                                <div
                                    className="indicator"
                                    style={{
                                        transform: `translateX(${indicator.x}px)`,
                                        width: `${indicator.width}px`,
                                    }}
                                    aria-hidden
                                />
                                <div
                                    className="indicator-glow"
                                    style={{
                                        transform: `translateX(${indicator.x}px)`,
                                        width: `${indicator.width}px`,
                                    }}
                                    aria-hidden
                                />
                            </>
                        )}
                    </div>

                    {/* Hover info */}
                    <div className="hover-info">
                        <div className="hover-info-inner">
              <span className="only-desktop">

              </span>
                            <span className="only-desktop">

              </span>
                        </div>
                    </div>

                    {/* Mobile */}
                    <div id="mobile-menu" className={`mobile ${openMobile ? "mobile--open" : ""}`}>
                        <ul className="mobile-list">
                            {NAV_ITEMS.map((item, i) => (
                                <li key={item.href}>
                                    <a
                                        href={item.href}
                                        className="mobile-link"
                                        onClick={() => {
                                            setActive(i);
                                            setOpenMobile(false);
                                        }}
                                    >
                                        <div className="mobile-item">
                                            <span>{item.label}</span>
                                            <span className="mobile-desc">{item.desc}</span>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                <div className="under-glow" aria-hidden />
            </div>

            <div className="header-spacer" />
        </header>
    );
};
