import React from 'react';
import bgSimple from '../../assets/bg_simple.png';
import img01 from '../../assets/01_services.png';
import img02 from '../../assets/02_services.png';
import img03 from '../../assets/03_services.png';
import img04 from '../../assets/04_services.png';
import img05 from '../../assets/05_services.png';
import img06 from '../../assets/06_services.png';
import { useInView } from '../../hooks/useInView';

const SERVICES = [
    {
        title: "Mechanical Electrical Design",
        desc: "Turning ideas into practical designs.",
        img: img01,
        targetCategory: "Engineering",
    },
    {
        title: "Procurement",
        desc: "Sourcing the right equipment and materials.",
        img: img02,
        targetCategory: "Engineering",
    },
    {
        title: "Manufacture",
        desc: "Custom panel and system manufacturing.",
        img: img03,
        targetCategory: "Automation",
    },
    {
        title: "Project Erection",
        desc: "Installation and construction on-site.",
        img: img04,
        targetCategory: "Construction",
    },
    {
        title: "Software Development",
        desc: "Automation and control system development.",
        img: img05,
        targetCategory: "Automation",
    },
    {
        title: "Trouble Shooting",
        desc: "Testing, debugging, and ongoing support.",
        img: img06,
        targetCategory: "Marine",
    },
];

// 5 Smooth, Synchronized Curved Dashed Connectors connecting card to card
// Undulating flow: TOP (175) <-> BOTTOM (215)
const CONNECTORS = [
    // 01 (TOP) -> 02 (BOTTOM)
    "M 180 175 C 196 175, 204 215, 220 215",
    // 02 (BOTTOM) -> 03 (TOP)
    "M 380 215 C 396 215, 404 175, 420 175",
    // 03 (TOP) -> 04 (BOTTOM)
    "M 580 175 C 596 175, 604 215, 620 215",
    // 04 (BOTTOM) -> 05 (TOP)
    "M 780 215 C 796 215, 804 175, 820 175",
    // 05 (TOP) -> 06 (BOTTOM)
    "M 980 175 C 996 175, 1004 215, 1020 215",
];

function Services() {
    const [sectionRef, isVisible] = useInView(0.12);

    const handleServiceClick = (targetCategory) => {
        window.dispatchEvent(new CustomEvent('changeCategory', { detail: targetCategory }));

        const target = document.getElementById('portfolio-projects');
        if (!target) return;

        const navbarOffset = 70;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarOffset;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 1100; // 1.1s cinematic smooth glide
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
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
        }

        window.requestAnimationFrame(step);
    };

    return (
        <section
            id="services"
            ref={sectionRef}
            className="scroll-mt-16 relative overflow-hidden bg-white py-10 sm:py-14 md:py-24 px-4 sm:px-6 lg:px-8 xl:px-12"
        >
            {/* Background Canvas (bg_simple.png) */}
            <div
                className="absolute inset-0 pointer-events-none bg-no-repeat bg-cover bg-center opacity-85"
                style={{
                    backgroundImage: `url(${bgSimple})`,
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 100px, black calc(100% - 100px), transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100px, black calc(100% - 100px), transparent 100%)'
                }}
            />

            <div className="relative z-10 mx-auto max-w-7xl">
                {/* Header with Staggered Visual Entrance Animations */}
                <div className="mx-auto max-w-4xl text-center">
                    {/* Eyebrow Label */}
                    <p
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                            transition: isVisible
                                ? 'opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1) 60ms, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1) 60ms'
                                : 'opacity 0.25s ease, transform 0.25s ease',
                        }}
                        className="text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-[#00A3E0] will-change-transform"
                    >
                        TURNKEY PROJECTS
                    </p>

                    {/* Headline */}
                    <h2
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'translateY(0)' : 'translateY(22px)',
                            transition: isVisible
                                ? 'opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1) 160ms, transform 0.75s cubic-bezier(0.22, 1, 0.36, 1) 160ms'
                                : 'opacity 0.25s ease, transform 0.25s ease',
                        }}
                        className="mt-2 text-2xl sm:text-3xl md:text-[42px] lg:text-5xl font-extrabold text-[#03365b] tracking-tight leading-tight will-change-transform"
                    >
                        Built from Idea <span className="text-[#00A3E0]">to Operation.</span>
                    </h2>

                    {/* Accent Divider Bar (expands outward from center) */}
                    <div
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
                            transition: isVisible
                                ? 'opacity 0.6s ease 280ms, transform 0.75s cubic-bezier(0.22, 1, 0.36, 1) 280ms'
                                : 'opacity 0.25s ease, transform 0.25s ease',
                        }}
                        className="mx-auto mt-2.5 sm:mt-3.5 h-1 sm:h-1.5 w-14 sm:w-20 rounded-full bg-[#00A3E0] origin-center will-change-transform"
                    />

                    {/* Subtitle / Description */}
                    <p
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'translateY(0)' : 'translateY(18px)',
                            transition: isVisible
                                ? 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1) 360ms, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 360ms'
                                : 'opacity 0.25s ease, transform 0.25s ease',
                        }}
                        className="mx-auto mt-3 sm:mt-4 max-w-2xl text-xs sm:text-base md:text-lg leading-relaxed md:leading-8 text-slate-600 font-medium will-change-transform"
                    >
                        We integrate every stage of your project into one seamless solution.
                    </p>
                </div>

                {/* ── DESKTOP LAYOUT (Smooth Sequential Cascade: Cards & Connecting Lines One-by-One) ── */}
                <div className="hidden lg:block relative mt-14 xl:mt-16 pb-12">
                    {/* Sequential Curved Dashed Connector Lines (Drawing in rhythm between cards, 100% hidden before render) */}
                    <div
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transition: isVisible ? 'opacity 0.5s ease 200ms' : 'opacity 0.2s ease',
                        }}
                        className="absolute inset-0 pointer-events-none z-0 overflow-visible"
                    >
                        <svg
                            className="w-full h-full"
                            viewBox="0 0 1200 420"
                            preserveAspectRatio="none"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                {CONNECTORS.map((pathD, idx) => (
                                    <mask key={`mask-${idx}`} id={`line-mask-${idx}`}>
                                        <path
                                            d={pathD}
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="24"
                                            strokeLinecap="butt"
                                            pathLength="100"
                                            strokeDasharray="100"
                                            strokeDashoffset={isVisible ? 0 : 100}
                                            style={{
                                                transition: isVisible
                                                    ? `stroke-dashoffset 1.35s cubic-bezier(0.16, 1, 0.3, 1) ${440 + idx * 450}ms`
                                                    : 'stroke-dashoffset 0.2s ease',
                                            }}
                                        />
                                    </mask>
                                ))}
                            </defs>

                            {CONNECTORS.map((pathD, idx) => (
                                <path
                                    key={idx}
                                    d={pathD}
                                    fill="none"
                                    stroke="#00A3E0"
                                    strokeWidth="3"
                                    strokeDasharray="6 4"
                                    strokeOpacity="1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    mask={`url(#line-mask-${idx})`}
                                    style={{
                                        opacity: isVisible ? 1 : 0,
                                        transition: isVisible
                                            ? `opacity 0.8s ease ${440 + idx * 450}ms`
                                            : 'opacity 0.15s ease',
                                    }}
                                />
                            ))}
                        </svg>
                    </div>

                    {/* 6 Columns Grid with Alternating TOP / BOTTOM Positioning (Smooth Sequential Entrance) */}
                    <div className="relative z-10 grid grid-cols-6 gap-4 xl:gap-5 items-start">
                        {SERVICES.map((svc, i) => (
                            <div
                                key={svc.title}
                                style={{
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.96)',
                                    transition: isVisible
                                        ? `opacity 1.6s cubic-bezier(0.16, 1, 0.3, 1) ${200 + i * 450}ms, transform 1.6s cubic-bezier(0.16, 1, 0.3, 1) ${200 + i * 450}ms`
                                        : 'opacity 0.25s ease, transform 0.25s ease',
                                }}
                                className={`w-full will-change-transform ${i % 2 === 1 ? 'lg:mt-[68px]' : 'lg:mt-0'}`}
                            >
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleServiceClick(svc.targetCategory)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            handleServiceClick(svc.targetCategory);
                                        }
                                    }}
                                    className={`group relative flex flex-col justify-between h-[285px] xl:h-[305px] p-4 xl:p-4.5 rounded-2xl bg-white border ${
                                        i === 0
                                            ? 'border-slate-200 hover:border-slate-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]'
                                            : 'border-slate-200 hover:border-[#00A3E0]/35 hover:shadow-[0_20px_40px_rgba(0,163,224,0.14)]'
                                    } shadow-md transform-gpu transition-all duration-300 ease-out hover:-translate-y-1.5 cursor-pointer text-left outline-none focus:outline-none focus-visible:outline-none overflow-hidden`}
                                >
                                    {/* Subtle gradient accent on hover */}
                                    <div
                                        className={`absolute inset-0 ${
                                            i === 0
                                                ? 'bg-gradient-to-br from-slate-100/40 to-transparent'
                                                : 'bg-gradient-to-br from-[#00A3E0]/5 to-transparent'
                                        } opacity-0 transition-opacity duration-400 group-hover:opacity-100 pointer-events-none z-0`}
                                    />

                                    {/* Top Content: Clear Step Number, Title & Description (Uniform Spacing) */}
                                    <div className="relative z-20 w-full flex flex-col items-start text-left pt-1 min-h-[110px] xl:min-h-[118px]">
                                        {/* Clear, Bold Step Number Badge */}
                                        <span className="inline-flex items-center justify-center text-xs xl:text-[13px] font-extrabold tracking-wider text-[#00A3E0] bg-[#00A3E0]/10 px-2.5 py-1 rounded-lg border border-[#00A3E0]/20 group-hover:bg-[#00A3E0] group-hover:text-white transition-all duration-300 mb-2 select-none">
                                            0{i + 1}
                                        </span>

                                        {/* Service Title */}
                                        <h3 className="text-[13.5px] xl:text-[14.5px] font-bold text-[#03365b] leading-tight transition-colors duration-300 group-hover:text-[#00A3E0]">
                                            {svc.title}
                                        </h3>

                                        {/* Short Description — uniformly spaced 6px under title */}
                                        <p className="mt-1.5 text-[11px] xl:text-xs text-slate-500 leading-relaxed">
                                            {svc.desc}
                                        </p>
                                    </div>

                                    {/* 3D PNG Element - floating naturally without platform or pedestal */}
                                    <div className="relative z-20 w-full h-[135px] xl:h-[155px] flex items-end justify-center pt-2 mt-auto">
                                        {/* 3D Model with smooth scale & float */}
                                        <img
                                            src={svc.img}
                                            alt={svc.title}
                                            loading="lazy"
                                            className="relative z-10 max-h-[120px] xl:max-h-[140px] w-auto object-contain transform-gpu transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-1 drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)]"
                                        />
                                    </div>

                                    {/* Bottom accent line — expands from center on hover (omitted on Card 01 to keep border 100% blue-free) */}
                                    {i !== 0 && (
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-[#00A3E0] transition-all duration-500 ease-out group-hover:w-full z-20 pointer-events-none rounded-full" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── MOBILE & TABLET LAYOUT (< lg: Matching Desktop Cards in Clean 2-Col Grid) ── */}
                <div className="lg:hidden relative mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {SERVICES.map((svc, i) => (
                        <div
                            key={svc.title}
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
                                transition: isVisible
                                    ? `opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1) ${180 + i * 280}ms, transform 1.5s cubic-bezier(0.16, 1, 0.3, 1) ${180 + i * 280}ms`
                                    : 'opacity 0.25s ease, transform 0.25s ease',
                            }}
                            className="w-full will-change-transform"
                        >
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => handleServiceClick(svc.targetCategory)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleServiceClick(svc.targetCategory);
                                    }
                                }}
                                className={`group relative flex flex-col justify-between h-[215px] sm:h-[255px] p-3 sm:p-4 rounded-2xl bg-white border ${
                                    i === 0
                                        ? 'border-slate-200 hover:border-slate-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)]'
                                        : 'border-slate-200 hover:border-[#00A3E0]/35 hover:shadow-[0_16px_36px_rgba(0,163,224,0.12)]'
                                } shadow-md transform-gpu transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer text-left overflow-hidden outline-none focus:outline-none focus-visible:outline-none select-none`}
                            >
                                {/* Gradient accent on hover */}
                                <div
                                    className={`absolute inset-0 ${
                                        i === 0
                                            ? 'bg-gradient-to-br from-slate-100/40 to-transparent'
                                            : 'bg-gradient-to-br from-[#00A3E0]/5 to-transparent'
                                    } opacity-0 transition-opacity duration-400 group-hover:opacity-100 pointer-events-none z-0`}
                                />

                                {/* Top Content: Step Badge, Title & Desc */}
                                <div className="relative z-10 w-full flex flex-col items-start text-left">
                                    <span className="inline-flex items-center justify-center text-[10px] sm:text-xs font-extrabold tracking-wider text-[#00A3E0] bg-[#00A3E0]/10 px-2 py-0.5 rounded-md border border-[#00A3E0]/20 mb-1.5 select-none">
                                        0{i + 1}
                                    </span>
                                    <h3 className="text-xs sm:text-sm font-bold text-[#03365b] group-hover:text-[#00A3E0] transition-colors leading-tight line-clamp-2">
                                        {svc.title}
                                    </h3>
                                    <p className="mt-1 text-[10px] sm:text-[11px] text-slate-500 leading-snug line-clamp-2">
                                        {svc.desc}
                                    </p>
                                </div>

                                {/* 3D Model Asset anchored cleanly at bottom */}
                                <div className="relative z-10 w-full h-[90px] sm:h-[110px] flex items-end justify-center pt-1 mt-auto">
                                    <img
                                        src={svc.img}
                                        alt={svc.title}
                                        loading="lazy"
                                        className="max-h-[80px] sm:max-h-[100px] w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Bottom accent line on hover */}
                                {i !== 0 && (
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-[#00A3E0] transition-all duration-500 ease-out group-hover:w-full z-20 pointer-events-none rounded-full" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Services;
