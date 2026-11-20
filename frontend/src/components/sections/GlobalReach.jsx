import React, { useState, useEffect, useRef, useMemo } from 'react';
import { worldMapD } from '../../assets/worldMapPath.js';
import { useInView } from '../../hooks/useInView.js';
import { Globe, Settings, Users, X, ArrowRight, ArrowUpRight, ExternalLink } from 'lucide-react';
import bgSimple from '../../assets/bg_simple.png';

// Project image assets for interactive country previews
import imgVwa from '../../assets/marine_vwa_vessel_web_analyzer.png';
import imgPlc from '../../assets/general_plc_control_panel.png';
import imgCement from '../../assets/marine_cement_carrier_vessels.png';
import imgScada from '../../assets/general_cat_scada_system.png';
import imgMarineMaint from '../../assets/marine_electrical_maintenance.png';
import imgPump from '../../assets/general_pump_system.png';
import imgRobotics from '../../assets/others_robotic_arm.png';
import imgHq from '../../assets/coalmining_scada_appron_feeder.png';

// ── Geographic Coordinates & Route Geometry (Cropped Map ViewBox: 0 0 960 540) ──
// Indonesia Origin: Jakarta / Java industrial center (near lower-right)
const ORIGIN = {
    id: 'indonesia',
    name: 'Indonesia',
    subtitle: 'Our Home Base',
    code: 'ID',
    x: 748.8,
    y: 498.5,
    project: {
        title: 'More Than 10+ Projects Delivered',
        tag: '10+ Projects',
        image: imgHq,
        description: 'Over 10+ turnkey automation, SCADA telemetry, and electrical engineering installations delivered across Indonesia.',
        targetCategory: 'All',
    },
};

// 7 European & Eurasian Destination Countries (Upper-left / center)
const DESTINATIONS = [
    {
        id: 'norway',
        name: 'Norway',
        code: 'NO',
        x: 172.2,
        y: 105.8,
        cx: 510.0,
        cy: 160.0,
        labelDx: -10,
        labelDy: -8,
        align: 'end',
        project: {
            title: 'Vessel Web Analyzer & Marine Automation',
            tag: 'Marine',
            image: imgVwa,
            description: 'Advanced vessel telemetry, diagnostics, and engine monitoring systems deployed for North Sea offshore cargo vessels.',
            targetCategory: 'Marine',
        },
    },
    {
        id: 'sweden',
        name: 'Sweden',
        code: 'SE',
        x: 218.0,
        y: 110.0,
        cx: 540.0,
        cy: 180.0,
        labelDx: 10,
        labelDy: 14,
        align: 'start',
        project: {
            title: 'Industrial PLC & SCADA Control Panels',
            tag: 'Automation',
            image: imgPlc,
            description: 'Custom low-voltage switchboards and automated PLC control architectures engineered for Nordic manufacturing facilities.',
            targetCategory: 'Automation',
        },
    },
    {
        id: 'finland',
        name: 'Finland',
        code: 'FI',
        x: 264.0,
        y: 104.0,
        cx: 570.0,
        cy: 195.0,
        labelDx: 10,
        labelDy: -4,
        align: 'start',
        project: {
            title: 'Cement Carrier Automation & Electrical Systems',
            tag: 'Marine',
            image: imgCement,
            description: 'Turnkey cargo handling automation and marine power distribution systems integrated for Baltic specialized vessels.',
            targetCategory: 'Marine',
        },
    },
    {
        id: 'germany',
        name: 'Germany',
        code: 'DE',
        x: 170.4,
        y: 170.7,
        cx: 490.0,
        cy: 225.0,
        labelDx: -10,
        labelDy: -2,
        align: 'end',
        project: {
            title: 'Industrial SCADA Monitoring & Telemetry',
            tag: 'Engineering',
            image: imgScada,
            description: 'Centralized SCADA monitoring, sensor networks, and real-time telemetry built to rigorous DIN/ISO engineering standards.',
            targetCategory: 'Engineering',
        },
    },
    {
        id: 'italy',
        name: 'Italy',
        code: 'IT',
        x: 183.0,
        y: 231.6,
        cx: 500.0,
        cy: 275.0,
        labelDx: 10,
        labelDy: 4,
        align: 'start',
        project: {
            title: 'Robotic Automation & Assembly Integration',
            tag: 'Construction',
            image: imgRobotics,
            description: 'High-precision multi-axis robotic cell integration and automated assembly line controls for specialized manufacturing.',
            targetCategory: 'Construction',
        },
    },
    {
        id: 'spain',
        name: 'Spain',
        code: 'ES',
        x: 85.8,
        y: 241.0,
        cx: 440.0,
        cy: 280.0,
        labelDx: -10,
        labelDy: 2,
        align: 'end',
        project: {
            title: 'Marine Electrical Maintenance & Retrofits',
            tag: 'Marine',
            image: imgMarineMaint,
            description: 'Comprehensive switchgear servicing, generator synchronization, and classification society certified vessel maintenance.',
            targetCategory: 'Marine',
        },
    },
    {
        id: 'turkey',
        name: 'Turkey',
        code: 'TR',
        x: 304.8,
        y: 244.1,
        cx: 560.0,
        cy: 315.0,
        labelDx: 10,
        labelDy: 4,
        align: 'start',
        project: {
            title: 'Automated Pump & Fluid Transfer Systems',
            tag: 'Engineering',
            image: imgPump,
            description: 'Heavy-duty automated pump stations, variable speed drives, and remote control systems for industrial processing plants.',
            targetCategory: 'Engineering',
        },
    },
];

// Three lightweight supporting points on the left
const SUPPORTING_POINTS = [
    {
        title: 'Global Collaboration',
        description: 'Connecting industries beyond borders.',
        icon: Globe,
    },
    {
        title: 'Proven Engineering',
        description: 'Delivering reliable and efficient solutions worldwide.',
        icon: Settings,
    },
    {
        title: 'Sustainable Growth',
        description: 'Building a more connected and resilient industry.',
        icon: Users,
    },
];

// Helper to compute quadratic bezier point & tangent angle
function getBezierData(p0, p1, p2, t) {
    const clampedT = Math.max(0, Math.min(1, t));
    const inv = 1 - clampedT;
    const x = inv * inv * p0.x + 2 * inv * clampedT * p1.x + clampedT * clampedT * p2.x;
    const y = inv * inv * p0.y + 2 * inv * clampedT * p1.y + clampedT * clampedT * p2.y;
    const vx = 2 * inv * (p1.x - p0.x) + 2 * clampedT * (p2.x - p1.x);
    const vy = 2 * inv * (p1.y - p0.y) + 2 * clampedT * (p2.y - p1.y);
    const angle = (Math.atan2(vy, vx) * 180) / Math.PI;
    return { x, y, angle };
}

// Helper to compute total curve length using 16-step numerical integration
function getBezierLength(p0, p1, p2, steps = 16) {
    let len = 0;
    let prevX = p0.x;
    let prevY = p0.y;
    for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const inv = 1 - t;
        const x = inv * inv * p0.x + 2 * inv * t * p1.x + t * t * p2.x;
        const y = inv * inv * p0.y + 2 * inv * t * p1.y + t * t * p2.y;
        len += Math.hypot(x - prevX, y - prevY);
        prevX = x;
        prevY = y;
    }
    return len;
}

function GlobalReach() {
    const [sectionRef, isVisible] = useInView(0.18);

    // Precalculate paths and lengths
    const routes = useMemo(() => {
        return DESTINATIONS.map((d) => {
            const p0 = { x: ORIGIN.x, y: ORIGIN.y };
            const p1 = { x: d.cx, y: d.cy };
            const p2 = { x: d.x, y: d.y };
            const pathD = `M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`;
            const length = getBezierLength(p0, p1, p2);
            return {
                ...d,
                p0,
                p1,
                p2,
                pathD,
                length,
            };
        });
    }, []);

    // Animation state: Replays smoothly every time user enters the section
    const [progress, setProgress] = useState(0);
    const [isReducedMotion, setIsReducedMotion] = useState(false);

    // Interactive Hover State for Country Project Popover (Triggered exclusively by country names on the map)
    const [activeId, setActiveId] = useState(null);
    const [displayedLocation, setDisplayedLocation] = useState(null);
    const closeTimerRef = useRef(null);
    const clearTimerRef = useRef(null);

    // Keep displayedLocation alive during smooth fade-out / scale-down exit transition
    useEffect(() => {
        if (activeId) {
            if (clearTimerRef.current) {
                clearTimeout(clearTimerRef.current);
                clearTimerRef.current = null;
            }
            const loc = activeId === ORIGIN.id ? ORIGIN : DESTINATIONS.find((d) => d.id === activeId);
            if (loc) {
                setDisplayedLocation(loc);
            }
        } else {
            // Keep previous location data mounted for 440ms so popupBloomOut exit animation runs completely
            clearTimerRef.current = setTimeout(() => {
                setDisplayedLocation(null);
            }, 440);
        }
        return () => {
            if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
        };
    }, [activeId]);

    const isPopupOpen = Boolean(activeId && displayedLocation);

    const handleMouseEnter = (id) => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
        setActiveId(id);
    };

    const handleMouseLeave = () => {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        closeTimerRef.current = setTimeout(() => {
            setActiveId(null);
        }, 220);
    };

    const handleClosePopup = (e) => {
        e?.stopPropagation();
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        setActiveId(null);
    };

    const handleViewProject = (targetCategory) => {
        if (targetCategory) {
            window.dispatchEvent(new CustomEvent('changeCategory', { detail: targetCategory }));
        }
        const target = document.getElementById('portfolio-projects');
        if (!target) return;
        const navbarOffset = 70;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarOffset;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const p = timestamp - start;
            const currentProgress = Math.min(p / duration, 1);
            const easing = currentProgress < 0.5
                ? 4 * currentProgress * currentProgress * currentProgress
                : 1 - Math.pow(-2 * currentProgress + 2, 3) / 2;

            window.scrollTo(0, startPosition + distance * easing);

            if (p < duration) {
                window.requestAnimationFrame(step);
            } else {
                window.scrollTo(0, targetPosition);
            }
        }
        window.requestAnimationFrame(step);
    };

    // Check prefers-reduced-motion
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setIsReducedMotion(mediaQuery.matches);
        const handleChange = (e) => setIsReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // SYNCHRONIZED ROUTE FLIGHT (Simultaneous arrows, sequential pulse upon arrival):
    useEffect(() => {
        if (isReducedMotion) {
            setProgress(1);
            return;
        }

        if (!isVisible) {
            // Reset when scrolled away to another section
            setProgress(0);
            return;
        }

        let animId;
        const DURATION = 2800; // 2.8s smooth synchronized flight
        let startTime = null;

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const rawProgress = Math.min(elapsed / DURATION, 1);

            // Smooth easeInOutCubic easing for simultaneous flight
            const eased = rawProgress < 0.5
                ? 4 * rawProgress * rawProgress * rawProgress
                : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

            setProgress(eased);

            if (rawProgress < 1) {
                animId = requestAnimationFrame(animate);
            } else {
                setProgress(1);
            }
        }

        animId = requestAnimationFrame(animate);
        return () => {
            if (animId) cancelAnimationFrame(animId);
        };
    }, [isVisible, isReducedMotion]);

    return (
        <section
            id="global-reach"
            ref={sectionRef}
            className="relative bg-white py-10 sm:py-14 md:py-20 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden"
        >
            {/* Background Canvas (bg_simple.png) - Seamlessly flows from Homepage into About Us */}
            <div 
                className="absolute inset-0 pointer-events-none bg-no-repeat bg-cover bg-center opacity-85"
                style={{ 
                    backgroundImage: `url(${bgSimple})`,
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 60px, black calc(100% - 60px), transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 60px, black calc(100% - 60px), transparent 100%)'
                }}
            />

            <div className="relative z-10 mx-auto max-w-[1720px] w-full">
                
                {/* ── 3-Column Composition: Left Content (22%) | Dominant Merged Map (58%) | Refined Table (20%) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_2.9fr_1.0fr] gap-8 sm:gap-10 lg:gap-4 xl:gap-6 2xl:gap-8 items-center">
                    
                    {/* ── 1. LEFT COLUMN: Supporting Content (~22%) ── */}
                    <div className="w-full flex flex-col justify-center max-w-xl lg:max-w-none">
                        {/* Eyebrow */}
                        <p 
                            style={{
                                transition: isReducedMotion ? 'none' : isVisible
                                    ? 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 80ms, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 80ms'
                                    : 'opacity 0.3s ease, transform 0.3s ease',
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(14px)',
                            }}
                            className="text-xs font-bold uppercase tracking-[0.24em] text-[#00A3E0] mb-2 will-change-transform"
                        >
                            OUR GLOBAL REACH
                        </p>

                        {/* Heading */}
                        <h2 
                            style={{
                                transition: isReducedMotion ? 'none' : isVisible
                                    ? 'opacity 0.95s cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 0.95s cubic-bezier(0.16, 1, 0.3, 1) 200ms'
                                    : 'opacity 0.3s ease, transform 0.3s ease',
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(18px)',
                            }}
                            className="text-2xl sm:text-3xl xl:text-[34px] font-extrabold text-[#03365b] tracking-tight leading-[1.18] will-change-transform"
                        >
                            From Indonesia <br />
                            <span className="text-[#00A3E0]">to a Global Impact</span>
                        </h2>

                        {/* Description */}
                        <p 
                            style={{
                                transition: isReducedMotion ? 'none' : isVisible
                                    ? 'opacity 0.95s cubic-bezier(0.16, 1, 0.3, 1) 340ms, transform 0.95s cubic-bezier(0.16, 1, 0.3, 1) 340ms'
                                    : 'opacity 0.3s ease, transform 0.3s ease',
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                            }}
                            className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md xl:max-w-sm will-change-transform"
                        >
                            Delivering trusted automation and system integration solutions across borders, supporting key industries in 7 countries.
                        </p>

                        {/* Short CMP-cyan horizontal accent line */}
                        <div 
                            style={{
                                transition: isReducedMotion ? 'none' : isVisible
                                    ? 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 460ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 460ms'
                                    : 'opacity 0.3s ease, transform 0.3s ease',
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
                                transformOrigin: 'left',
                            }}
                            className="mt-3.5 h-1 w-12 rounded-full bg-[#00A3E0] will-change-transform" 
                        />

                        {/* Three Vertically Stacked Supporting Points (Uniform with Services Cards) */}
                        <div className="hidden lg:block mt-8 space-y-3.5">
                            {SUPPORTING_POINTS.map((item, idx) => {
                                const IconComp = item.icon;
                                return (
                                    <div 
                                        key={idx} 
                                        style={{
                                            transition: isReducedMotion ? 'none' : isVisible
                                                ? `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${600 + idx * 240}ms, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${600 + idx * 240}ms`
                                                : 'opacity 0.3s ease, transform 0.3s ease',
                                            opacity: isVisible ? 1 : 0,
                                            transform: isVisible ? 'translateY(0)' : 'translateY(18px)',
                                        }}
                                        className="group/item relative flex items-start gap-3.5 p-3.5 lg:p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#00A3E0]/35 shadow-md hover:shadow-[0_20px_40px_rgba(0,163,224,0.14)] hover:-translate-y-1 transition-all duration-300 will-change-transform overflow-hidden cursor-pointer"
                                    >
                                        {/* Subtle gradient accent on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#00A3E0]/5 to-transparent opacity-0 transition-opacity duration-400 group-hover/item:opacity-100 pointer-events-none z-0" />

                                        {/* Icon Container */}
                                        <div className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#00A3E0]/10 border border-[#00A3E0]/20 text-[#00A3E0] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm group-hover/item:scale-105 group-hover/item:bg-[#00A3E0] group-hover/item:text-white transition-all duration-300">
                                            <IconComp className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10 flex-1 min-w-0">
                                            <h4 className="text-xs sm:text-sm font-bold text-[#03365b] group-hover/item:text-[#00A3E0] transition-colors leading-tight">
                                                {item.title}
                                            </h4>
                                            <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>

                                        {/* Bottom accent line expanding on hover */}
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-[#00A3E0] transition-all duration-500 ease-out group-hover/item:w-full z-20 pointer-events-none rounded-full" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── 2. CENTER COLUMN: Dominant Map Seamlessly Merged with Background (~60%) ── */}
                    <div className="w-full flex items-center justify-center lg:scale-[1.06] xl:scale-[1.1] transition-transform my-1 lg:my-0">
                        <div className="relative w-full aspect-[805/480] select-none">
                            <svg
                                viewBox="15 60 805 480"
                                className="w-full h-full block"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-label="CMP Global Connection Map"
                            >
                                <defs>
                                    {/* Vertical soft linear gradient mask: fades top (Arctic) and bottom (Antarctica/Indian Ocean) edges seamlessly */}
                                    <linearGradient id="verticalMapFade" x1="0" y1="60" x2="0" y2="540" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                                        <stop offset="7%" stopColor="#ffffff" stopOpacity="1" />
                                        <stop offset="93%" stopColor="#ffffff" stopOpacity="1" />
                                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                                    </linearGradient>
                                    <mask id="mapVerticalFadeMask">
                                        <rect x="0" y="0" width="1000" height="600" fill="url(#verticalMapFade)" />
                                    </mask>
                                </defs>

                                {/* 1. Base Cropped Map Path: Crisp visible light-blue continents with top/bottom fade */}
                                <path
                                    d={worldMapD}
                                    fill="#edf4fa"
                                    stroke="#c4ddee"
                                    strokeWidth="0.65"
                                    strokeLinejoin="round"
                                    mask="url(#mapVerticalFadeMask)"
                                />

                                {/* 2. All 7 Routes (Simultaneous animated drawing, all arrows fly together) */}
                                {routes.map((route) => {
                                    const strokeDashoffset = route.length * (1 - progress);
                                    const isActive = activeId === route.id;

                                    return (
                                        <g key={`route-${route.id}`}>
                                            <path
                                                d={route.pathD}
                                                fill="none"
                                                stroke={isActive ? '#007CA7' : '#00A3E0'}
                                                strokeWidth={isActive ? '2.6' : '1.4'}
                                                strokeLinecap="round"
                                                strokeDasharray={route.length}
                                                strokeDashoffset={strokeDashoffset}
                                                style={{
                                                    opacity: progress > 0 ? (isActive ? 1 : (activeId ? 0.35 : 0.95)) : 0,
                                                    filter: isActive ? 'drop-shadow(0 0 6px rgba(0, 163, 224, 0.7))' : 'none',
                                                    transition: 'stroke-width 0.35s ease, stroke 0.35s ease, opacity 0.35s ease',
                                                }}
                                            />

                                            {/* Destination Arrowhead (All arrows travel together in unison) */}
                                            {progress > 0.02 && (
                                                (() => {
                                                    const tip = getBezierData(route.p0, route.p1, route.p2, progress);
                                                    return (
                                                        <g transform={`translate(${tip.x}, ${tip.y}) rotate(${tip.angle})`}>
                                                            {/* Glowing pulse ring when active */}
                                                            {isActive && (
                                                                <circle
                                                                    cx="0"
                                                                    cy="0"
                                                                    r="10"
                                                                    fill="#00A3E0"
                                                                    fillOpacity="0.3"
                                                                    stroke="#007CA7"
                                                                    strokeWidth="1.2"
                                                                    className="animate-ping"
                                                                />
                                                            )}
                                                            <polygon
                                                                points="-7,-3.2 0.8,0 -7,3.2 -5.2,0"
                                                                fill={isActive ? '#00A3E0' : '#007CA7'}
                                                                stroke="#ffffff"
                                                                strokeWidth={isActive ? '1' : '0.5'}
                                                                strokeLinejoin="round"
                                                                transform={isActive ? 'scale(1.4)' : 'scale(1)'}
                                                                style={{ transition: 'transform 0.3s ease, fill 0.3s ease' }}
                                                            />
                                                        </g>
                                                    );
                                                })()
                                            )}

                                            {/* Destination Dot Hover Target directly at the country location on map */}
                                            <circle
                                                cx={route.p2.x}
                                                cy={route.p2.y}
                                                r="18"
                                                fill="transparent"
                                                className="cursor-pointer"
                                                onMouseEnter={() => handleMouseEnter(route.id)}
                                                onMouseLeave={handleMouseLeave}
                                            />
                                        </g>
                                    );
                                })}

                                {/* ── 2b. 7 Destination Beacons (Sequential Pulse Waves from Topmost to Bottommost) ── */}
                                {routes.map((d, idx) => {
                                    const isTargetActive = activeId === d.id;
                                    const hasArrived = progress >= 0.98 || isTargetActive;
                                    // Sequential pulse wave starting from topmost (Norway idx=0) down to bottommost (Turkey idx=6)
                                    const pulseDelay = (idx * 0.28).toFixed(2);
                                    const pulseDelay2 = (idx * 0.28 + 1.4).toFixed(2);

                                    return (
                                        <g
                                            key={`dest-beacon-${d.id}`}
                                            transform={`translate(${d.x}, ${d.y})`}
                                            className="cursor-pointer group/beacon"
                                            onMouseEnter={() => handleMouseEnter(d.id)}
                                            onMouseLeave={handleMouseLeave}
                                            onClick={() => handleMouseEnter(d.id)}
                                        >
                                            {/* Generous hit target */}
                                            <circle cx="0" cy="0" r="18" fill="transparent" />

                                            {/* 1. Slow Outer Blue Pulsing Ripple Ring 1 (Sequential ignition from top to bottom) */}
                                            {hasArrived && (
                                                <circle
                                                    cx="0"
                                                    cy="0"
                                                    r="4.5"
                                                    fill="none"
                                                    stroke="#00A3E0"
                                                    strokeWidth="1.2"
                                                    style={{
                                                        transformBox: 'fill-box',
                                                        transformOrigin: 'center',
                                                        opacity: 0,
                                                        animation: `slowBluePulse 3.0s cubic-bezier(0.2, 0.6, 0.35, 1) infinite ${pulseDelay}s`,
                                                    }}
                                                />
                                            )}

                                            {/* 2. Slow Secondary Staggered Blue Ring 2 (Follows 1.4s later) */}
                                            {hasArrived && (
                                                <circle
                                                    cx="0"
                                                    cy="0"
                                                    r="4.5"
                                                    fill="#00A3E0"
                                                    fillOpacity="0.15"
                                                    stroke="#007CA7"
                                                    strokeWidth="0.8"
                                                    style={{
                                                        transformBox: 'fill-box',
                                                        transformOrigin: 'center',
                                                        opacity: 0,
                                                        animation: `slowBluePulse 3.0s cubic-bezier(0.2, 0.6, 0.35, 1) infinite ${pulseDelay2}s`,
                                                    }}
                                                />
                                            )}

                                            {/* 3. Outer White Halo Ring (Transitions into bright cyan beacon sequentially with pulseDelay) */}
                                            <circle
                                                cx="0"
                                                cy="0"
                                                r={isTargetActive ? 6.5 : (hasArrived ? 5 : 3.5)}
                                                fill="#ffffff"
                                                stroke={isTargetActive ? '#007CA7' : (hasArrived ? '#00A3E0' : '#94a3b8')}
                                                strokeWidth={isTargetActive ? 2.2 : (hasArrived ? 1.5 : 1.2)}
                                                style={{
                                                    filter: isTargetActive 
                                                        ? 'drop-shadow(0 0 6px rgba(0, 163, 224, 0.85))' 
                                                        : (hasArrived ? 'drop-shadow(0 0 3px rgba(0, 163, 224, 0.5))' : 'none'),
                                                    transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${hasArrived ? pulseDelay : '0'}s`,
                                                }}
                                            />

                                            {/* 4. Solid Glowing Blue Core Destination Pip */}
                                            <circle
                                                cx="0"
                                                cy="0"
                                                r={isTargetActive ? 3.5 : (hasArrived ? 2.5 : 1.8)}
                                                fill={isTargetActive ? '#007CA7' : (hasArrived ? '#00A3E0' : '#0284c7')}
                                                opacity={hasArrived ? 1 : 0.65}
                                                style={{
                                                    transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${hasArrived ? pulseDelay : '0'}s`,
                                                }}
                                            />
                                        </g>
                                    );
                                })}

                                {/* 3. Origin Marker: Indonesia (Interactive Country on Map) */}
                                {(() => {
                                    const isOriginActive = activeId === ORIGIN.id;
                                    return (
                                        <g 
                                            id="origin-indonesia" 
                                            transform={`translate(${ORIGIN.x}, ${ORIGIN.y})`}
                                            className="cursor-pointer group"
                                            onMouseEnter={() => handleMouseEnter(ORIGIN.id)}
                                            onMouseLeave={handleMouseLeave}
                                            onClick={() => handleMouseEnter(ORIGIN.id)}
                                        >
                                            {/* Invisible hit target for easy hover */}
                                            <circle r="26" fill="transparent" />

                                            {/* Glowing pulse ring when active */}
                                            {isOriginActive && (
                                                <circle r="16" fill="#00A3E0" fillOpacity="0.25" stroke="#007CA7" strokeWidth="1" className="animate-ping" />
                                            )}

                                            {/* Slow ambient pulse ring for Indonesia Home Base */}
                                            <circle
                                                cx="0"
                                                cy="0"
                                                r="6"
                                                fill="none"
                                                stroke="#00A3E0"
                                                strokeWidth="1.2"
                                                style={{
                                                    transformBox: 'fill-box',
                                                    transformOrigin: 'center',
                                                    animation: 'slowBluePulse 3.2s cubic-bezier(0.2, 0.6, 0.35, 1) infinite',
                                                }}
                                            />

                                            {/* Small subtle static outer ring */}
                                            <circle 
                                                r={isOriginActive ? 10 : 7.5} 
                                                fill="none" 
                                                stroke="#007CA7" 
                                                strokeWidth="1.2" 
                                                opacity={isOriginActive ? 0.8 : 0.3} 
                                                style={{ transition: 'r 0.3s ease, opacity 0.3s ease' }}
                                            />
                                            {/* Solid CMP blue origin core */}
                                            <circle 
                                                r={isOriginActive ? 5.5 : 4.5} 
                                                fill="#007CA7" 
                                                stroke="#ffffff" 
                                                strokeWidth="1.5" 
                                                style={{ transition: 'r 0.3s ease' }}
                                            />
                                            
                                            {/* Indonesia Label with Halo Stroke */}
                                            <g transform="translate(0, 16)">
                                                <text
                                                    textAnchor="middle"
                                                    y="0"
                                                    className="text-[10.5px] font-extrabold fill-[#03365b] select-none cursor-pointer"
                                                    style={{
                                                        letterSpacing: '0.02em',
                                                        paintOrder: 'stroke fill',
                                                        stroke: isOriginActive ? '#e0f2fe' : '#ffffff',
                                                        strokeWidth: '3px',
                                                        strokeLinejoin: 'round',
                                                        strokeOpacity: '0.95',
                                                        fill: isOriginActive ? '#007CA7' : '#03365b',
                                                        transition: 'fill 0.25s ease',
                                                    }}
                                                >
                                                    Indonesia
                                                </text>
                                                <text
                                                    textAnchor="middle"
                                                    y="8.5"
                                                    className="text-[7px] font-bold fill-[#007CA7] tracking-wider uppercase select-none cursor-pointer"
                                                    style={{
                                                        paintOrder: 'stroke fill',
                                                        stroke: '#ffffff',
                                                        strokeWidth: '2px',
                                                        strokeLinejoin: 'round',
                                                        strokeOpacity: '0.95'
                                                    }}
                                                >
                                                    Our Home Base
                                                </text>
                                            </g>
                                        </g>
                                    );
                                })()}

                                {/* 4. Destination Country Names on Map (Exclusive Pop-up Trigger) */}
                                {routes.map((d) => {
                                    const isLabelActive = activeId === d.id;
                                    return (
                                        <g 
                                            key={`dest-label-${d.id}`} 
                                            transform={`translate(${d.x + d.labelDx}, ${d.y + d.labelDy})`}
                                            className="cursor-pointer"
                                            onMouseEnter={() => handleMouseEnter(d.id)}
                                            onMouseLeave={handleMouseLeave}
                                            onClick={() => handleMouseEnter(d.id)}
                                        >
                                            {/* Hit box covering the country name for effortless hover and touch */}
                                            <rect 
                                                x={d.align === 'start' ? -4 : -72} 
                                                y="-14" 
                                                width="76" 
                                                height="24" 
                                                fill="transparent" 
                                            />
                                            <text
                                                x={0}
                                                y="2"
                                                textAnchor={d.align}
                                                fontSize="11"
                                                className={`select-none transition-all duration-200 ${isLabelActive ? 'font-black' : 'font-bold'}`}
                                                style={{
                                                    letterSpacing: '0.02em',
                                                    paintOrder: 'stroke fill',
                                                    stroke: isLabelActive ? '#e0f2fe' : '#ffffff',
                                                    strokeWidth: isLabelActive ? '3.5px' : '2.5px',
                                                    strokeLinejoin: 'round',
                                                    strokeOpacity: '0.95',
                                                    fill: isLabelActive ? '#007CA7' : '#03365b',
                                                }}
                                            >
                                                {d.name}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>

                            {/* ── CSS Keyframes for Cinematic Blooming (Mekar) Enter & Exit ── */}
                            <style>{`
                                @keyframes beaconPopIn {
                                    0% {
                                        opacity: 0;
                                        transform: scale(0.2);
                                    }
                                    70% {
                                        opacity: 1;
                                        transform: scale(1.18);
                                    }
                                    100% {
                                        opacity: 1;
                                        transform: scale(1);
                                    }
                                }
                                @keyframes slowBluePulse {
                                    0% {
                                        transform: scale(0.9);
                                        opacity: 0.85;
                                    }
                                    45% {
                                        opacity: 0.45;
                                    }
                                    100% {
                                        transform: scale(3.6);
                                        opacity: 0;
                                    }
                                }
                                @keyframes popupBloomIn {
                                    0% {
                                        opacity: 0;
                                        transform: scale(0.60) translateY(14px);
                                        filter: blur(14px);
                                    }
                                    60% {
                                        opacity: 1;
                                        transform: scale(1.026) translateY(-2px);
                                        filter: blur(0px);
                                    }
                                    84% {
                                        transform: scale(0.993) translateY(0.5px);
                                    }
                                    100% {
                                        opacity: 1;
                                        transform: scale(1) translateY(0);
                                        filter: blur(0px);
                                    }
                                }
                                @keyframes popupBloomOut {
                                    0% {
                                        opacity: 1;
                                        transform: scale(1) translateY(0);
                                        filter: blur(0px);
                                    }
                                    100% {
                                        opacity: 0;
                                        transform: scale(0.70) translateY(10px);
                                        filter: blur(8px);
                                    }
                                }
                                @keyframes popupContentFade {
                                    0% {
                                        opacity: 0;
                                        transform: translateY(8px);
                                    }
                                    100% {
                                        opacity: 1;
                                        transform: translateY(0);
                                    }
                                }
                                @keyframes popupImageBloom {
                                    0% {
                                        opacity: 0;
                                        transform: scale(1.08);
                                        filter: saturate(0.85);
                                    }
                                    100% {
                                        opacity: 1;
                                        transform: scale(1);
                                        filter: saturate(1);
                                    }
                                }
                            `}</style>

                            {/* ── Interactive Floating Project Preview Pop-up (True Blooming / Mekar Animation) ── */}
                            {displayedLocation && displayedLocation.project && (
                                <>
                                    {/* Mobile Backdrop Overlay (Click outside to close) */}
                                    <div
                                        onClick={handleClosePopup}
                                        style={{
                                            opacity: isPopupOpen ? 1 : 0,
                                            transition: 'opacity 0.25s ease',
                                            pointerEvents: isPopupOpen ? 'auto' : 'none',
                                        }}
                                        className="md:hidden fixed inset-0 bg-slate-950/45 backdrop-blur-sm z-40"
                                    />

                                    <div
                                        onMouseEnter={() => {
                                            if (closeTimerRef.current) {
                                                clearTimeout(closeTimerRef.current);
                                                closeTimerRef.current = null;
                                            }
                                        }}
                                        onMouseLeave={handleMouseLeave}
                                        style={{
                                            left: `${((displayedLocation.x - 15) / 805) * 100}%`,
                                            top: `${((displayedLocation.y - 60) / 480) * 100}%`,
                                            transform: displayedLocation.id === 'indonesia'
                                                ? 'translate(calc(-100% - 18px), calc(-100% + 20px))'
                                                : 'translate(22px, -30%)',
                                        }}
                                        className="absolute z-40 pointer-events-auto max-md:!fixed max-md:!left-1/2 max-md:!top-auto max-md:!bottom-5 max-md:!transform max-md:-translate-x-1/2 max-md:!z-50 select-text"
                                    >
                                    {/* Inner blooming card (blossoms smoothly out from the country anchor point) */}
                                    <div
                                        key={displayedLocation.id}
                                        style={{
                                            transformOrigin: displayedLocation.id === 'indonesia' ? 'bottom right' : 'top left',
                                            animation: isPopupOpen
                                                ? 'popupBloomIn 0.78s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                                                : 'popupBloomOut 0.40s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                                            pointerEvents: isPopupOpen ? 'auto' : 'none',
                                        }}
                                        className={`${
                                            displayedLocation.id === 'indonesia' ? 'w-[290px] sm:w-[335px]' : 'w-[260px] sm:w-[295px]'
                                        } max-w-[calc(100vw-32px)] rounded-2xl bg-white/95 backdrop-blur-2xl border ${
                                            displayedLocation.id === 'indonesia' ? 'border-[#00A3E0]/45' : 'border-[#007CA7]/35'
                                        } shadow-[0_26px_60px_-12px_rgba(3,54,91,0.35),0_0_30px_rgba(0,163,224,0.18)] p-3 sm:p-3.5 will-change-transform max-md:!transform-origin-bottom`}
                                    >
                                        {displayedLocation.id === 'indonesia' ? (
                                            /* ── Indonesia Showcase: More Than 10+ Projects Delivered ── */
                                            <>
                                                {/* Header: Indonesia + 10+ Projects Badge + Close Button */}
                                                <div 
                                                    style={{
                                                        animation: isPopupOpen ? 'popupContentFade 0.65s cubic-bezier(0.16, 1, 0.3, 1) 100ms both' : 'none',
                                                    }}
                                                    className="flex items-center justify-between pb-2 border-b border-slate-100"
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#00A3E0]/15 text-[#007CA7] text-[10px] font-extrabold">
                                                            ID
                                                        </span>
                                                        <span className="text-xs font-bold text-[#03365b]">
                                                            Indonesia
                                                        </span>
                                                        <span className="text-[9.5px] font-bold text-[#007CA7] bg-[#00A3E0]/10 border border-[#00A3E0]/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#00A3E0] animate-pulse" />
                                                            10+ Projects
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={handleClosePopup}
                                                        className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                                                        aria-label="Close preview"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>

                                                {/* Multi-Project Montage Banner */}
                                                <div 
                                                    style={{
                                                        animation: isPopupOpen ? 'popupImageBloom 0.75s cubic-bezier(0.16, 1, 0.3, 1) 180ms both' : 'none',
                                                    }}
                                                    className="relative mt-2.5 h-28 sm:h-32 w-full rounded-xl overflow-hidden bg-slate-950 shadow-inner group"
                                                >
                                                    <img
                                                        src={displayedLocation.project.image}
                                                        alt="CMP Indonesia 10+ Projects"
                                                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                                    />
                                                    {/* Gradient overlay for contrast */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#03365b]/95 via-[#03365b]/45 to-transparent pointer-events-none" />

                                                    {/* Top Badges */}
                                                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                                                        <span className="rounded-md bg-[#00A3E0]/90 backdrop-blur-md px-2 py-0.5 text-[9.5px] font-bold text-white tracking-wide shadow-sm flex items-center gap-1">
                                                            <span>⚡</span> More Than 10+ Projects
                                                        </span>
                                                        <span className="rounded-md bg-white/90 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-bold text-[#03365b] shadow-sm">
                                                            Home Base
                                                        </span>
                                                    </div>

                                                    {/* Bottom Info on Image */}
                                                    <div className="absolute bottom-2 left-2.5 right-2.5 text-white pointer-events-none">
                                                        <p className="text-[11.5px] sm:text-xs font-bold leading-tight drop-shadow-sm">
                                                            Nationwide Industrial &amp; Automation
                                                        </p>
                                                        <p className="text-[9.5px] text-slate-200 mt-0.5 line-clamp-1 opacity-90">
                                                            Java • Sumatra • Kalimantan • Maritime Hubs
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* 4 Multi-Sector Project Highlights (2x2 grid) */}
                                                <div 
                                                    style={{
                                                        animation: isPopupOpen ? 'popupContentFade 0.70s cubic-bezier(0.16, 1, 0.3, 1) 260ms both' : 'none',
                                                    }}
                                                    className="mt-2.5 space-y-1.5"
                                                >
                                                    <div className="grid grid-cols-2 gap-1.5">
                                                        <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-[#00A3E0]/30 transition-colors flex items-center gap-1.5">
                                                            <span className="text-xs flex-shrink-0">⛏️</span>
                                                            <div className="min-w-0">
                                                                <p className="text-[10px] font-bold text-[#03365b] truncate">Coal Mining SCADA</p>
                                                                <p className="text-[8.5px] text-slate-500 truncate">Kalimantan Plants</p>
                                                            </div>
                                                        </div>
                                                        <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-[#00A3E0]/30 transition-colors flex items-center gap-1.5">
                                                            <span className="text-xs flex-shrink-0">🚢</span>
                                                            <div className="min-w-0">
                                                                <p className="text-[10px] font-bold text-[#03365b] truncate">Marine Automation</p>
                                                                <p className="text-[8.5px] text-slate-500 truncate">Vessel Systems</p>
                                                            </div>
                                                        </div>
                                                        <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-[#00A3E0]/30 transition-colors flex items-center gap-1.5">
                                                            <span className="text-xs flex-shrink-0">⚡</span>
                                                            <div className="min-w-0">
                                                                <p className="text-[10px] font-bold text-[#03365b] truncate">PLC Control Panels</p>
                                                                <p className="text-[8.5px] text-slate-500 truncate">Factory Systems</p>
                                                            </div>
                                                        </div>
                                                        <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-[#00A3E0]/30 transition-colors flex items-center gap-1.5">
                                                            <span className="text-xs flex-shrink-0">☀️</span>
                                                            <div className="min-w-0">
                                                                <p className="text-[10px] font-bold text-[#03365b] truncate">Solar PV Systems</p>
                                                                <p className="text-[8.5px] text-slate-500 truncate">Clean Energy</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-[10.5px] text-slate-500 leading-relaxed pt-0.5">
                                                        Over 10+ turnkey engineering and automation installations delivered across Indonesia.
                                                    </p>
                                                </div>

                                                {/* Footer Action: Explore All 10+ Projects */}
                                                <div 
                                                    style={{
                                                        animation: isPopupOpen ? 'popupContentFade 0.65s cubic-bezier(0.16, 1, 0.3, 1) 340ms both' : 'none',
                                                    }}
                                                    className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between"
                                                >
                                                    <span className="text-[9.5px] text-slate-400 font-medium">
                                                        10+ National Projects
                                                    </span>
                                                    <button
                                                        onClick={() => handleViewProject('All')}
                                                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#007CA7] hover:text-[#00A3E0] transition-colors cursor-pointer group"
                                                    >
                                                        <span>Explore All 10+ Projects</span>
                                                        <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            /* ── Foreign Destination Country Showcase (Single Flagship Export Project) ── */
                                            <>
                                                {/* Header: Country Name + Code + Close button (Stagger 1) */}
                                                <div 
                                                    style={{
                                                        animation: isPopupOpen ? 'popupContentFade 0.65s cubic-bezier(0.16, 1, 0.3, 1) 120ms both' : 'none',
                                                    }}
                                                    className="flex items-center justify-between pb-2 border-b border-slate-100"
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#007CA7]/10 text-[#007CA7] text-[10px] font-bold">
                                                            {displayedLocation.code || 'ID'}
                                                        </span>
                                                        <span className="text-xs font-bold text-[#03365b]">
                                                            {displayedLocation.name}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={handleClosePopup}
                                                        className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                                                        aria-label="Close preview"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>

                                                {/* Project Thumbnail with Tag Badge (Stagger 2 - Gentle Image Zoom Bloom) */}
                                                <div 
                                                    style={{
                                                        animation: isPopupOpen ? 'popupImageBloom 0.75s cubic-bezier(0.16, 1, 0.3, 1) 200ms both' : 'none',
                                                    }}
                                                    className="relative mt-2.5 h-28 sm:h-32 w-full rounded-xl overflow-hidden bg-slate-950 shadow-inner group"
                                                >
                                                    <img
                                                        src={displayedLocation.project.image}
                                                        alt={displayedLocation.project.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                                    />
                                                    <span className="absolute top-2 left-2 rounded-md bg-[#03365b]/80 backdrop-blur-md px-2 py-0.5 text-[9.5px] font-semibold text-white tracking-wide border border-white/15 shadow-sm">
                                                        {displayedLocation.project.tag}
                                                    </span>
                                                </div>

                                                {/* Project Title & Description (Stagger 3) */}
                                                <div 
                                                    style={{
                                                        animation: isPopupOpen ? 'popupContentFade 0.70s cubic-bezier(0.16, 1, 0.3, 1) 280ms both' : 'none',
                                                    }}
                                                    className="mt-2.5 text-left"
                                                >
                                                    <h4 className="text-xs sm:text-[13px] font-bold text-[#03365b] leading-snug line-clamp-1">
                                                        {displayedLocation.project.title}
                                                    </h4>
                                                    <p className="mt-1 text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                                                        {displayedLocation.project.description}
                                                    </p>
                                                </div>

                                                {/* Footer Action: Explore in Portfolio (Stagger 4) */}
                                                <div 
                                                    style={{
                                                        animation: isPopupOpen ? 'popupContentFade 0.65s cubic-bezier(0.16, 1, 0.3, 1) 360ms both' : 'none',
                                                    }}
                                                    className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between"
                                                >
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        CMP Track Record
                                                    </span>
                                                    <button
                                                        onClick={() => handleViewProject(displayedLocation.project.targetCategory)}
                                                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#007CA7] hover:text-[#00A3E0] transition-colors cursor-pointer group"
                                                    >
                                                        <span>View in Portfolio</span>
                                                        <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                        </div>
                    </div>

                    {/* ── 3. RIGHT COLUMN: Refined, Pleasant Country Presence Table (~20%) ── */}
                    <div className="w-full flex justify-center lg:justify-end mt-4 sm:mt-6 lg:mt-0">
                        <div 
                            style={{
                                transition: isReducedMotion ? 'none' : isVisible
                                    ? 'opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 1.0s cubic-bezier(0.16, 1, 0.3, 1) 200ms, box-shadow 0.3s ease'
                                    : 'opacity 0.3s ease, transform 0.3s ease',
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateX(0)' : 'translateX(24px)',
                            }}
                            className="w-full max-w-lg lg:max-w-[315px] xl:max-w-[335px] rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-md hover:border-[#00A3E0]/35 hover:shadow-[0_20px_40px_rgba(0,163,224,0.14)] transition-all duration-300 will-change-transform relative overflow-hidden group select-none"
                        >
                            {/* Subtle gradient accent on hover (Uniform with Services) */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00A3E0]/5 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100 pointer-events-none z-0" />

                            {/* Card Header */}
                            <div
                                style={{
                                    transition: isReducedMotion ? 'none' : isVisible
                                        ? 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 360ms, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 360ms'
                                        : 'opacity 0.3s ease, transform 0.3s ease',
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
                                }}
                                className="relative z-10 will-change-transform"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#00A3E0] whitespace-nowrap">
                                        OUR PRESENCE
                                    </p>
                                    <span className="text-[10px] font-bold text-[#00A3E0] bg-[#00A3E0]/10 border border-[#00A3E0]/20 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
                                        7 Countries
                                    </span>
                                </div>

                                <h3 className="text-[15px] sm:text-base font-bold text-[#03365b] mt-1.5 leading-snug tracking-tight group-hover:text-[#00A3E0] transition-colors">
                                    Project Destinations
                                </h3>
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                    Marine &amp; industrial automation systems delivered internationally.
                                </p>
                            </div>

                            {/* Interactive Table of 7 Countries */}
                            <div className="relative z-10 mt-3.5 pt-2.5 border-t border-slate-100">
                                <div className="space-y-1.5">
                                    {DESTINATIONS.map((country, idx) => {
                                        const isCountryActive = activeId === country.id;
                                        return (
                                            <div
                                                key={country.id}
                                                onClick={() => handleMouseEnter(country.id)}
                                                style={{
                                                    transition: isReducedMotion ? 'none' : isVisible
                                                        ? `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${520 + idx * 80}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${520 + idx * 80}ms`
                                                        : 'opacity 0.25s ease, transform 0.25s ease',
                                                    opacity: isVisible ? 1 : 0,
                                                    transform: isVisible ? 'translateX(0)' : 'translateX(14px)',
                                                }}
                                                className={`group/row flex items-center justify-between py-1.5 px-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                                                    isCountryActive
                                                        ? 'bg-[#00A3E0]/10 border-[#00A3E0]/35 shadow-sm'
                                                        : 'bg-slate-50/50 hover:bg-[#00A3E0]/5 border-slate-100 hover:border-[#00A3E0]/20'
                                                }`}
                                            >
                                                {/* Country Name */}
                                                <div className="flex items-center min-w-0">
                                                    <span className={`text-xs font-semibold truncate transition-colors ${
                                                        isCountryActive ? 'text-[#00A3E0] font-bold' : 'text-slate-700 group-hover/row:text-[#00A3E0]'
                                                    }`}>
                                                        {country.name}
                                                    </span>
                                                </div>

                                                {/* Sector Tag + Interactive Arrow */}
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <span className={`text-[9.5px] font-semibold px-2 py-0.5 rounded-full border ${
                                                        country.project.tag === 'Marine'
                                                            ? 'bg-blue-50 text-blue-700 border-blue-200/60'
                                                            : country.project.tag === 'Automation'
                                                            ? 'bg-cyan-50 text-cyan-700 border-cyan-200/60'
                                                            : country.project.tag === 'Construction'
                                                            ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                                                            : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                                                    }`}>
                                                        {country.project.tag}
                                                    </span>
                                                    <ArrowUpRight 
                                                        size={13} 
                                                        className={`transition-all duration-200 ${
                                                            isCountryActive 
                                                                ? 'text-[#00A3E0] translate-x-0.5 -translate-y-0.5' 
                                                                : 'text-slate-300 group-hover/row:text-[#00A3E0] group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5'
                                                        }`} 
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Bottom expanding accent line on hover */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-[#00A3E0] transition-all duration-500 ease-out group-hover:w-full z-20 pointer-events-none rounded-full" />
                        </div>
                    </div>
                </div>

                {/* ── Mobile-Only: Minimalist 3-Pillar Trust Strip (Themed to match Turnkey Projects) ── */}
                <div className="lg:hidden mt-6 sm:mt-8 pt-4 border-t border-slate-100">
                    <p className="text-[9.5px] font-bold uppercase tracking-[0.24em] text-[#00A3E0] text-center mb-2.5">
                        CORE COMMITMENTS
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                        {SUPPORTING_POINTS.map((item, idx) => {
                            const IconComp = item.icon;
                            return (
                                <div 
                                    key={idx} 
                                    className="group relative flex flex-col items-center text-center p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-[#00A3E0]/35 shadow-xs hover:shadow-md transition-all overflow-hidden cursor-pointer"
                                >
                                    {/* Subtle gradient accent on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#00A3E0]/5 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100 pointer-events-none z-0" />

                                    {/* Cyan Icon Badge matching Turnkey Projects */}
                                    <div className="relative z-10 w-7 h-7 rounded-lg bg-[#00A3E0]/10 border border-[#00A3E0]/20 text-[#00A3E0] flex items-center justify-center shrink-0 mb-1.5 group-hover:bg-[#00A3E0] group-hover:text-white transition-all duration-300">
                                        <IconComp className="w-3.5 h-3.5" strokeWidth={1.8} />
                                    </div>
                                    <h4 className="relative z-10 text-[10px] font-bold text-[#03365b] leading-tight group-hover:text-[#00A3E0] transition-colors">
                                        {item.title}
                                    </h4>
                                    <p className="relative z-10 text-[8.5px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                                        {item.description}
                                    </p>

                                    {/* Bottom accent line */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-[#00A3E0] transition-all duration-500 ease-out group-hover:w-full z-20 pointer-events-none rounded-full" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default GlobalReach;
