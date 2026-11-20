import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import { useInView } from "../../hooks/useInView";
import bgSimple from "../../assets/bg_simple.png";

// Project image assets
import imgCoalminingScada from "../../assets/coalmining_scada_appron_feeder.png";
import imgCoalminingControlRoom from "../../assets/coalmining_control_room.png";
import imgCoalminingConveyor from "../../assets/coalmining_conveyor_belt.png";
import imgCoalminingMv from "../../assets/coalmining_mv_switchgears.png";
import imgCoalminingPushbutton from "../../assets/coalmining_pushbutton_panel.png";
import imgCoalminingPanelWhite from "../../assets/coalmining_panel_white.png";
import imgCoalminingSwitchboard from "../../assets/coalmining_switchboard_cabinet.png";
import imgGeneralPlc from "../../assets/general_plc_control_panel.png";
import imgMarineVwa from "../../assets/marine_vwa_vessel_web_analyzer.png";
import imgMarineCement from "../../assets/marine_cement_carrier_vessels.png";
import imgMarineMaint from "../../assets/marine_electrical_maintenance.png";
import imgGeneralCat from "../../assets/general_cat_scada_system.png";
import imgGeneralSms from "../../assets/general_sms_server_scada.png";
import imgGeneralPump from "../../assets/general_pump_system.png";
import imgGeneralDewpoint from "../../assets/general_dewpoint_monitoring.png";
import imgGeneralDewpoints from "../../assets/general_dewpoint_monitorings.png";
import imgGeneralFacility from "../../assets/general_facility_pm_status.png";
import imgGeneralYamaha from "../../assets/general_command_counter_yamaha.png";
import imgOthersRobotics from "../../assets/others_robotic_arm.png";
import imgOthersSolar from "../../assets/others_solar_panel_installation.png";

const DEFAULT_TAGS = ["All", "Automation", "Engineering", "Marine", "Construction"];

const DEFAULT_PROJECTS = [
    {
        id: "p1",
        title: "Coal Mining SCADA & Apron Feeder Automation",
        description: "Complete SCADA and electrical control automation system designed to improve operational efficiency and reliability in coal mining apron feeders.",
        tag: "Automation",
        category: "Automation",
        image: [
            imgCoalminingScada,
            imgCoalminingControlRoom,
            imgCoalminingConveyor,
            imgCoalminingMv,
            imgCoalminingPushbutton,
        ],
    },
    {
        id: "p2",
        title: "Industrial PLC & SCADA Control Panels",
        description: "Custom engineered low-voltage switchboards, PLC control architectures, and motor control centers for automated industrial facilities.",
        tag: "Automation",
        category: "Automation",
        image: [
            imgGeneralPlc,
            imgCoalminingPanelWhite,
            imgCoalminingSwitchboard,
        ],
    },
    {
        id: "p3",
        title: "Vessel Web Analyzer & Marine Automation",
        description: "Advanced vessel telemetry, diagnostics, and marine automation monitoring systems deployed for offshore cargo vessels and fleets.",
        tag: "Marine",
        category: "Marine",
        image: [
            imgMarineVwa,
        ],
    },
    {
        id: "p4",
        title: "Cement Carrier Automation & Electrical Systems",
        description: "Turnkey cargo handling automation, pneumatic unloader controls, and marine power distribution systems integrated for specialized vessels.",
        tag: "Marine",
        category: "Marine",
        image: [
            imgMarineCement,
        ],
    },
    {
        id: "p5",
        title: "Marine Electrical Maintenance & Retrofits",
        description: "Comprehensive switchgear servicing, generator synchronization, and classification society certified marine electrical maintenance.",
        tag: "Marine",
        category: "Marine",
        image: [
            imgMarineMaint,
        ],
    },
    {
        id: "p6",
        title: "Industrial SCADA Monitoring & Telemetry",
        description: "Centralized SCADA monitoring, sensor networks, and real-time telemetry systems built to rigorous industrial engineering standards.",
        tag: "Engineering",
        category: "Engineering",
        image: [
            imgGeneralCat,
            imgGeneralSms,
        ],
    },
    {
        id: "p7",
        title: "Automated Pump & Fluid Transfer Systems",
        description: "Heavy-duty automated pump stations, variable speed drives (VFD), and remote flow monitoring systems for industrial processing plants.",
        tag: "Engineering",
        category: "Engineering",
        image: [
            imgGeneralPump,
        ],
    },
    {
        id: "p8",
        title: "Compressed Air Dewpoint & Facility Monitoring",
        description: "Precision dewpoint measurement and facility status monitoring systems ensuring air quality for pneumatic and industrial operations.",
        tag: "Engineering",
        category: "Engineering",
        image: [
            imgGeneralDewpoint,
            imgGeneralDewpoints,
            imgGeneralFacility,
            imgGeneralYamaha,
        ],
    },
    {
        id: "p9",
        title: "Robotic Automation & Assembly Integration",
        description: "High-precision multi-axis robotic cell integration, mounting structural erection, and automated assembly controls for manufacturing.",
        tag: "Construction",
        category: "Construction",
        image: [
            imgOthersRobotics,
        ],
    },
    {
        id: "p10",
        title: "Solar PV Power System Installation & Erection",
        description: "Turnkey industrial solar photovoltaic rooftop installation, mounting structure erection, and electrical grid connection.",
        tag: "Construction",
        category: "Construction",
        image: [
            imgOthersSolar,
        ],
    },
];

// ── Project Card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, onOpen, delay }) {
    const [ref, visible] = useInView(0.1);
    const [imgIdx, setImgIdx] = useState(0);
    const [hovered, setHovered] = useState(false);
    const images = (project?.image && project.image.length > 0)
        ? project.image
        : (Array.isArray(project?.images) ? project.images : []);
    const imgCount = images.length;

    // Auto-slide every 4 seconds
    useEffect(() => {
        if (imgCount <= 1 || hovered) return;
        const timer = setInterval(() => {
            setImgIdx((prev) => (prev + 1) % imgCount);
        }, 4000);
        return () => clearInterval(timer);
    }, [imgCount, hovered]);

    return (
        <div
            ref={ref}
            style={{
                opacity:    visible ? 1 : 0,
                transform:  visible ? 'translateY(0)' : 'translateY(28px)',
                transition: visible
                    ? `opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
                    : 'opacity 0.35s ease, transform 0.35s ease',
            }}
            className="group relative h-full flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-lg cursor-pointer transition-all duration-500 hover:border-[#007CA7]/30 hover:shadow-[0_20px_60px_rgba(0,124,167,0.15)]"
            onClick={() => onOpen(project)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Gradient accent on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#007CA7]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none z-[1]" />

            {/* Thumbnail with auto-slide */}
            <div className="relative h-28 sm:h-38 md:h-48 lg:h-52 overflow-hidden bg-slate-900">
                {images.map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        alt={project.title}
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
                            i === imgIdx ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    />
                ))}

                {/* Hover overlay */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#007CA7]/80 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                    <span className="rounded-full border-2 border-white px-5 py-2 text-sm font-semibold text-white">
                        View Gallery
                    </span>
                    <span className="mt-2 text-xs text-white/80">{imgCount} photos</span>
                </div>

                {/* Category badge */}
                <span className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 z-20 rounded-full bg-white/90 backdrop-blur px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-[#007CA7]">
                    {project.tag}
                </span>

                {/* Dot indicators */}
                {imgCount > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                        {images.map((_, i) => (
                            <span key={i} className={`block h-1.5 rounded-full transition-all duration-300 ${i === imgIdx ? 'w-3.5 bg-white' : 'w-1.5 bg-white/50'}`} />
                        ))}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col p-2.5 sm:p-4 md:p-5 text-center md:text-left h-[100px] sm:h-[125px] md:h-[155px]">
                <h2 className="text-[11.5px] sm:text-sm md:text-base font-bold text-[#03365b] transition-colors duration-300 group-hover:text-[#00A3E0] line-clamp-2 leading-tight">
                    {project.title}
                </h2>
                <p className="mt-0.5 sm:mt-1.5 text-[9.5px] sm:text-xs text-gray-600 leading-snug sm:leading-relaxed line-clamp-2 flex-1">{project.description}</p>
                
                {/* Next/Prev buttons centered at bottom */}
                {imgCount > 1 && (
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); setImgIdx((prev) => (prev - 1 + imgCount) % imgCount); }}
                            className="flex h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-[#007CA7] hover:text-white transition-colors duration-200"
                        >
                            <ChevronLeft size={11} />
                        </button>
                        <span className="text-[8.5px] sm:text-[10px] md:text-[11px] text-slate-400 font-medium">{imgIdx + 1} / {imgCount}</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); setImgIdx((prev) => (prev + 1) % imgCount); }}
                            className="flex h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-[#007CA7] hover:text-white transition-colors duration-200"
                        >
                            <ChevronRight size={11} />
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom accent line — expands from center */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-[#007CA7] transition-all duration-700 ease-out group-hover:w-full z-[2]" />
        </div>
    );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ project, onClose, onNextProject, onPrevProject }) {
    const [current, setCurrent] = useState(0);
    const [hovered, setHovered] = useState(false);
    const images = (project?.image && project.image.length > 0)
        ? project.image
        : (Array.isArray(project?.images) ? project.images : []);

    // Reset image index when switching projects
    useEffect(() => {
        setCurrent(0);
    }, [project]);

    // Auto-slide every 4 seconds (pauses on hover)
    useEffect(() => {
        if (images.length <= 1 || hovered) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [images.length, hovered, project]);

    const go = useCallback((dir) => {
        const next = current + dir;
        if (next < 0 || next >= images.length) return;
        setCurrent(next);
    }, [current, images.length]);

    // Keyboard navigation
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft")  go(-1);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [go, onClose]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            onClick={onClose}
            style={{ animation: 'modalFadeIn 0.3s ease both' }}
        >
            <div
                className="relative flex max-h-[92vh] w-full max-w-5xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'modalScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both' }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg backdrop-blur transition-all duration-200 hover:bg-red-500 hover:text-white"
                >
                    <X size={20} />
                </button>

                {/* Main image with fixed responsive height and smooth transition */}
                <div 
                    className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] bg-slate-950 overflow-hidden flex items-center justify-center"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {images.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt={`${project.title} — ${i + 1}`}
                            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ease-in-out ${
                                i === current ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                            }`}
                        />
                    ))}

                    {images.length === 0 && (
                        <p className="text-slate-400">No images available</p>
                    )}

                    {/* Prev / Next arrows on main image */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() => go(-1)}
                                disabled={current === 0}
                                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur shadow-lg transition-all duration-200 hover:bg-[#007CA7] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => go(1)}
                                disabled={current === images.length - 1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur shadow-lg transition-all duration-200 hover:bg-[#007CA7] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}

                    {/* Counter badge */}
                    {images.length > 0 && (
                        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 rounded-full bg-black/60 px-4 py-1 text-sm text-white backdrop-blur">
                            {current + 1} / {images.length}
                        </span>
                    )}
                </div>

                {/* Thumbnail strip */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto bg-slate-50 px-4 py-3 scrollbar-hide">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                                    i === current
                                        ? "border-[#007CA7] opacity-100 scale-105"
                                        : "border-transparent opacity-50 hover:opacity-80"
                                }`}
                            >
                                <img src={img} alt={i} className="h-full w-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}

                {/* Info footer */}
                <div className="border-t border-slate-100 px-6 py-5">
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                            <span className="inline-block rounded-full bg-[#007CA7]/10 px-3 py-1 text-xs font-semibold text-[#007CA7]">
                                {project.tag}
                            </span>
                            <span className="text-xs font-medium text-slate-400">
                                {project.category || project.title}
                            </span>
                        </div>
                        <h2 className="mt-2 text-2xl font-bold text-[#03365b]">{project.title}</h2>
                        <p className="mt-1 text-sm text-gray-600">{project.description}</p>
                    </div>

                    {/* Project Navigation — centered */}
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <button 
                            onClick={onPrevProject}
                            disabled={!onPrevProject}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-[#007CA7] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} /> Prev Project
                        </button>
                        <button 
                            onClick={onNextProject}
                            disabled={!onNextProject}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-[#007CA7] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Next Project <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Keyframe styles */}
            <style>{`
                @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
                @keyframes modalFadeIn { from { opacity: 0; backdrop-filter: blur(0px) } to { opacity: 1; backdrop-filter: blur(8px) } }
                @keyframes modalScaleIn { from { opacity: 0; transform: scale(0.96) translateY(12px) } to { opacity: 1; transform: scale(1) translateY(0) } }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

const PROJECTS_PER_PAGE = 6;

// ── Portfolio Section ─────────────────────────────────────────────────────────
function PortfolioProjects() {
    const [projects, setProjects]     = useState(DEFAULT_PROJECTS);
    const [loading, setLoading]       = useState(false);
    const [activeTag, setActiveTag]   = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [headerRef, headerVisible]  = useInView(0.2);

    // Fetch from backend API
    useEffect(() => {
        fetch('/api/projects')
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    // Normalize: API uses `images` (array of URLs), card expects `image`
                    setProjects(data.map(p => ({ ...p, image: p.images || [] })));
                }
            })
            .catch((err) => console.error('Failed to load projects:', err));
    }, []);

    // Listen for category/tag change events (e.g. from Services section)
    useEffect(() => {
        const handleCategoryChange = (e) => {
            if (e.detail && e.detail.toLowerCase() !== activeTag.toLowerCase()) {
                setIsTransitioning(true);
                setTimeout(() => {
                    setActiveTag(e.detail);
                    setCurrentPage(1);
                    setTimeout(() => {
                        setIsTransitioning(false);
                    }, 80);
                }, 350);
            }
        };
        window.addEventListener('changeCategory', handleCategoryChange);
        return () => window.removeEventListener('changeCategory', handleCategoryChange);
    }, [activeTag]);

    // Fixed section filters: All, Automation, Engineering, Marine, Construction
    const tags = DEFAULT_TAGS;

    const filtered = activeTag === "All"
        ? (Array.isArray(projects) ? projects : [])
        : (Array.isArray(projects) ? projects : []).filter((p) => (p.tag || "").toLowerCase() === activeTag.toLowerCase());

    // Pagination calculations (6 projects per page)
    const totalPages = Math.max(1, Math.ceil(filtered.length / PROJECTS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * PROJECTS_PER_PAGE;
    const paginatedProjects = filtered.slice(startIndex, startIndex + PROJECTS_PER_PAGE);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages || newPage === safePage || isTransitioning) return;
        setIsTransitioning(true);

        // Smooth scroll directly to the project images/cards, not back to the beginning of the section
        const grid = document.getElementById('project-cards-grid');
        if (grid) {
            const navbarOffset = 80;
            const targetPosition = grid.getBoundingClientRect().top + window.scrollY - navbarOffset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }

        setTimeout(() => {
            setCurrentPage(newPage);
            setTimeout(() => {
                setIsTransitioning(false);
            }, 80);
        }, 400);
    };

    const handleTagChange = (tag) => {
        if (tag.toLowerCase() === activeTag.toLowerCase() || isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveTag(tag);
            setCurrentPage(1);
            setTimeout(() => {
                setIsTransitioning(false);
            }, 80);
        }, 350);
    };

    return (
        <section id="portfolio-projects" className="scroll-mt-16 relative overflow-hidden bg-white py-10 sm:py-14 md:py-20">

            {/* Background Canvas (bg_simple.png) */}
            <div 
                className="absolute inset-0 pointer-events-none bg-no-repeat bg-cover bg-center opacity-85"
                style={{ 
                    backgroundImage: `url(${bgSimple})`,
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 100px, black calc(100% - 100px), transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100px, black calc(100% - 100px), transparent 100%)'
                }}
            />

            {/* Header */}
            <div
                ref={headerRef}
                style={{
                    opacity:    headerVisible ? 1 : 0,
                    transform:  headerVisible ? 'none' : 'translateY(30px)',
                    transition: headerVisible
                        ? 'opacity 0.7s ease, transform 0.7s ease'
                        : 'opacity 0.25s ease, transform 0.25s ease',
                }}
                className="relative z-10 text-center px-4 sm:px-6"
            >
                <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-[#00A3E0]">Our Work</p>
                <h2 className="mt-2 text-2xl sm:text-3xl md:text-[42px] lg:text-5xl font-extrabold text-[#03365b] tracking-tight leading-tight">
                    Our <span className="text-[#00A3E0]">Projects.</span>
                </h2>
                <div className="mx-auto mt-2.5 sm:mt-3.5 h-1 sm:h-1.5 w-14 sm:w-20 rounded-full bg-[#00A3E0]" />
                <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-xs sm:text-base md:text-lg leading-relaxed md:leading-8 text-slate-600">
                    Explore our engineering projects and solutions delivered across different industries.
                </p>
            </div>

            {/* Category / Tag filter buttons */}
            <div className="relative z-10 mt-6 sm:mt-8 md:mt-10 flex flex-wrap justify-center gap-1.5 sm:gap-2 px-3 sm:px-4">
                {tags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => handleTagChange(tag)}
                        disabled={isTransitioning}
                        className={`rounded-full px-3 py-1 sm:px-4 sm:py-1.5 md:px-5 md:py-2 text-[11px] sm:text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer disabled:cursor-wait ${
                            activeTag.toLowerCase() === tag.toLowerCase()
                                ? "bg-[#007CA7] text-white shadow-md shadow-[#007CA7]/30 scale-105"
                                : "border border-slate-200 bg-white text-slate-700 hover:border-[#007CA7] hover:text-[#007CA7]"
                        }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Loading skeleton */}
            {loading && (
                <div className="relative z-10 mx-auto mt-8 md:mt-12 grid max-w-6xl gap-4 md:gap-6 px-2 md:px-4 grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="overflow-hidden rounded-2xl md:rounded-3xl bg-white shadow-md animate-pulse">
                            <div className="h-48 bg-slate-200" />
                            <div className="p-4 space-y-2">
                                <div className="h-4 w-3/4 rounded bg-slate-200" />
                                <div className="h-3 w-full rounded bg-slate-100" />
                                <div className="h-3 w-2/3 rounded bg-slate-100" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Cards grid (Displays 6 projects per page) */}
            {!loading && (
                <div 
                    id="project-cards-grid"
                    className={`relative z-10 mx-auto mt-8 md:mt-12 grid max-w-6xl gap-4 md:gap-6 px-2 md:px-4 grid-cols-2 lg:grid-cols-3 min-h-[460px] md:min-h-[640px] transform-gpu transition-all duration-500 ease-out ${
                        isTransitioning 
                            ? "opacity-0 translate-y-5 scale-[0.98] pointer-events-none" 
                            : "opacity-100 translate-y-0 scale-100"
                    }`}
                >
                    {paginatedProjects.length === 0 ? (
                        <div className="col-span-full py-24 text-center text-slate-400">
                            <p className="text-lg font-medium">No projects in this category yet.</p>
                        </div>
                    ) : (
                        paginatedProjects.map((project, i) => (
                            <ProjectCard
                                key={`${activeTag}-${safePage}-${project.id || project.title}`}
                                project={project}
                                onOpen={setSelectedProject}
                                delay={i * 70}
                            />
                        ))
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
                <div className="relative z-10 mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 px-3 sm:px-4 select-none">
                    {/* Previous Button */}
                    <button
                        onClick={() => handlePageChange(safePage - 1)}
                        disabled={safePage <= 1 || isTransitioning}
                        className="inline-flex items-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:border-[#007CA7] hover:text-[#007CA7] hover:bg-slate-50 transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={15} />
                        <span>Prev</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1 sm:gap-1.5">
                        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                disabled={isTransitioning}
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center cursor-pointer disabled:cursor-wait ${
                                    safePage === pageNum
                                        ? "bg-[#007CA7] text-white shadow-md shadow-[#007CA7]/30 scale-105"
                                        : "border border-slate-200 bg-white text-slate-700 hover:border-[#007CA7] hover:text-[#007CA7] hover:bg-slate-50"
                                }`}
                                aria-label={`Page ${pageNum}`}
                            >
                                {pageNum}
                            </button>
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => handlePageChange(safePage + 1)}
                        disabled={safePage >= totalPages || isTransitioning}
                        className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:border-[#007CA7] hover:text-[#007CA7] hover:bg-slate-50 transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                        aria-label="Next page"
                    >
                        <span>Next</span>
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* Modal */}
            {selectedProject && (() => {
                const selectedIndex = filtered.findIndex(p => p.id === selectedProject.id || p.title === selectedProject.title);
                return (
                    <Modal 
                        project={selectedProject} 
                        onClose={() => setSelectedProject(null)} 
                        onNextProject={selectedIndex < filtered.length - 1 ? () => setSelectedProject(filtered[selectedIndex + 1]) : null}
                        onPrevProject={selectedIndex > 0 ? () => setSelectedProject(filtered[selectedIndex - 1]) : null}
                    />
                );
            })()}

        </section>
    );
}


export default PortfolioProjects;