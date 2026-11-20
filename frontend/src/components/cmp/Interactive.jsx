import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, X, Mail, MapPin, Phone } from 'lucide-react';
import content from './content.json';
import { API } from '../../utils/api';

// Enable only after the target API and its data have been verified as CMP-owned.
const apiEnabled = import.meta.env.VITE_CMP_API_ENABLED === 'true';
const contactDefault = { address: 'Komplek Grogol Permai Blok D4/D5, Jl. Dr. Latumenten, Grogol Petamburan, Jelambar.', phone: '+62 21-540-1398', email: 'info@ciptamajupersada.com' };
const validImage = value => typeof value === 'string' && /^\/(?:cmp|uploads)\/[a-zA-Z0-9_.-]+$/.test(value);

function ProjectCard({ project, onOpen }) {
  const [photo, setPhoto] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || project.images.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setPhoto(i => (i + 1) % project.images.length), 4000);
    return () => clearInterval(timer);
  }, [paused, project.images.length]);
  return <article className="project" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}>
    <button className="project-photo" onClick={() => onOpen(project)} aria-label={`View gallery: ${project.title}`}>
      {project.images.length ? <img src={project.images[photo]} alt={`${project.title} documentation ${photo + 1}`} loading="lazy" /> : <span className="photo-placeholder">Project documentation coming soon</span>}
      <span className="tag">{project.category}</span><span className="gallery-label">View gallery ↗</span>
    </button>
    {project.images.length > 1 && <div className="photo-dots" aria-label={`${project.title} photos`}>{project.images.map((image, i) => <button key={image} aria-label={`Show photo ${i + 1}`} aria-pressed={photo === i} onClick={() => setPhoto(i)} />)}</div>}
    <div className="project-copy">{project.client && <span className="client">{project.client}</span>}<h3>{project.title}</h3><p>{project.description}</p><button className="detail" onClick={() => onOpen(project)}>View project details →</button></div>
  </article>;
}

function Gallery({ project, onClose }) {
  const dialog = useRef(null);
  const [photo, setPhoto] = useState(0);
  useEffect(() => {
    const element = dialog.current;
    const focus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = previousOverflow; focus?.focus(); };
  }, []);
  const step = delta => setPhoto(i => (i + delta + project.images.length) % project.images.length);
  return <dialog ref={dialog} aria-labelledby="gallery-title" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) { const rect = e.currentTarget.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) onClose(); } }} onKeyDown={e => { if (e.key === 'Escape') { e.preventDefault(); onClose(); return; } if (project.images.length && ['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); step(e.key === 'ArrowLeft' ? -1 : 1); } }}>
    <div className="dialog-body"><div className="dialog-head"><div><p className="client">{project.client}</p><h3 id="gallery-title">{project.title}</h3></div><button className="close" aria-label="Close gallery" onClick={onClose}><X size={20} /></button></div>
      {project.images.length > 0 && <><div className="gallery-stage"><img src={project.images[photo]} alt={`${project.title} — photo ${photo + 1}`} />{project.images.length > 1 && <><button className="gallery-control prev" aria-label="Previous photo" onClick={() => step(-1)}><ChevronLeft /></button><button className="gallery-control next" aria-label="Next photo" onClick={() => step(1)}><ChevronRight /></button></>}</div><p className="counter" aria-live="polite">{photo + 1} / {project.images.length}</p></>}
      <p>{project.description}</p>{project.scope?.length > 0 && <><h4>Scope of work</h4><ul>{project.scope.map(item => <li key={item}>{item}</li>)}</ul></>}
    </div>
  </dialog>;
}

export function Portfolio() {
  const [projects, setProjects] = useState(content.projects);
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    if (!apiEnabled) return;
    const controller = new AbortController();
    fetch(`${API}/projects`, { signal: controller.signal }).then(res => { if (!res.ok) throw new Error('Project service unavailable'); return res.json(); }).then(data => {
      if (!Array.isArray(data) || !data.every(p => p.id != null && typeof p.title === 'string' && typeof p.category === 'string' && Array.isArray(p.images))) throw new Error('Invalid projects');
      setProjects(data.map(p => ({ ...p, images: p.images.filter(validImage) })));
    }).catch(() => { /* Retain the documented CMP portfolio when the API is unavailable. */ });
    return () => controller.abort();
  }, []);
  const categories = ['All', ...new Set(projects.map(p => p.category))];
  const filtered = projects.filter(p => category === 'All' || p.category === category);
  const pages = Math.ceil(filtered.length / 6);
  const currentPage = Math.min(page, pages || 1);
  return <section className="section" id="projects"><div className="wrap"><div className="sectionhead"><div><div className="eyebrow">Our work</div><h2>Proven Solutions.<br />Real Projects.</h2></div><p className="lead">Explore selected mechanical, electrical, automation and network projects.</p></div>
    <div className="filters" role="group" aria-label="Filter projects">{categories.map(item => <button key={item} className={`filter ${item === category ? 'active' : ''}`} aria-pressed={item === category} onClick={() => { setCategory(item); setPage(1); }}>{item}</button>)}</div>
    <div className="projects">{filtered.slice((currentPage - 1) * 6, currentPage * 6).map(project => <ProjectCard key={project.id} project={project} onOpen={setSelected} />)}</div>
    {!filtered.length && <p role="status">No projects are available in this category yet.</p>}
    {pages > 1 && <nav className="pagination" aria-label="Project pages">{Array.from({ length: pages }, (_, i) => <button key={i} className={`filter ${currentPage === i + 1 ? 'active' : ''}`} aria-current={currentPage === i + 1 ? 'page' : undefined} onClick={() => { setPage(i + 1); document.getElementById('projects').scrollIntoView(); }}>{i + 1}</button>)}</nav>}
    {selected && <Gallery key={selected.id} project={selected} onClose={() => setSelected(null)} />}
  </div></section>;
}

export function Contact() {
  const [contact, setContact] = useState(contactDefault);
  const [status, setStatus] = useState('idle');
  useEffect(() => {
    if (!apiEnabled) return;
    const controller = new AbortController();
    fetch(`${API}/settings`, { signal: controller.signal }).then(r => { if (!r.ok) throw new Error('Settings unavailable'); return r.json(); }).then(result => {
      const value = result.data?.contact;
      if (result.ok && value && ['address', 'phone', 'email'].every(key => typeof value[key] === 'string' && value[key].trim())) setContact(value);
    }).catch(() => {});
    return () => controller.abort();
  }, []);
  async function submit(event) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    if (Object.values(values).some(value => !value.trim())) { setStatus('invalid'); return; }
    if (!apiEnabled) { setStatus('unavailable'); return; }
    setStatus('sending');
    try {
      const response = await fetch(`${API}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values), signal: AbortSignal.timeout(15000) });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error('Message not accepted');
      setStatus('success'); form.reset();
    } catch { setStatus('error'); }
  }
  return <section className="section contact" id="contact"><div className="wrap contact-grid"><div><div className="eyebrow">Contact us</div><h2>Let’s Build<br />What’s Next.</h2><p className="lead">Get in touch with CMP for your next engineering project.</p><div className="contact-list">
    <div className="contact-row"><MapPin /><div><strong>Office</strong><p>{contact.address}</p></div></div>
    <div className="contact-row"><Phone /><div><strong>Phone</strong><a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}>{contact.phone}</a></div></div>
    <div className="contact-row"><Mail /><div><strong>Email</strong><a href={`mailto:${contact.email}`}>{contact.email}</a></div></div>
  </div></div><form className="form" onSubmit={submit}><h3>Send Us a Message.</h3><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" placeholder="Full name" required maxLength={120} /><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={254} /><label htmlFor="message">Your message</label><textarea id="message" name="message" placeholder="Tell us about your project" required maxLength={5000} /><button className="btn" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send Message'}<ArrowRight size={18} /></button>
    <p className="small" role="status">{({ success: 'Thank you. Your message has been received.', error: 'Your message could not be sent. Please try again or contact us by email.', unavailable: 'Online messaging is currently unavailable. Please contact us by email or phone.', invalid: 'Please complete all fields.' })[status]}</p>
  </form></div></section>;
}
