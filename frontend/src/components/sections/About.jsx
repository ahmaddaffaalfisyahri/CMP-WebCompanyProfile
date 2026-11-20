import React from 'react';
import certification1 from '../../assets/isocertification1.png';
import certification2 from '../../assets/isocertification2.jpg';
import certAk3 from '../../assets/cert_ak3.png';
import { useInView } from '../../hooks/useInView';
import aboutHeroBgClean from '../../assets/about_hero_bg_clean.jpg';
import aboutMobileHero from '../../assets/about_mobile_hero.jpg';
import bgSimple from '../../assets/bg_simple.png';
import bgSimple2 from '../../assets/bg_simple2.png';
import bgVision from '../../assets/bg_vision.png';
import bgMission from '../../assets/bg_mision.png';
import { Settings, Factory, Ship, BarChart2 } from 'lucide-react';

// ── Historical Milestones Data (Matching Approved Visual Concept) ─────────────
const MILESTONES = [
    {
        number: "01",
        year: "1997",
        title: "Automation Expertise",
        description: "Started as an independent automation system integrator.",
        icon: Settings,
    },
    {
        number: "02",
        year: "2002",
        title: "Industrial Experience",
        description: "Expanded into coal mining and industrial projects.",
        icon: Factory,
    },
    {
        number: "03",
        year: "2004",
        title: "Marine Engineering",
        description: "Delivered marine control systems solutions.",
        icon: Ship,
    },
    {
        number: "04",
        year: "2017",
        title: "Digital Solutions",
        description: "Web & Android-based monitoring systems.",
        icon: BarChart2,
    },
];

// ── Certifications Data 
const CERTIFICATIONS = [
    {
        id: "iso-9001",
        image: certification1,
        alt: "ISO 9001:2015",
        title: "ISO 9001:2015",
        description: "Quality Management System",
    },
    {
        id: "iso-45001",
        image: certification2,
        alt: "ISO 45001:2018",
        title: "ISO 45001:2018",
        description: "Occupational Health & Safety Management",
    },
    {
        id: "ak3",
        image: certAk3,
        alt: "AK3",
        title: "AK3",
        description: "Certification of AK3",
    },
];

// ── Reveal wrapper ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, direction = 'up', className = '' }) {
    const [ref, visible] = useInView(0.12);

    const transforms = {
        up: 'translateY(40px)',
        left: 'translateX(-50px)',
        right: 'translateX(50px)',
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : transforms[direction],
                transition: visible
                    ? `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`
                    : 'opacity 0.25s ease, transform 0.25s ease',
            }}
        >
            {children}
        </div>
    );
}

// ── Vision / Mission card ─────────────────────────────────────────────────────
function VMCard({ title, text, image, imageAlt, imagePosition = 'object-center', delay }) {
    const [ref, visible] = useInView(0.15);
    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateY(30px)',
                transition: visible
                    ? `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`
                    : 'opacity 0.25s ease, transform 0.25s ease',
            }}
            className="group relative h-full flex flex-col justify-between overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200 bg-white shadow-md transition-all duration-500 hover:border-[#00A3E0]/35 hover:shadow-[0_20px_40px_rgba(0,163,224,0.14)] text-left"
        >
            {/* Gradient accent on hover (matching Services) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00A3E0]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none z-10" />

            {/* Top Text Content */}
            <div className="p-4 sm:p-6 lg:p-7 flex-1 flex flex-col justify-start">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight group-hover:text-[#00A3E0] transition-colors duration-300">{title}</h3>
                <p className="mt-1.5 sm:mt-2.5 text-xs sm:text-sm md:text-base leading-relaxed sm:leading-7 text-slate-600">{text}</p>
            </div>

            {/* Horizontal Visual Area along the Bottom */}
            <div className="relative w-full h-36 sm:h-44 md:h-56 overflow-hidden">
                <img
                    src={image}
                    alt={imageAlt || title}
                    className={`w-full h-full object-cover ${imagePosition} transition-transform duration-700 ease-out group-hover:scale-[1.03]`}
                />
                {/* Seamless feathered blend into white card */}
                <div
                    className="absolute inset-x-0 top-0 h-12 sm:h-16 md:h-20 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.95) 25%, rgba(255,255,255,0.45) 65%, rgba(255,255,255,0) 100%)'
                    }}
                />
            </div>

            {/* Bottom accent line — expands from center */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-[#00A3E0] transition-all duration-500 ease-out group-hover:w-full z-20 pointer-events-none rounded-full" />
        </div>
    );
}

// ── Certification card ────────────────────────────────────────────────────────
function CertCard({ cert, delay }) {
    const [ref, visible] = useInView(0.1);

    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateY(24px)',
                transition: visible
                    ? `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`
                    : 'opacity 0.25s ease, transform 0.25s ease',
            }}
            className="group relative flex flex-col items-center justify-between h-full w-full rounded-2xl border border-slate-200 bg-white p-2.5 sm:p-5 lg:px-4 lg:py-6 xl:p-6 shadow-md transition-all duration-500 hover:border-[#00A3E0]/35 hover:shadow-[0_20px_40px_rgba(0,163,224,0.14)] overflow-hidden text-center cursor-pointer"
        >
            {/* Gradient accent on hover (matching Services) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00A3E0]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none z-0" />

            {/* Logo Area */}
            <div className="relative z-10 h-12 sm:h-20 lg:h-20 xl:h-22 w-full flex items-center justify-center mb-1.5 sm:mb-3.5">
                <img
                    src={cert.image}
                    alt={cert.alt}
                    className="max-h-10 sm:max-h-18 lg:max-h-16 xl:max-h-18 max-w-[90%] w-auto object-contain"
                />
            </div>

            {/* Content Area */}
            <div className="relative z-10 flex flex-col items-center flex-1 justify-start w-full">
                <h3 className="text-[11px] sm:text-base lg:text-[14.5px] xl:text-base font-bold text-[#03365b] tracking-tight group-hover:text-[#00A3E0] transition-colors duration-300 leading-tight sm:leading-snug min-h-[1.6rem] sm:min-h-[2.6rem] flex items-center justify-center">
                    {cert.title}
                </h3>
                {/* Small cyan horizontal divider */}
                <div className="w-4 sm:w-8 h-0.5 bg-[#00A3E0] my-1 sm:my-2.5 rounded-full" />
                <p className="text-[9px] sm:text-xs lg:text-[12px] xl:text-[13px] text-slate-600 leading-tight sm:leading-relaxed">
                    {cert.description}
                </p>
            </div>

            {/* Bottom accent line — expands from center to right and left */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-[#00A3E0] transition-all duration-500 ease-out group-hover:w-full z-20 pointer-events-none rounded-full" />
        </div>
    );
}

// ── About Us (Section 02) ───────────────────────────────────────────────────
export function AboutUs() {
    const [milestonesRef, milestonesVisible] = useInView(0.12);

    return (
        <div id="about" className="scroll-mt-16">
            {/* ── About Us Hero / Introduction Section ── */}
            <section id="aboutus" className="scroll-mt-20 relative bg-white overflow-hidden flex flex-col justify-start lg:justify-between pt-0 sm:pt-0 lg:pt-16 pb-10 sm:pb-14 lg:pb-16 lg:min-h-[640px] xl:min-h-[700px] px-0 lg:px-16">

                {/* Background Canvas (bg_simple.png) seamlessly continuing from Global Reach / Landing Page */}
                <div
                    className="absolute inset-0 pointer-events-none bg-no-repeat bg-cover bg-center opacity-80"
                    style={{
                        backgroundImage: `url(${bgSimple})`,
                    }}
                />

                {/* Full-bleed visual background artwork for Desktop (leaving the right open for engineer & panel) */}
                <div
                    className="hidden lg:block absolute inset-0 pointer-events-none bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${aboutHeroBgClean})`,
                        maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 30px, rgba(0,0,0,0.85) 80px, black 130px, black calc(100% - 130px), transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 30px, rgba(0,0,0,0.85) 80px, black 130px, black calc(100% - 130px), transparent 100%)',
                    }}
                />

                {/* Soft feathered top merge into Landing Page for Desktop */}
                <div
                    className="hidden lg:block absolute inset-x-0 top-0 h-16 sm:h-28 pointer-events-none z-10"
                    style={{
                        background: 'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.85) 35%, rgba(255,255,255,0) 100%)'
                    }}
                />

                {/* ── Mobile/Tablet Visual Hero: Photo never gepeng (object-cover) + top follows :( curve + silky alpha fade ── */}
                <div className="lg:hidden relative w-full overflow-hidden leading-none select-none z-10 -mt-0.5 mb-5 sm:mb-7">
                    {/* Photo Container with Apple-grade alpha mask: Photo never gepeng, bottom dissolves smoothly into background */}
                    <div
                        className="relative w-full h-[280px] sm:h-[340px] overflow-hidden"
                        style={{
                            maskImage: 'linear-gradient(to bottom, black 0%, black 32%, rgba(0,0,0,0.92) 45%, rgba(0,0,0,0.72) 58%, rgba(0,0,0,0.45) 72%, rgba(0,0,0,0.20) 84%, rgba(0,0,0,0.05) 94%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 32%, rgba(0,0,0,0.92) 45%, rgba(0,0,0,0.72) 58%, rgba(0,0,0,0.45) 72%, rgba(0,0,0,0.20) 84%, rgba(0,0,0,0.05) 94%, transparent 100%)',
                        }}
                    >
                        {/* Real photo with object-cover: 100% guaranteed natural aspect ratio (NO GEPENG!) */}
                        <img
                            src={aboutMobileHero}
                            alt="CMP Automation Engineers"
                            className="w-full h-full object-cover object-[center_20%]"
                        />

                        {/* Ultra-soft bottom light dissolve ensuring 100% silky blend into white canvas */}
                        <div 
                            className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
                            style={{
                                background: 'linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.92) 35%, rgba(255,255,255,0.5) 65%, transparent 100%)'
                            }}
                        />
                    </div>

                    {/* Top Curve Mask: Sculpted precisely along the :( curve arch */}
                    <div className="absolute top-0 left-0 w-full pointer-events-none z-20">
                        <svg
                            viewBox="0 0 1440 100"
                            preserveAspectRatio="none"
                            className="w-full h-14 sm:h-18 md:h-22 block"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                {/* Glow filter for cyan curve */}
                                <filter id="mobileCurveGlow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="4" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>

                                {/* Deep industrial navy gradient matching Homepage bottom */}
                                <linearGradient id="homepageBlueFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#03365b" stopOpacity="1" />
                                    <stop offset="70%" stopColor="#022e4f" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#02243e" stopOpacity="1" />
                                </linearGradient>
                            </defs>

                            {/* 1. Deep blue fill above the curve to seamlessly continue Homepage */}
                            <path
                                d="M 0,0 L 1440,0 L 1440,95 C 1040,20 400,20 0,95 Z"
                                fill="url(#homepageBlueFill)"
                            />

                            {/* 2. Ambient Cyan Glow along the Curve */}
                            <path
                                d="M 0,95 C 400,20 1040,20 1440,95"
                                stroke="#00A3E0"
                                strokeWidth="10"
                                strokeOpacity="0.45"
                                filter="url(#mobileCurveGlow)"
                                fill="none"
                            />

                            {/* 3. Subtle Cyan Accent Echo Curve above */}
                            <path
                                d="M 0,86 C 400,12 1040,12 1440,86"
                                stroke="#00A3E0"
                                strokeWidth="1.5"
                                strokeOpacity="0.35"
                                fill="none"
                            />

                            {/* 4. Signature Cyan Curve Line */}
                            <path
                                d="M 0,95 C 400,20 1040,20 1440,95"
                                stroke="#00A3E0"
                                strokeWidth="2.8"
                                strokeLinecap="round"
                                fill="none"
                            />

                            {/* 5. Left Glowing Node */}
                            <circle cx="144" cy="74" r="5" fill="#ffffff" stroke="#00A3E0" strokeWidth="2" />
                            <circle cx="144" cy="74" r="2.5" fill="#007CA7" />

                            {/* 6. Right Glowing Node */}
                            <circle cx="1296" cy="74" r="5" fill="#ffffff" stroke="#00A3E0" strokeWidth="2" />
                            <circle cx="1296" cy="74" r="2.5" fill="#007CA7" />
                        </svg>
                    </div>
                </div>

                {/* Main Content Area — padded cleanly on mobile, full-width on desktop */}
                <div className="relative z-20 mx-auto max-w-7xl w-full flex-1 flex flex-col justify-between px-4 sm:px-6 md:px-10 lg:px-0">

                    {/* Top Content Area: Title & Description (displayed after the photo on mobile) */}
                    <div className="w-full max-w-lg lg:max-w-xl xl:max-w-2xl flex flex-col items-start pt-1 sm:pt-4">
                        <Reveal direction="up" className="w-full">
                            <span className="text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.25em] text-[#00A3E0]">
                                ABOUT US
                            </span>
                            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-[38px] xl:text-[44px] font-extrabold text-[#03365b] tracking-tight leading-[1.18]">
                                More Than Engineering.<br />
                                <span className="text-[#00A3E0]">A Partner in Progress.</span>
                            </h2>
                            <div className="mt-2.5 sm:mt-3.5 h-1 md:h-1.5 w-12 md:w-16 rounded-full bg-[#00A3E0]" />
                        </Reveal>

                        <Reveal direction="up" delay={80} className="w-full">
                            <p className="mt-3 sm:mt-4 text-xs sm:text-[15px] lg:text-base text-slate-600 leading-relaxed font-normal max-w-md lg:max-w-lg">
                                Since 1997, CMP has grown from an automation system integrator into a trusted engineering partner — working alongside industries to solve challenges, build smarter systems, and create lasting value.
                            </p>
                        </Reveal>
                    </div>

                    {/* Historical Milestones: Pure Downward Vertical Timeline (Sequential Checkpoint Animation, NO CARDS) */}
                    <div ref={milestonesRef} className="w-full max-w-xl xl:max-w-2xl mt-7 sm:mt-9 lg:mt-10">
                        <div className="relative">
                            {MILESTONES.map((item, index) => {
                                const isLast = index === MILESTONES.length - 1;
                                const dotDelay = 150 + index * 850;
                                const textDelay = dotDelay + 60;
                                const lineDelay = dotDelay + 200;
                                const lineDuration = 650;
                                const popDuration = 480;

                                return (
                                    <div
                                        key={`timeline-${item.year}-${item.title}`}
                                        className="group relative flex items-start pb-5 sm:pb-6 last:pb-0 pl-8 sm:pl-9 cursor-default"
                                    >
                                        {/* Faint Background Track Line connecting to next checkpoint */}
                                        {!isLast && (
                                            <div 
                                                className="absolute left-[10px] top-[10px] h-full w-[2px] -translate-x-1/2 bg-slate-200/80 rounded-full z-0 pointer-events-none" 
                                            />
                                        )}

                                        {/* Active Animated Gradient Line drawing toward next checkpoint */}
                                        {!isLast && (
                                            <div
                                                style={{
                                                    height: milestonesVisible ? '100%' : '0%',
                                                    transition: milestonesVisible
                                                        ? `height ${lineDuration}ms cubic-bezier(0.4, 0, 0.2, 1) ${lineDelay}ms`
                                                        : 'height 0.25s ease',
                                                }}
                                                className="absolute left-[10px] top-[10px] w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#007CA7] to-[#00A3E0] rounded-full shadow-[0_0_8px_rgba(0,163,224,0.7)] will-change-[height] z-0"
                                            />
                                        )}

                                        {/* Checkpoint Dot: pops into view right when the connecting line arrives */}
                                        <div
                                            style={{
                                                opacity: milestonesVisible ? 1 : 0,
                                                transform: milestonesVisible ? 'scale(1)' : 'scale(0)',
                                                transition: milestonesVisible
                                                    ? `transform ${popDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1) ${dotDelay}ms, opacity 0.35s ease ${dotDelay}ms`
                                                    : 'opacity 0.2s ease, transform 0.2s ease',
                                            }}
                                            className="absolute left-[10px] top-[2px] -translate-x-1/2 w-4 h-4 z-10 flex items-center justify-center will-change-transform"
                                        >
                                            {/* Glowing Checkpoint Pulse */}
                                            <div className="absolute -inset-1 rounded-full bg-[#00A3E0]/20 animate-pulse group-hover:bg-[#00A3E0]/40 group-hover:scale-125 transition-all duration-300 pointer-events-none" />
                                            {/* Checkpoint White Ring & Cyan Core */}
                                            <div className="relative w-4 h-4 rounded-full bg-white border-2 border-[#00A3E0] shadow-[0_0_8px_rgba(0,163,224,0.6)] flex items-center justify-center group-hover:border-[#007CA7] transition-colors duration-200">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#00A3E0] group-hover:scale-125 transition-transform duration-200" />
                                            </div>
                                        </div>

                                        {/* Year & Short Explanation (font-bold like stats 1997, colored in blue, NO CARDS!) */}
                                        <div
                                            style={{
                                                opacity: milestonesVisible ? 1 : 0,
                                                transform: milestonesVisible ? 'translateX(0)' : 'translateX(-12px)',
                                                transition: milestonesVisible
                                                    ? `opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${textDelay}ms, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${textDelay}ms`
                                                    : 'opacity 0.2s ease, transform 0.2s ease',
                                            }}
                                            className="flex-1 min-w-0 will-change-transform"
                                        >
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-base sm:text-lg font-bold text-[#00A3E0] tracking-tight">
                                                    {item.year}
                                                </span>
                                                <h4 className="text-xs sm:text-sm lg:text-[14.5px] font-semibold text-[#03365b] tracking-tight group-hover:text-[#00A3E0] transition-colors duration-200">
                                                    — {item.title}
                                                </h4>
                                            </div>
                                            <p className="mt-0.5 text-xs sm:text-[13px] text-slate-500 leading-relaxed font-normal max-w-md lg:max-w-lg">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* Clean smooth white bottom merge into Global Reach — placed behind content (z-10) */}
                <div
                    className="absolute inset-x-0 bottom-0 h-16 sm:h-28 pointer-events-none z-10"
                    style={{
                        background: 'linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.95) 45%, rgba(255,255,255,0) 100%)'
                    }}
                />
            </section>
        </div>
    );
}

// ── Vision & Mission (Section 04) ─────────────────────────────────────────────
export function VisionMission() {
    return (
        <section id="vision-mission" className="scroll-mt-16 relative overflow-hidden bg-white py-10 sm:py-14 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12">

            {/* Background Canvas (bg_simple2.png) */}
            <div
                className="absolute inset-0 pointer-events-none bg-no-repeat bg-cover bg-center opacity-85"
                style={{
                    backgroundImage: `url(${bgSimple2})`,
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 100px, black calc(100% - 100px), transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100px, black calc(100% - 100px), transparent 100%)'
                }}
            />

            <div className="relative z-10 mx-auto max-w-5xl">
                <Reveal>
                    <div className="text-center">
                        <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-[#00A3E0]">Our Direction</p>
                        <h2 className="mt-2 text-2xl sm:text-3xl md:text-[42px] lg:text-5xl font-extrabold text-[#03365b] tracking-tight leading-tight">
                            Vision <span className="text-[#00A3E0]">&amp; Mission.</span>
                        </h2>
                        <div className="mx-auto mt-2.5 sm:mt-3.5 h-1 sm:h-1.5 w-14 sm:w-20 rounded-full bg-[#00A3E0]" />
                    </div>
                </Reveal>
                <div className="mt-6 sm:mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-stretch">
                    <VMCard
                        title="Vision"
                        text="To be the best company in the electrical and mechanical field applying appropriate and environmentally friendly technology."
                        image={bgVision}
                        imageAlt="CMP Vision - Automation Control Room"
                        imagePosition="object-center"
                        delay={0}
                    />
                    <VMCard
                        title="Mission"
                        text="Providing professional engineering services, quality products, project management, maintenance and repair services in the electrical and mechanical scope."
                        image={bgMission}
                        imageAlt="CMP Mission - Marine & Industrial Engineering"
                        imagePosition="object-[center_35%]"
                        delay={150}
                    />
                </div>
            </div>
        </section>
    );
}

// ── Certifications Section (Section 06) ───────────────────────────────────────
export function Certifications() {
    return (
        <section id="certifications" className="scroll-mt-16 relative overflow-hidden bg-white py-10 sm:py-16 md:py-24 px-3.5 sm:px-6 md:px-8 lg:px-12">

            {/* Background Canvas with seamless merge transition */}
            <div
                className="absolute inset-0 pointer-events-none bg-no-repeat bg-cover bg-center opacity-85"
                style={{
                    backgroundImage: `url(${bgSimple})`,
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 100px, black calc(100% - 100px), transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100px, black calc(100% - 100px), transparent 100%)'
                }}
            />

            <div className="relative z-10 mx-auto max-w-7xl">
                <Reveal>
                    <div className="text-center">
                        <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-[#00A3E0]">
                            OUR COMMITMENT
                        </p>
                        <h2 className="mt-2 text-2xl sm:text-3xl md:text-[42px] lg:text-5xl font-extrabold text-[#03365b] tracking-tight leading-tight">
                            Certified Quality <span className="text-[#00A3E0]">&amp; Professional Standards.</span>
                        </h2>
                        <div className="mx-auto mt-2.5 sm:mt-3.5 h-1 sm:h-1.5 w-14 sm:w-20 rounded-full bg-[#00A3E0]" />
                        <p className="mx-auto mt-3 sm:mt-4 max-w-3xl text-xs sm:text-base md:text-lg leading-relaxed md:leading-8 text-slate-600">
                            Our commitment to excellence is supported by internationally recognized certifications and
                            industry standards that ensure every project is delivered with quality, safety, and
                            professionalism.
                        </p>
                    </div>
                </Reveal>

                {/* 3 Certification Cards: 3 in row on Mobile, Tablet & Desktop! */}
                <div className="mt-6 sm:mt-10 md:mt-14 grid grid-cols-3 gap-2 sm:gap-5 lg:gap-8 max-w-5xl mx-auto items-stretch">
                    {CERTIFICATIONS.map((cert, index) => (
                        <CertCard key={cert.id} cert={cert} delay={index * 100} />
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── Default Composite Export (Backwards-compatible) ───────────────────────────
function About() {
    return (
        <>
            <AboutUs />
            <VisionMission />
            <Certifications />
        </>
    );
}

export default About;