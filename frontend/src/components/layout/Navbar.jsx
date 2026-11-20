import React, { useState, useEffect } from "react";
import logo from "../../assets/CMP_Logo_Transparant.png";

const NAV_LINKS = [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#portfolio-projects", label: "Portfolio" },
];

// Section IDs to observe (must match the id attributes on each section)
const SECTION_IDS = ["homepage", "about", "services", "portfolio-projects", "contact"];

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("homepage");
    const [menuOpen, setMenuOpen] = useState(false);

    // Custom smooth scroll function with duration
    const handleScroll = (e, href) => {
        e.preventDefault();
        setMenuOpen(false); // Close mobile menu if open

        const targetId = href.replace("#", "");
        const elem = document.getElementById(targetId);
        if (!elem) return;

        const targetPosition = elem.getBoundingClientRect().top + window.scrollY;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        
        // ── ATUR KECEPATAN SCROLL DI SINI (dalam milidetik) ──
        const duration = 1200; // 1200ms = 1.2 detik
        
        let start = null;

        window.requestAnimationFrame(function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            
            // Easing function (easeInOutCubic) agar gerakan mulus
            const easeInOutCubic = progress / duration < 0.5 
                ? 4 * Math.pow(progress / duration, 3) 
                : 1 - Math.pow(-2 * (progress / duration) + 2, 3) / 2;
            
            // Limit progress to max 1 to avoid overshooting
            const currentProgress = Math.min(progress / duration, 1);
            const easing = currentProgress < 0.5 
                ? 4 * currentProgress * currentProgress * currentProgress 
                : 1 - Math.pow(-2 * currentProgress + 2, 3) / 2;
                
            window.scrollTo(0, startPosition + distance * easing);
            
            if (progress < duration) {
                window.requestAnimationFrame(step);
            } else {
                window.scrollTo(0, targetPosition);
            }
        });
    };

    // Scroll → solid navbar
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // IntersectionObserver → active section tracking
    useEffect(() => {
        const observers = [];

        SECTION_IDS.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;

            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveSection(id);
                },
                { threshold: 0.1 }
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, []);

    const isActive = (href) => {
        const sectionId = href.replace("#", "");
        return activeSection === sectionId;
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-[#03365b]/95 shadow-md border-b border-white/10"
                    : "bg-transparent border-b border-transparent"
            }`}
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                <div className="relative flex h-16 items-center justify-between">

                    {/* Logo */}
                    <a
                        href="#homepage"
                        onClick={(e) => handleScroll(e, '#homepage')}
                        className="flex items-center gap-3 flex-shrink-0 cursor-pointer"
                    >
                        <img
                            src={logo}
                            alt="CMP Cipta Maju Persada"
                            className="h-10 transition-transform duration-300 hover:scale-105"
                        />
                    </a>

                    {/* Desktop links */}
                    <div className="hidden sm:flex items-center gap-1">
                        {NAV_LINKS.map(({ href, label }) => (
                            <a
                                key={href}
                                href={href}
                                onClick={(e) => handleScroll(e, href)}
                                className={`relative rounded-md px-4 py-2 text-sm font-medium transition-all duration-300 ${
                                    isActive(href)
                                        ? "text-[#00A3E0]"
                                        : "text-white/90 hover:text-white"
                                }`}
                            >
                                {label}
                                {/* Active underline */}
                                <span
                                    className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-[#00A3E0] transition-all duration-300 ${
                                        isActive(href) ? "w-5/6" : "w-0"
                                    }`}
                                />
                            </a>
                        ))}

                        {/* CTA */}
                        <a
                            href="#contact"
                            onClick={(e) => handleScroll(e, '#contact')}
                            className="ml-4 rounded-full bg-white text-[#03365b] px-5 py-2 text-sm font-semibold transition-all duration-300 hover:bg-[#007CA7] hover:text-white hover:shadow-lg hover:scale-105"
                        >
                            Get in Touch
                        </a>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="sm:hidden flex flex-col gap-1.5 p-2"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        <span className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                        <span className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                        <span className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`sm:hidden overflow-hidden transition-all duration-300 ${
                    menuOpen ? "max-h-80 border-t border-white/10" : "max-h-0"
                } bg-[#03365b] shadow-xl`}
            >
                <div className="flex flex-col px-6 py-4 gap-2">
                    {NAV_LINKS.map(({ href, label }) => (
                        <a
                            key={href}
                            href={href}
                            onClick={(e) => handleScroll(e, href)}
                            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                                isActive(href)
                                    ? "bg-white/10 text-white font-bold"
                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {label}
                        </a>
                    ))}
                    <a
                        href="#contact"
                        onClick={(e) => handleScroll(e, '#contact')}
                        className="mt-2 rounded-xl bg-[#007CA7] px-4 py-2.5 text-center text-sm font-semibold text-white"
                    >
                        Get in Touch
                    </a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
