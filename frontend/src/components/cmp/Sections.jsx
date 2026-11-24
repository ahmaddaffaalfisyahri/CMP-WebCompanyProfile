// Content transcribed from the supplied prototype; pending official PDF verification.
import { Fragment, useEffect, useState } from 'react';
import { ArrowRight, Layers, Settings, Target, TrendingUp } from 'lucide-react';
import { useCountUp, useInView } from '../../hooks/useInView.js';
import { imageUrl } from '../../utils/api.js';
import { defaultWebsiteText, originalSectionPhotos, readAppearance, readLegacyContact } from '../../utils/websiteSettings.js';
import { Portfolio, Contact } from './Interactive.jsx';

const missions = [
  {
    number: '01',
    icon: Layers,
    title: 'Integrated Solutions',
    description: 'Provide efficient electromechanical solutions through modern technology and best engineering design practices.',
  },
  {
    number: '02',
    icon: Settings,
    title: 'Professional Services',
    description: 'Deliver quality M&E engineering, project management, services and maintenance.',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Customer Value',
    description: 'Enhance productivity and add value through innovative, results-oriented approaches.',
  },
  {
    number: '04',
    icon: Target,
    title: 'Project Success',
    description: 'Support industrial projects through quality and customer satisfaction.',
  },
];

function MissionCard({ number, title, description, icon: Icon }) {
  return (
    <article className="mission">
      <div className="mission-number" aria-hidden="true">{number}</div>
      <div className="mission-corner" aria-hidden="true">
        <svg className="mission-corner-shape" viewBox="0 0 120 112" preserveAspectRatio="none">
          <path d="M8 0H120V105H83Z" />
          <path className="mission-corner-accent" d="M8 0 83 105H120" vectorEffect="non-scaling-stroke" />
        </svg>
        <Icon className="mission-icon" />
      </div>
      <div className="mission-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}

function SitePhoto({ slot, photos, ...attributes }) {
  const original = originalSectionPhotos[slot];
  return <img
    {...attributes}
    src={imageUrl(photos[slot] || original)}
    onError={event => {
      if (event.currentTarget.getAttribute('src') !== original) event.currentTarget.src = original;
    }}
  />;
}

function CompanyFacts({ text }) {
  const [facts, isVisible] = useInView(0.15, '0px 0px -64px 0px');
  const animate = typeof IntersectionObserver !== 'undefined' && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const established = useCountUp(text.establishedYear, 1800, animate && isVisible);
  const disciplines = useCountUp(text.disciplineCount, 1400, animate && isVisible);

  return (
    <div className="cmp-glance" ref={facts}>
      <ul className="cmp-glance-list" role="list" aria-label="Company facts">
        <li>
          <strong className="cmp-glance-value">
            <span className="sr-only">{text.establishedYear}</span>
            <span aria-hidden="true">{animate ? established : text.establishedYear}</span>
          </strong>
          <span className="cmp-glance-label">Established</span>
          <p>Our beginning</p>
        </li>
        <li>
          <strong className="cmp-glance-value">
            <span className="sr-only">{String(text.disciplineCount).padStart(2, '0')}</span>
            <span aria-hidden="true">{String(animate ? disciplines : text.disciplineCount).padStart(2, '0')}</span>
          </strong>
          <span className="cmp-glance-label">Core Disciplines</span>
          <p>Mechanical · Electrical · Automation</p>
        </li>
        <li>
          <strong className="cmp-glance-value">{text.projectSolutions}</strong>
          <span className="cmp-glance-label">Project Solutions</span>
          <p>Design to maintenance</p>
        </li>
      </ul>
    </div>
  );
}

export default function Sections() {
  const [appearance, setAppearance] = useState({ text: {}, photos: {} });
  const [legacyContact, setLegacyContact] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    readAppearance(controller.signal).then(setAppearance).catch(() => {});
    readLegacyContact(controller.signal).then(setLegacyContact).catch(() => {});
    return () => controller.abort();
  }, []);

  const text = { ...defaultWebsiteText, ...legacyContact, ...appearance.text };
  const { photos } = appearance;
  const heroLines = text.heroTitle
    .replace(/^([^\r\n]+?)[ \t]+(and)\r?\n([^\r\n]+)$/i, '$1\n$2\n$3')
    .split(/\r?\n/);

  return <main id="main"><section className="hero" id="home">
    <SitePhoto className="hero-photo" slot="heroMain" photos={photos} alt="CMP technicians inspecting an industrial electrical panel" fetchPriority="high" />
    <div className="wrap">
      <div className="hero-copy">
        <div className="eyebrow">PT Cipta Maju Persada</div>
        <h1>{heroLines.map((line, index) => <Fragment key={index}>{index > 0 && <br />}{line}</Fragment>)}</h1>
        <p>{text.heroDescription}</p>
        <div className="hero-actions">
          <a className="btn" href="#solutions">Explore Our Services</a>
          <a className="textlink" href="#about">Discover CMP <ArrowRight size={20} aria-hidden="true" /></a>
        </div>
      </div>
    </div>
  </section>
<div className="section-flow">
<section className="section" id="about">
  <div className="wrap split">
    <div>
      <div className="eyebrow">About us</div>
      <h2>More Than Engineering.<br />A Partner in Progress.</h2>
      <p className="lead">Since its inception in {text.establishedYear}, CMP has played an active role in the development, engineering and implementation of Mechanical, Electrical and Automation systems. We deliver professional, effective and value-added services tailored to each project.</p>
      <CompanyFacts text={text} />
    </div>
    <div className="about-img">
      <SitePhoto slot="aboutTeam" photos={photos} alt="CMP team at a project site" />
    </div>
  </div>
</section>
<section className="section" id="direction">
  <div className="wrap">
    <div className="sectionhead">
      <div><div className="eyebrow">Our direction</div><h2>Vision & Mission</h2></div>
      <p className="lead">Innovative, efficient engineering that delivers value.</p>
    </div>
    <div className="direction">
      <article className="vision"><div><h3>Our Vision</h3><p>To be a trusted Mechanical & Electrical company in Indonesia, delivering innovative, efficient and high-value electromechanical solutions and growing alongside our customers across industrial sectors.</p></div><SitePhoto slot="vision" photos={photos} alt="CMP field engineering work" /></article>
      <div className="missions">
        {missions.map(mission => <MissionCard key={mission.number} {...mission} />)}
      </div>
    </div>
  </div>
</section>
<section className="section" id="solutions"><div className="wrap"><div className="sectionhead"><div><div className="eyebrow">Turn-key solutions</div><h2>Built from Idea<br />to Operation.</h2></div><p className="lead">Six capabilities for end-to-end project delivery.</p></div><div className="services"><article className="service"><div className="service-top"><span className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20h16M6 16V5h12v11M9 8h6M9 11h6M9 14h4"/></svg></span><span className="index">01</span></div><h3>Mechanical Electrical Design</h3><p>Integrated, efficient M&E design tailored to project requirements.</p></article><article className="service"><div className="service-top"><span className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10M7 5l10 4"/></svg></span><span className="index">02</span></div><h3>Procurement</h3><p>High-quality materials and equipment, aligned with specifications and schedule.</p></article><article className="service"><div className="service-top"><span className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h6M9 11h2m2 0h2M9 15h6M12 21v-3"/></svg></span><span className="index">03</span></div><h3>Manufacture</h3><p>Panel and component fabrication with strict quality control.</p></article><article className="service"><div className="service-top"><span className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 16h18v3H3zM5 16v-3a7 7 0 0 1 14 0v3M10 5v6M14 5v6"/></svg></span><span className="index">04</span></div><h3>Project Erection</h3><p>On-site installation and commissioning to standards and schedule.</p></article><article className="service"><div className="service-top"><span className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 8l-3 3 3 3m8-6 3 3-3 3M9 21h6m-3-4v4"/></svg></span><span className="index">05</span></div><h3>Software Development</h3><p>Control and monitoring system development and configuration.</p></article><article className="service"><div className="service-top"><span className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 6a5 5 0 0 0-6 6l-5 5a2 2 0 0 0 3 3l5-5a5 5 0 0 0 6-6l-3 3-3-3z"/></svg></span><span className="index">06</span></div><h3>Troubleshooting</h3><p>System diagnostics and repairs to maintain optimal performance.</p></article></div></div></section>
<Portfolio photos={photos} />
</div>

<Contact contact={text} /></main>; }
