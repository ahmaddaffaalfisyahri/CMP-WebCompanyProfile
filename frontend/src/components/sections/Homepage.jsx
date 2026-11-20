import { useState, useEffect } from 'react';
import translucenthomepagebg from '../../assets/home.png';
import homeMobileBg from '../../assets/home_mobile.jpg';
import { useInView, useCountUp } from '../../hooks/useInView';
import { ChevronDown } from 'lucide-react';

// ── Typewriter ──────────────────────────────────────────────────────────────
const DEFAULT_PHRASES = [
    "Marine & Coal Mining Solutions",
    "Engineering, Procurement, and Construction",
    "Automation & System Integration",
    "Software & Control Systems",
];

function Typewriter({ phrases = DEFAULT_PHRASES }) {
    const list = phrases && phrases.length > 0 ? phrases : DEFAULT_PHRASES;
    const [phraseIdx, setPhraseIdx] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [pause, setPause] = useState(false);

    useEffect(() => {
        if (pause) return;
        const full = list[phraseIdx % list.length];

        if (!deleting) {
            if (displayed.length < full.length) {
                const t = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 55);
                return () => clearTimeout(t);
            } else {
                const t = setTimeout(() => setPause(true), 2000);
                return () => clearTimeout(t);
            }
        } else {
            if (displayed.length > 0) {
                const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
                return () => clearTimeout(t);
            } else {
                setPhraseIdx((i) => (i + 1) % list.length);
                setDeleting(false);
            }
        }
    }, [displayed, deleting, phraseIdx, pause, list]);

    // after pause → start deleting
    useEffect(() => {
        if (!pause) return;
        const t = setTimeout(() => { setPause(false); setDeleting(true); }, 500);
        return () => clearTimeout(t);
    }, [pause]);

    return (
        <div className="h-7 sm:h-9 md:h-10 flex items-center justify-center md:justify-start mt-1 sm:mt-2">
            <p id="description" className="text-xs sm:text-base md:text-lg lg:text-xl font-medium text-slate-200 flex items-center text-center md:text-left">
                <span>{displayed}</span>
                <span className={`inline-block w-0.5 md:w-1 h-3.5 sm:h-5 md:h-6 ml-1 sm:ml-1.5 bg-[#007CA7] ${pause ? 'animate-pulse' : ''}`} />
            </p>
        </div>
    );
}

// ── Stat Item ────────────────────────────────────────────────────────────────
function StatItem({ value, suffix, label, trigger, duration = 1800 }) {
    const count = useCountUp(value, duration, trigger);
    return (
        <div className="text-center">
            <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
                {count}{suffix}
            </p>
            <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs md:text-xs text-slate-300 uppercase tracking-widest">{label}</p>
        </div>
    );
}

// ── Homepage ─────────────────────────────────────────────────────────────────
function Homepage() {
    const [statsRef, statsVisible] = useInView(0.3);
    const [heroData, setHeroData] = useState({
        establishedYear: 1997,
        countriesCount: 7,
        yearsExperience: 25,
        typewriterPhrases: DEFAULT_PHRASES
    });

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.ok && data?.data?.hero) {
                    setHeroData(data.data.hero);
                }
            })
            .catch(() => {});
    }, []);

    // Custom silky smooth scroll function with easeInOutCubic
    const handleScrollClick = (e) => {
        e.preventDefault();
        const target = document.getElementById('aboutus') || document.getElementById('about');
        if (!target) return;

        const targetPosition = target.getBoundingClientRect().top + window.scrollY - 70;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 1100; // 1.1s ultra-smooth cinematic glide
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const currentProgress = Math.min(progress / duration, 1);

            // easeInOutCubic: slow start -> accelerate -> gentle slow down
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
        <div id="homepage" className="scroll-mt-16 relative overflow-x-hidden flex flex-col justify-center min-h-screen hero-bg">

            {/* Desktop: Soft blue vignette overlay on the left */}
            <div
                className="absolute inset-0 pointer-events-none hidden md:block"
                style={{
                    background: 'linear-gradient(90deg, rgba(3, 62, 105, 0.44) 0%, rgba(3, 62, 105, 0.30) 20%, rgba(3, 62, 105, 0.10) 38%, transparent 52%)'
                }}
            />

            {/* Mobile: Rich CMP blue overlay — adds vibrant corporate blue aesthetic */}
            <div
                className="absolute inset-0 pointer-events-none md:hidden"
                style={{
                    background: 'linear-gradient(180deg, rgba(3, 54, 91, 0.65) 0%, rgba(3, 62, 105, 0.48) 32%, rgba(0, 124, 167, 0.30) 62%, rgba(3, 54, 91, 0.68) 100%)'
                }}
            />
            {/* Mobile: Subtle radial blue glow for enhanced contrast and depth */}
            <div
                className="absolute inset-0 pointer-events-none md:hidden"
                style={{
                    background: 'radial-gradient(ellipse at 50% 32%, rgba(0, 124, 167, 0.32) 0%, transparent 70%)'
                }}
            />

            {/* Main hero content — layout persis seperti sebelumnya */}
            <div id="mainheadings" className="relative z-10 pt-16 sm:pt-20 md:pt-24 w-full px-4 md:px-8 lg:px-20 flex flex-col items-center md:items-start drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
                <h1
                    id="topline"
                    className="text-xl sm:text-2xl md:text-4xl lg:text-[44px] font-bold text-white mb-0.5 md:mb-1.5 text-center md:text-left sm:whitespace-nowrap tracking-tight leading-tight"
                    style={{ animation: 'fadeInUp 0.8s ease 0.2s both' }}
                >
                    PT Cipta Maju Persada
                </h1>
                <h2
                    id="maintitle"
                    className="text-lg sm:text-2xl md:text-3xl lg:text-[34px] font-bold tracking-[0.16em] text-white/95 leading-none text-center md:text-left mt-1 md:mt-2"
                    style={{ animation: 'fadeInUp 0.9s ease 0.4s both' }}
                >
                    CMP
                </h2>
                <div style={{ animation: 'fadeInUp 0.9s ease 0.6s both' }}>
                    <Typewriter phrases={heroData.typewriterPhrases} />
                </div>
            </div>

            {/* Stats bar — dinamis dari database/settings */}
            <div
                ref={statsRef}
                className="relative z-10 mt-6 sm:mt-8 md:mt-12 mx-4 md:mx-8 lg:mx-20 grid grid-cols-3 gap-2 md:gap-6 border-t border-white/20 pt-3.5 sm:pt-4 md:pt-6"
                style={{ animation: 'fadeInUp 1s ease 0.8s both' }}
            >
                <StatItem value={heroData.establishedYear || 1997} suffix="" label="Est. Year" trigger={statsVisible} />
                <StatItem value={heroData.countriesCount || 7} suffix="" label="Countries" trigger={statsVisible} />
                <StatItem value={heroData.yearsExperience || 25} suffix="+" label="Years Experience" trigger={statsVisible} />
            </div>

            {/* Scroll indicator with downward bouncing animation & silky smooth scroll onClick */}
            <button
                onClick={handleScrollClick}
                className="absolute bottom-14 sm:bottom-18 md:bottom-22 lg:bottom-24 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 text-white/90 hover:text-white transition-all duration-300 cursor-pointer group outline-none"
                aria-label="Scroll to about section"
            >
                <span className="text-[11px] sm:text-xs tracking-[0.2em] uppercase font-semibold drop-shadow-[0_2px_5px_rgba(0,0,0,0.85)] group-hover:text-[#00A3E0] transition-colors">
                    Scroll
                </span>
                <ChevronDown
                    size={22}
                    className="animate-bounce text-[#00A3E0] drop-shadow-[0_2px_8px_rgba(0,163,224,0.7)] group-hover:translate-y-0.5 transition-transform"
                />
            </button>

            {/* Bottom Transition - Curved like a sad mouth :( with deep pronounced arch (Desktop only) */}
            <div className="hidden lg:block absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-20">
                <svg
                    viewBox="0 0 1440 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    className="w-full h-14 sm:h-18 md:h-22 lg:h-26 block"
                >
                    {/* Subtle secondary accent curve */}
                    <path
                        d="M 0,86 C 400,12 1040,12 1440,86"
                        stroke="#00A3E0"
                        strokeWidth="1.2"
                        strokeOpacity="0.35"
                        fill="none"
                    />

                    {/* Main white transition fill - arching upward in center :( deep curvature (desktop only) */}
                    <path
                        d="M 0,95 C 400,20 1040,20 1440,95 L 1440,100 L 0,100 Z"
                        fill="#ffffff"
                    />

                    {/* Thin light-blue accent line along the curve */}
                    <path
                        d="M 0,95 C 400,20 1040,20 1440,95"
                        stroke="#00A3E0"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                    />

                    {/* Left node */}
                    <circle cx="144" cy="74" r="4.5" fill="#ffffff" stroke="#00A3E0" strokeWidth="1.5" />
                    <circle cx="144" cy="74" r="2" fill="#007CA7" />

                    {/* Right node */}
                    <circle cx="1296" cy="74" r="4.5" fill="#ffffff" stroke="#00A3E0" strokeWidth="1.5" />
                    <circle cx="1296" cy="74" r="2" fill="#007CA7" />
                </svg>
            </div>

            {/* Keyframe styles */}
            <style>{`
                .hero-bg {
                    background-image: url(${homeMobileBg});
                    background-size: cover;
                    background-position: center;
                }
                @media (min-width: 768px) {
                    .hero-bg {
                        background-image: url(${translucenthomepagebg});
                        background-position: center;
                    }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-40px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50%      { opacity: 0; }
                }
                .animate-blink { animation: blink 0.8s step-end infinite; }
            `}</style>
        </div>
    );
}

export default Homepage;