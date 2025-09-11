import React,{useCallback} from "react";
import "./Layout.scss";

export const Layout = () => {
    // Parallax + beam follow (CSS variables)
    const handleMouseMove = useCallback((e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = x / rect.width;
        const cy = y / rect.height;

        // masz już to:
        el.style.setProperty("--mx", `${cx}`);
        el.style.setProperty("--my", `${cy}`);

        // DODAJ to (procenty, bez calc w CSS):
        el.style.setProperty("--spot-x", `${(cx * 100).toFixed(2)}%`);
        el.style.setProperty("--spot-y", `${(cy * 100).toFixed(2)}%`);
    }, []);

    const resetMouse = useCallback((e) => {
        const el = e.currentTarget;
        el.style.removeProperty("--rx");
        el.style.removeProperty("--ry");
        el.style.setProperty("--beamX", `12%`);
    }, []);

    return (
        <main className="layout">
            {/* HERO / HEADER */}
            <header
                className="header"
                aria-label="Hero"
                onMouseMove={handleMouseMove}
                onMouseLeave={resetMouse}
            >
                {/* Ribbon */}
                <div className="header-ribbon" aria-hidden="true">
                    <span className="header-ribbon__text">POZNAJ SWOICH DJ</span>
                </div>

                {/* Static glows */}
                <div className="header-glow" />
                <div className="header-glow-2" />

                {/* Particles + spotlight */}
                <div className="header-particles" aria-hidden="true" />
                <div className="header-spotlight" aria-hidden="true" />

                {/* Lasers */}
                <div className="header-lasers" aria-hidden="true">
                    <div className="header-laser-h" style={{ top: "14%" }} />
                    <div className="header-laser-h" style={{ top: "38%" }} />
                    <div className="header-laser-h" style={{ top: "62%" }} />
                    <div className="header-laser-d" style={{ top: "24%" }} />
                    <div className="header-laser-d" style={{ top: "74%" }} />
                    <div className="header-scanline" />
                    <div className="header-beam" />
                    <div className="header-beam-glow" />
                </div>

                {/* Content */}
                <div className="header-content">
                    <span className="header-eyebrow">✦ Witaj w strefie neonów ✦</span>

                    <h1 className="header-title cyber-title">
    <span className="glitch" data-text="POZNAJ SWOICH DJ">
      POZNAJ SWOICH DJ
    </span>
                    </h1>

                    <p className="header-subtitle cyber-subtitle">
                        Zanurz się w <span className="neon">rytmy przyszłości</span>,
                        gdzie muzyka i technologia splatają się w jedno.
                        Wyszukaj DJ-a i odkryj swój soundtrack do nocy.
                    </p>

                    {/* Search */}
                    <form className="dj-search" role="search" onSubmit={(e) => e.preventDefault()}>
                        <div className="dj-search__wrap">
                            <svg className="dj-search__icon" viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
                                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <input
                                className="dj-search__input"
                                type="search"
                                placeholder="🔍 Kogo chcesz dziś usłyszeć?"
                                aria-label="Szukaj DJ-a"
                            />
                            <button className="btn-primary dj-search__btn" type="submit">
                                Szukaj
                                <span className="btn-glow" />
                            </button>
                        </div>
                        <p className="dj-search__hint">⚡ Spróbuj: <strong>„Synthwave”</strong>, <strong>„Hardstyle”</strong>, <strong>„DJ Nova”</strong></p>
                    </form>


                    <div className="header-actions">
                        <a href="#ramowka" className="btn-primary">Zobacz ramówkę</a>
                        <a href="#kontakt" className="btn-ghost">Zaproponuj swojego DJ-a</a>
                    </div>
                </div>
            </header>

            {/* Placeholder następnych sekcji */}
            <section className="section" id="about" />
        </main>
    );
};




