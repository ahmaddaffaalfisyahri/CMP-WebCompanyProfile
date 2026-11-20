import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sections from './Sections';
import content from './content.json';
import cmpLogo from '../../assets/CMP_Logo_Transparant.png';
content.assets.logo = cmpLogo;
import './prototype.css';
import './refinements.css';
import './motion.css';
const links = [['home', 'Home'], ['about', 'About Us'], ['solutions', 'Services'], ['projects', 'Portfolio']];
export default function CMPPublicSite() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const site = useRef(null);
  const menu = useRef(null);
  useEffect(() => {
    const root = site.current;
    const header = root.querySelector('.header');
    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    if (typeof IntersectionObserver === 'undefined') {
      return () => window.removeEventListener('scroll', updateHeader);
    }

    const nav = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(entry.target.id);
      }
    }, { rootMargin: '-14% 0px -62% 0px' });
    root.querySelectorAll('main section[id]').forEach(section => nav.observe(section));

    const reveal = new IntersectionObserver(entries => {
      for (const { target, isIntersecting } of entries) {
        if (target.classList.contains('hero')) {
          target.dataset.heroVisible = String(isIntersecting);
        } else if (target.classList.contains('direction')) {
          for (const card of target.querySelectorAll('.vision, .mission')) {
            card.dataset.reveal = isIntersecting ? 'shown' : 'pending';
          }
        } else {
          target.dataset.reveal = isIntersecting ? 'shown' : 'pending';
        }
      }
    }, { rootMargin: '24px 0px' });

    const grid = root.querySelector('.projects');
    const gridChanges = new MutationObserver(records => {
      for (const record of records) {
        record.removedNodes.forEach(node => {
          if (node instanceof Element && node.matches('.project')) reveal.unobserve(node);
        });
        record.addedNodes.forEach(node => {
          if (node instanceof Element && node.matches('.project')) registerReveal(node);
        });
      }
    });

    function registerReveal(element) {
      const siblings = [...element.parentElement.children].filter(sibling => sibling.tagName !== 'IMG');
      const staggerIndex = Math.min(siblings.indexOf(element), 4);
      element.style.setProperty('--reveal-delay', `${staggerIndex * 125}ms`);
      element.dataset.reveal = 'pending';
      reveal.observe(element);
    }

    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.querySelectorAll('main .section').forEach(section => {
        section.querySelectorAll('.eyebrow, h2, .lead, .about-img, .milestone, .service, .project, .contact-row, .form > :not(.small)').forEach(registerReveal);
      });
      const direction = root.querySelector('.direction');
      if (direction) {
        direction.querySelectorAll('.vision, .mission').forEach((card, index) => {
          const delay = index === 0 ? 0 : 360 + (index - 1) * 140;
          card.style.setProperty('--direction-delay', `${delay}ms`);
          card.dataset.reveal = 'pending';
        });
        reveal.observe(direction);
      }
      reveal.observe(root.querySelector('.hero'));
      if (grid) gridChanges.observe(grid, { childList: true });
    }

    return () => {
      window.removeEventListener('scroll', updateHeader);
      nav.disconnect();
      reveal.disconnect();
      gridChanges.disconnect();
    };
  }, []);
  return <div className="cmp-site" ref={site}><a className="skip" href="#main">Skip to content</a><header className="header"><div className="wrap nav"><a href="#home" aria-label="CMP home"><img className="logo" src={content.assets.logo} alt="CMP Cipta Maju Persada" /></a><button ref={menu} className="menu" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}><Menu className="menu-bars" aria-hidden="true" /><X className="menu-close" aria-hidden="true" /></button><nav id="main-nav" className={`navlinks ${open ? 'open' : ''}`} aria-label="Main navigation" onKeyDown={e => { if (e.key === 'Escape' && open) { setOpen(false); menu.current.focus(); } }} onClick={e => { if (e.target.closest('a')) setOpen(false); }}><div className="menu-items">{links.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined}>{label}</a>)}<a href="#contact" className="btn">Get in Touch</a></div></nav></div></header><Sections /><footer className="footer"><div className="wrap"><div className="footgrid"><div><img className="logo" src={content.assets.logo} alt="CMP logo" /><p className="footer-description">PT Cipta Maju Persada<br />Mechanical, Electrical & Automation.</p></div><div><h3>Explore CMP</h3><nav><a href="#about">About Us</a><a href="#direction">Vision & Mission</a><a href="#solutions">Turn-Key Solutions</a><a href="#projects">Our Work</a></nav></div><div><h3>Contact</h3><nav><a href="#contact">Contact Us</a><a href="#contact">Discuss your next project</a></nav></div></div><div className="footbase"><span>© {new Date().getFullYear()} PT Cipta Maju Persada.</span><span>Engineering for Better Performance.</span></div></div></footer></div>;
}
