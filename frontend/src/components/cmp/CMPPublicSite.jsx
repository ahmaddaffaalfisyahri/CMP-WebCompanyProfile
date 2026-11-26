import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import Sections from './Sections';
import content from './content.json';
import cmpLogo from '../../assets/CMP_Logo_Transparant.png';
import { animatePageScroll, jumpToScrollPosition } from '../../utils/scroll.js';
content.assets.logo = cmpLogo;
import './prototype.css';
import './refinements.css';
import './motion.css';
import './hero.css';
const links = [['home', 'Home'], ['about', 'About Us'], ['solutions', 'Services'], ['projects', 'Portfolio']];
const scrollKeys = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']);

function viewportCenter(header) {
  return (header.getBoundingClientRect().bottom + window.innerHeight) / 2;
}

function sectionScrollPosition(section, header) {
  if (section.id === 'home') return 0;

  const { top, height } = section.getBoundingClientRect();
  if (section.id === 'about') {
    return Math.ceil(window.scrollY + top - header.getBoundingClientRect().height);
  }
  if (section.id === 'projects') {
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const margin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
    return window.scrollY + top - padding - margin;
  }

  return window.scrollY + top + height / 2 - viewportCenter(header);
}

export default function CMPPublicSite() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const site = useRef(null);
  const header = useRef(null);
  const menu = useRef(null);
  const cancelScroll = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const homeHref = location.pathname + location.search;

  function handleSectionNavigation(event) {
    const link = event.target.closest('a[data-home-link], a[href^="#"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    const sectionId = link.hasAttribute('data-home-link') ? 'home' : link.hash.slice(1);
    const section = document.getElementById(sectionId);
    if (!section || !site.current.contains(section)) return;

    event.preventDefault();
    setOpen(false);
    const hash = sectionId === 'home' ? '' : link.hash;
    if (location.hash !== hash) {
      navigate({ search: location.search, hash }, { state: { sectionNavigation: true } });
    }
    const heading = section.querySelector('h1, h2');
    if (heading) {
      heading.tabIndex = -1;
      heading.toggleAttribute('data-pointer-navigation', event.detail > 0);
      heading.focus({ preventScroll: true });
    }
    cancelScroll.current?.();
    const top = sectionScrollPosition(section, header.current);
    cancelScroll.current = animatePageScroll(top, 760, () => { cancelScroll.current = null; });
  }

  useEffect(() => {
    if (location.hash !== '#home') return;
    navigate(homeHref, { replace: true, state: location.state });
  }, [homeHref, location.hash, location.state, navigate]);

  useEffect(() => {
    if (navigationType !== 'POP' || !location.state?.sectionNavigation) return;
    const section = document.getElementById(location.hash.slice(1) || 'home');
    if (!section || !site.current.contains(section)) return;

    cancelScroll.current?.();
    cancelScroll.current = null;
    const frame = requestAnimationFrame(() => jumpToScrollPosition(sectionScrollPosition(section, header.current)));
    return () => cancelAnimationFrame(frame);
  }, [location.hash, location.state, navigationType]);

  useEffect(() => {
    const root = site.current;
    const navHeader = header.current;
    const sections = [...root.querySelectorAll('main section[id]')];
    let frame = 0;
    function updateHeader() {
      frame = 0;
      navHeader.classList.toggle('is-scrolled', window.scrollY > 12);
      const center = viewportCenter(navHeader);
      const current = sections.find(section => {
        const { top, bottom } = section.getBoundingClientRect();
        return top <= center && bottom > center;
      });
      if (current) setActive(current.id);
    }
    function scheduleHeaderUpdate() {
      if (!frame) frame = requestAnimationFrame(updateHeader);
    }
    function stopSectionScroll() {
      cancelScroll.current?.();
      cancelScroll.current = null;
    }
    function handleScrollKey(event) {
      if (scrollKeys.has(event.key)) stopSectionScroll();
    }
    updateHeader();
    window.addEventListener('scroll', scheduleHeaderUpdate, { passive: true });
    window.addEventListener('resize', scheduleHeaderUpdate);
    window.addEventListener('wheel', stopSectionScroll, { passive: true });
    window.addEventListener('touchstart', stopSectionScroll, { passive: true });
    window.addEventListener('keydown', handleScrollKey);
    window.addEventListener('popstate', stopSectionScroll);

    function stopHeaderUpdates() {
      window.removeEventListener('scroll', scheduleHeaderUpdate);
      window.removeEventListener('resize', scheduleHeaderUpdate);
      window.removeEventListener('wheel', stopSectionScroll);
      window.removeEventListener('touchstart', stopSectionScroll);
      window.removeEventListener('keydown', handleScrollKey);
      window.removeEventListener('popstate', stopSectionScroll);
      cancelAnimationFrame(frame);
      stopSectionScroll();
    }

    if (typeof IntersectionObserver === 'undefined') return stopHeaderUpdates;

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
        section.querySelectorAll('.eyebrow, h2, .lead, .about-img, .cmp-glance-list > li, .project, .contact-row, .form > :not(.small)').forEach(registerReveal);
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
      stopHeaderUpdates();
      reveal.disconnect();
      gridChanges.disconnect();
    };
  }, []);
  return <div className="cmp-site" ref={site}><a className="skip" href="#main">Skip to content</a><header className="header" ref={header} onClick={handleSectionNavigation}>
    <div className="wrap nav">
      <a href={homeHref} data-home-link="" aria-label="CMP home"><img className="logo" src={content.assets.logo} alt="CMP Cipta Maju Persada" /></a>
      <button ref={menu} className="menu" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>
        <Menu className="menu-bars" aria-hidden="true" />
        <X className="menu-close" aria-hidden="true" />
      </button>
      <nav
        id="main-nav"
        className={`navlinks ${open ? 'open' : ''}`}
        aria-label="Main navigation"
        onKeyDown={event => {
          if (event.key === 'Escape' && open) {
            setOpen(false);
            menu.current.focus();
          }
        }}
      >
        <div className="menu-items">
          {links.map(([id, label]) => (
            <a key={id} href={id === 'home' ? homeHref : `#${id}`} data-home-link={id === 'home' ? '' : undefined} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined}>{label}</a>
          ))}
          <a href="#contact" className="btn" aria-current={active === 'contact' ? 'location' : undefined}>Contact Us</a>
        </div>
      </nav>
    </div>
  </header><Sections onSectionNavigation={handleSectionNavigation} /><footer className="footer"><div className="wrap"><div className="footgrid"><div><img className="logo" src={content.assets.logo} alt="CMP logo" /><p className="footer-description">PT Cipta Maju Persada<br />Mechanical, Electrical & Automation.</p></div><div><h3>Explore CMP</h3><nav><a href="#about">About Us</a><a href="#direction">Vision & Mission</a><a href="#solutions">Turn-Key Solutions</a><a href="#projects">Our Work</a></nav></div><div><h3>Contact</h3><nav><a href="#contact">Contact Us</a><a href="#contact">Discuss your next project</a></nav></div></div><div className="footbase"><span>© {new Date().getFullYear()} PT Cipta Maju Persada.</span><span>Engineering for Better Performance.</span></div></div></footer></div>;
}
