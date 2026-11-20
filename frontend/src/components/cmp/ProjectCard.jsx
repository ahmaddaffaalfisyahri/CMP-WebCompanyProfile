import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

export default function ProjectCard({ project, index = 0, onClick }) {
    const { title, description, tag, images } = project;
    const cardRef = useRef(null);
    const [entered, setEntered] = useState(() => typeof IntersectionObserver === 'undefined');
    const [hovered, setHovered] = useState(false);
    const [photo, setPhoto] = useState(0);
    const count = images.length;
    const activePhoto = count ? photo % count : 0;

    useEffect(() => {
        const card = cardRef.current;
        if (entered || !card) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setEntered(true);
                observer.disconnect();
            }
        });
        observer.observe(card);
        return () => observer.disconnect();
    }, [entered]);

    useEffect(() => {
        if (!entered || hovered || count < 2) return;

        const interval = window.setInterval(() => {
            setPhoto(current => (current + 1) % count);
        }, 4000);
        return () => window.clearInterval(interval);
    }, [count, entered, hovered]);

    function changePhoto(direction) {
        setPhoto(current => (current % count + direction + count) % count);
    }

    const controlClass = 'relative z-20 inline-grid size-9 cursor-pointer place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors duration-300 hover:border-[#007CA7] hover:bg-cyan-50 hover:text-[#007CA7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007CA7]';

    return (
        <article
            ref={cardRef}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ '--project-card-delay': `${Math.max(0, index) * 70}ms` }}
            className={`group/card relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-[opacity,translate,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-900/10 focus-within:border-cyan-400/50 focus-within:shadow-xl focus-within:shadow-cyan-900/10 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${entered ? 'translate-y-0 opacity-100 [transition-delay:var(--project-card-delay),var(--project-card-delay),0ms,0ms]' : 'translate-y-[28px] opacity-0'} ${onClick ? 'cursor-pointer' : ''}`}
        >
            {onClick && (
                <button
                    type="button"
                    aria-label={count > 0 ? `View gallery for ${title}` : `View project: ${title}`}
                    onClick={() => onClick(project)}
                    className="absolute inset-0 z-10 cursor-pointer rounded-3xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#007CA7]"
                />
            )}

            <div className="relative isolate aspect-[16/10] overflow-hidden bg-slate-100">
                {count === 0 && (
                    <div className="absolute inset-0 grid place-items-center text-slate-400">
                        <ImageOff size={28} aria-hidden="true" />
                    </div>
                )}
                {images.map((src, imageIndex) => (
                    <img
                        key={`${src}-${imageIndex}`}
                        src={src}
                        alt={imageIndex === activePhoto ? `${title} — photo ${imageIndex + 1}` : ''}
                        aria-hidden={imageIndex !== activePhoto}
                        loading="lazy"
                        decoding="async"
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${imageIndex === activePhoto ? 'opacity-100' : 'opacity-0'}`}
                    />
                ))}

                <div
                    aria-hidden="true"
                    className="absolute inset-0 grid place-items-center bg-[#007CA7]/65 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 group-focus-within/card:opacity-100 motion-reduce:transition-none"
                >
                    {count > 0 && (
                        <>
                            {onClick && (
                                <span className="rounded-full border border-white px-4 py-2 text-sm font-semibold text-white">View Gallery</span>
                            )}
                            <span className="absolute right-3 top-3 rounded-full bg-[#03365b]/80 px-2.5 py-1 text-xs font-semibold text-white">
                                {count} {count === 1 ? 'photo' : 'photos'}
                            </span>
                        </>
                    )}
                </div>

                {tag && (
                    <span className="absolute left-3 top-3 max-w-[65%] truncate rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#03365b] backdrop-blur-sm">
                        {tag}
                    </span>
                )}

                {count > 1 && (
                    <div
                        role="img"
                        aria-label={`Photo ${activePhoto + 1} of ${count}`}
                        className="absolute bottom-3 left-1/2 flex max-w-[80%] -translate-x-1/2 flex-wrap justify-center gap-1.5 rounded-full bg-slate-950/45 px-2.5 py-1.5"
                    >
                        {images.map((src, imageIndex) => (
                            <span
                                key={`${src}-${imageIndex}`}
                                className={`h-1.5 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${imageIndex === activePhoto ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
                <h3 className="line-clamp-2 min-h-[2.5em] text-base! leading-tight! font-bold tracking-tight text-[#03365b]! transition-colors duration-300 group-hover/card:text-[#007CA7]! group-focus-within/card:text-[#007CA7]! sm:text-lg!">
                    {title}
                </h3>
                <p className="line-clamp-2 min-h-10 text-sm leading-5! text-slate-600!">{description}</p>

                <div className="mt-auto flex min-h-9 items-center gap-2 pt-1">
                    {count > 1 && (
                        <>
                            <button type="button" aria-label="Previous photo" className={controlClass} onClick={() => changePhoto(-1)}>
                                <ChevronLeft size={17} aria-hidden="true" />
                            </button>
                            <button type="button" aria-label="Next photo" className={controlClass} onClick={() => changePhoto(1)}>
                                <ChevronRight size={17} aria-hidden="true" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-0.5 origin-center scale-x-0 bg-[#00A3E0] transition-transform duration-500 group-hover/card:scale-x-100 group-focus-within/card:scale-x-100 motion-reduce:transition-none"
            />
        </article>
    );
}
