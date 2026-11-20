import { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Sections from './Sections';
import content from './content.json';
import cmpLogo from '../../assets/CMP_Logo_Transparant.png';
content.assets.logo = cmpLogo;
import './prototype.css';
import './refinements.css';
const links = [['home', 'Home'], ['about', 'About Us'], ['solutions', 'Services'], ['projects', 'Portfolio']];
export default function CMPPublicSite() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  useEffect(() => {
    const navObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); }), { rootMargin: '-15% 0px -60% 0px' });
    document.querySelectorAll('.cmp-site main section[id]').forEach(section => navObserver.observe(section));
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); reveal.unobserve(entry.target); } }), { threshold: 0.08 });
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) document.querySelectorAll('.cmp-site .section > .wrap').forEach(element => { element.classList.add('reveal'); reveal.observe(element); });
    return () => { navObserver.disconnect(); reveal.disconnect(); };
  }, []);
  return <div className="cmp-site"><a className="skip" href="#main">Skip to content</a><header className="header"><div className="wrap nav"><a href="#home" aria-label="CMP home"><img className="logo" src={content.assets.logo} alt="CMP Cipta Maju Persada" /></a><button className="menu" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><nav id="main-nav" className={`navlinks ${open ? 'open' : ''}`} aria-label="Main navigation" onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); document.querySelector('.cmp-site .menu').focus(); } }} onClick={e => { if (e.target.closest('a')) setOpen(false); }}>{links.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined}>{label}</a>)}<a href="#contact" className="btn">Get in Touch <ArrowUpRight size={18} /></a></nav></div></header><Sections /><footer className="footer"><div className="wrap"><div className="footgrid"><div><img className="logo" src={content.assets.logo} alt="CMP logo" /><p className="footer-description">PT Cipta Maju Persada<br />Mechanical, Electrical & Automation.</p></div><div><h3>Explore CMP</h3><nav><a href="#about">About Us</a><a href="#direction">Vision & Mission</a><a href="#solutions">Turn-Key Solutions</a><a href="#projects">Our Work</a></nav></div><div><h3>Contact</h3><nav><a href="#contact">Contact Us</a><a href="#contact">Discuss your next project</a></nav></div></div><div className="footbase"><span>© {new Date().getFullYear()} PT Cipta Maju Persada.</span><span>Engineering for Better Performance.</span></div></div></footer></div>;
}
