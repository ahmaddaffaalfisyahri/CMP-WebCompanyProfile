import useMotionDismiss from '../../hooks/useMotionDismiss';
import { useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ExternalLink, LoaderCircle, X, Mail, MapPin, Phone } from 'lucide-react';
import { API, imageUrl } from '../../utils/api';
import { getBundledProjects, publicApiEnabled } from '../../utils/websiteSettings.js';
import { animatePageScroll, prefersReducedMotion } from '../../utils/scroll.js';

// Enable only after the target API and its data have been verified as CMP-owned.
const validImage = value => typeof value === 'string' && /^\/(?:cmp|uploads)\/[a-zA-Z0-9_.-]+$/.test(value);

function useProjectSlides(images, paused = false) {
  const [requested, setPhoto] = useState(0);
  const [slides, setSlides] = useState({ images, active: 0, previous: -1 });
  const current = slides.images === images ? slides : { active: 0, previous: -1 };
  const count = images.length;
  const target = count ? requested % count : 0;

  useEffect(() => {
    if (paused || count < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => setPhoto(index => (index + 1) % count), 4000);
    return () => window.clearTimeout(timer);
  }, [count, images, paused, target]);

  useEffect(() => {
    if (target === current.active) return;
    let cancelled = false;
    const image = new Image();
    image.src = imageUrl(images[target]);
    image.decode().then(() => {
      if (!cancelled) setSlides({ images, active: target, previous: current.active });
    }).catch(() => {
      // Keep the current photo visible if its replacement cannot load.
    });
    return () => { cancelled = true; };
  }, [current.active, images, target]);

  function step(delta) {
    if (count > 1) setPhoto(index => (index + delta + count) % count);
  }

  return { ...current, setPhoto, step };
}

function ProjectSlides({ images, title, active, previous, lazy = false }) {
  return images.map((src, index) => (
    <span
      key={`${src}-${index}`}
      className="project-slide"
      data-layer={index === active ? 'active' : index === previous ? 'previous' : undefined}
      aria-hidden={index !== active}
    >
      {(index === active || index === previous) && (
        <img src={imageUrl(src)} alt={index === active ? `${title} — photo ${index + 1}` : ''} loading={lazy && index === 0 && previous === -1 ? 'lazy' : undefined} />
      )}
    </span>
  ));
}

function ProjectCard({ project, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const { active, previous } = useProjectSlides(project.images, hovered || focused);
  return (
    <article
      className="project"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="project-photo">
        {project.images.length ? (
          <ProjectSlides images={project.images} title={project.title} active={active} previous={previous} lazy />
        ) : <span className="photo-placeholder">Project documentation coming soon</span>}
        <span className="tag">{project.category}</span>
      </div>
      <div className="project-copy">
        {project.client && <span className="client">{project.client}</span>}
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <button
          type="button"
          className="detail"
          aria-label={`View Project Details: ${project.title}`}
          aria-haspopup="dialog"
          onClick={() => onOpen(project)}
        >
          View Project Details <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

function Gallery({ project, previous, next, onSelect, onClose }) {
  const [dialog, dismiss] = useMotionDismiss(onClose);
  const count = project.images.length;
  const { active: activePhoto, previous: previousPhoto, setPhoto, step } = useProjectSlides(project.images);

  useEffect(() => {
    const element = dialog.current;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [dialog]);

  function selectProject(item) {
    setPhoto(0);
    dialog.current.scrollTo({ top: 0, behavior: 'instant' });
    onSelect(item);
  }

  return (
    <dialog
      ref={dialog}
      className="project-gallery"
      aria-labelledby="gallery-title"
      onCancel={event => { event.preventDefault(); dismiss(); }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const { left, right, top, bottom } = event.currentTarget.getBoundingClientRect();
        if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) dismiss();
      }}
      onKeyDown={event => {
        if (count < 2 || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        step(event.key === 'ArrowLeft' ? -1 : 1);
      }}
    >
          <button type="button" className="close" aria-label="Close gallery" onClick={dismiss}><X size={20} aria-hidden="true" /></button>
      <div className="gallery-media">
        <div className="gallery-stage">
          {count > 0 ? (
            <>
              <ProjectSlides images={project.images} title={project.title} active={activePhoto} previous={previousPhoto} />
              <p className="counter">{activePhoto + 1} / {count}</p>
              {count > 1 && (
                <>
                  <button type="button" className="gallery-control prev" aria-label="Previous photo" onClick={() => step(-1)}><ChevronLeft size={20} aria-hidden="true" /></button>
                  <button type="button" className="gallery-control next" aria-label="Next photo" onClick={() => step(1)}><ChevronRight size={20} aria-hidden="true" /></button>
                </>
              )}
            </>
          ) : <p className="gallery-empty">Project documentation coming soon</p>}
        </div>
        {count > 1 && (
          <div className="gallery-thumbnails" role="group" aria-label="Project photos">
            {project.images.map((image, index) => (
              <button key={`${image}-${index}`} type="button" aria-label={`Show photo ${index + 1}`} aria-pressed={activePhoto === index} onClick={() => setPhoto(index)}>
                <img src={imageUrl(image)} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="dialog-body">
        <div className="gallery-meta">
          <span>{project.category}</span>
          {project.client && <p>{project.client}</p>}
        </div>
        <h3 id="gallery-title">{project.title}</h3>
        <p>{project.description}</p>
        {project.scope?.length > 0 && (
          <>
            <h4>Scope of work</h4>
            <ul>{project.scope.map(item => <li key={item}>{item}</li>)}</ul>
          </>
        )}
        {(previous || next) && (
          <nav className="gallery-project-nav" aria-label="Browse projects">
            <button type="button" aria-label="Previous project" title="Previous project" disabled={!previous} onClick={() => selectProject(previous)}><ArrowLeft size={17} aria-hidden="true" /></button>
            <button type="button" aria-label="Next project" title="Next project" disabled={!next} onClick={() => selectProject(next)}><ArrowRight size={17} aria-hidden="true" /></button>
          </nav>
        )}
      </div>
    </dialog>
  );
}

export function Portfolio({ photos }) {
  const [apiProjects, setApiProjects] = useState(null);
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const projectGrid = useRef(null);
  const portfolioContent = useRef(null);
  const pageFade = useRef(null);
  const cancelPageScroll = useRef(null);

  useEffect(() => () => cancelPageScroll.current?.(), []);
  useEffect(() => {
    if (!publicApiEnabled) return;
    const controller = new AbortController();
    fetch(`${API}/projects`, { signal: controller.signal }).then(res => { if (!res.ok) throw new Error('Project service unavailable'); return res.json(); }).then(data => {
      if (!Array.isArray(data) || !data.every(p => p.id != null && typeof p.title === 'string' && typeof p.category === 'string' && Array.isArray(p.images))) throw new Error('Invalid projects');
      setApiProjects(data.map(p => ({ ...p, images: p.images.filter(validImage) })));
    }).catch(() => { /* Retain the documented CMP portfolio when the API is unavailable. */ });
    return () => controller.abort();
  }, []);
  const fallbackProjects = useMemo(() => getBundledProjects(photos), [photos]);
  const projects = apiProjects ?? fallbackProjects;
  const categories = ['All', ...new Set(projects.map(p => p.category))];
  const filtered = projects.filter(p => category === 'All' || p.category === category);
  const selectedIndex = selected ? filtered.findIndex(project => project.id === selected.id) : -1;
  const pages = Math.ceil(filtered.length / 6);
  const currentPage = Math.min(page, pages || 1);

  function goToPage(nextPage) {
    cancelPageScroll.current?.();
    if (nextPage === currentPage) return;

    const reducedMotion = prefersReducedMotion();
    const startY = window.scrollY;
    const headerOffset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const targetY = startY + portfolioContent.current.getBoundingClientRect().top - headerOffset - 24;

    function showPage() {
      flushSync(() => setPage(nextPage));
      const grid = projectGrid.current;
      grid.focus({ preventScroll: true });
      pageFade.current?.cancel();
      if (!reducedMotion) {
        pageFade.current = grid.animate([{ opacity: 0.78 }, { opacity: 1 }], {
          duration: 320,
          easing: 'ease-out',
        });
      }
    }

    cancelPageScroll.current = animatePageScroll(targetY, 590, showPage);
  }
  return <section className="section" id="projects"><div className="wrap" ref={portfolioContent}><div className="sectionhead"><div><div className="eyebrow">Our work</div><h2>Proven Solutions.<br />Real Projects.</h2></div><p className="lead">Explore selected mechanical, electrical, automation and network projects.</p></div>
    <div className="filters" role="group" aria-label="Filter projects">{categories.map(item => <button key={item} className={`filter ${item === category ? 'active' : ''}`} aria-pressed={item === category} onClick={() => { cancelPageScroll.current?.(); setCategory(item); setPage(1); }}>{item}</button>)}</div>
    <div className="projects" ref={projectGrid} tabIndex={-1}>{filtered.slice((currentPage - 1) * 6, currentPage * 6).map(project => <ProjectCard key={`${category}-${project.id}`} project={project} onOpen={setSelected} />)}</div>
    {!filtered.length && <p className="project-empty" role="status">No projects are available in this category yet.</p>}
    {pages > 1 && <nav className="pagination" aria-label="Project pages">{Array.from({ length: pages }, (_, i) => <button key={i} className={`filter ${currentPage === i + 1 ? 'active' : ''}`} aria-current={currentPage === i + 1 ? 'page' : undefined} onClick={() => goToPage(i + 1)}>{i + 1}</button>)}</nav>}
    {selected && <Gallery project={selected} previous={filtered[selectedIndex - 1]} next={selectedIndex < 0 ? undefined : filtered[selectedIndex + 1]} onSelect={setSelected} onClose={() => setSelected(null)} />}
  </div></section>;
}

export function Contact({ contact }) {
  const [status, setStatus] = useState('idle');
  async function submit(event) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    if (Object.values(values).some(value => !value.trim())) { setStatus('invalid'); return; }
    if (!publicApiEnabled) { setStatus('unavailable'); return; }
    setStatus('sending');
    try {
      const response = await fetch(`${API}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values), signal: AbortSignal.timeout(15000) });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error('Message not accepted');
      setStatus('success'); form.reset();
    } catch { setStatus('error'); }
  }
  return <section className="section contact" id="contact"><div className="wrap contact-grid"><div><div className="eyebrow">Contact us</div><h2>Let’s Build<br />What’s Next.</h2><p className="lead">Get in touch with CMP for your next engineering project.</p><div className="contact-list">
    <div className="contact-row">
      <MapPin aria-hidden="true" />
      <div>
        <strong>Office</strong>
        <p>{contact.address}</p>
        <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" className="maps-link">
          <MapPin aria-hidden="true" />
          <span>Open in Google Maps</span>
          <ExternalLink aria-hidden="true" />
        </a>
      </div>
    </div>
    <div className="contact-row"><Phone /><div><strong>Phone</strong><a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}>{contact.phone}</a></div></div>
    <div className="contact-row"><Mail /><div><strong>Email</strong><a href={`mailto:${contact.email}`}>{contact.email}</a></div></div>
  </div></div><form className="form" onSubmit={submit}><h3>Send Us a Message.</h3><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" placeholder="Full name" required maxLength={120} /><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={254} /><label htmlFor="message">Your message</label><textarea id="message" name="message" placeholder="Tell us about your project" required maxLength={5000} /><button className="btn" disabled={status === 'sending'}>{status === 'sending' ? <><LoaderCircle className="contact-spinner" size={16} aria-hidden="true" />Sending…</> : status === 'success' ? 'Send Another Message' : 'Send Message'}</button>
    <p className="small" role="status"><span key={status}>{({ success: 'Thank you. Your message has been received.', error: 'Your message could not be sent. Please try again or contact us by email.', unavailable: 'Online messaging is currently unavailable. Please contact us by email or phone.', invalid: 'Please complete all fields.' })[status]}</span></p>
  </form></div></section>;
}
