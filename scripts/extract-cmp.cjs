const fs = require('node:fs');
const html = fs.readFileSync('CMP_Company_Profile_Prototype_v2.html', 'utf8');
const assets = JSON.parse(html.match(/const assets=(\{.*?\}),projects=/s)[1]);
const projects = JSON.parse(html.match(/,projects=(\[.*?\]);document/s)[1]);
const paths = {};
for (const [id, uri] of Object.entries(assets)) {
  const [, type, data] = uri.match(/^data:image\/(\w+);base64,(.+)$/s);
  paths[id] = `/cmp/${id}.${type === 'jpeg' ? 'jpg' : type}`;
  fs.writeFileSync(`frontend/public${paths[id]}`, Buffer.from(data, 'base64'));
}
fs.writeFileSync('frontend/src/components/cmp/content.json', JSON.stringify({ assets: paths, projects: projects.map((p,i)=>({id:`cmp-${i}`,client:p[0],title:p[1],category:p[2],description:p[3],scope:p[4],images:p[5].map(id=>paths[id])})) }, null, 2));
let css = html.match(/<style>(.*?)<\/style>/s)[1];
function scope(css) {
 let out='', pos=0;
 while(pos<css.length){ const open=css.indexOf('{',pos); if(open<0){out+=css.slice(pos);break;} let depth=1,end=open+1;while(depth){if(css[end]==='{')depth++;if(css[end]==='}')depth--;end++;}
 const selector=css.slice(pos,open).trim(), body=css.slice(open+1,end-1);
 out += selector.startsWith('@') ? `${selector}{${scope(body)}}` : `${selector.split(',').map(s=>[':root','body'].includes(s.trim())?'.cmp-site':s.trim()==='html'?'html:has(.cmp-site)':`.cmp-site ${s.trim()}`).join(',')}{${body}}\n`;pos=end; }
 return out;
}
fs.writeFileSync('frontend/src/components/cmp/prototype.css', '/* Layout and provisional tokens extracted from the supplied CMP V2 prototype. */\n'+scope(css));
let main=html.match(/<main id="main">(.*?)<\/main>/s)[1];
main=main.replace(/<div class="stats">.*?<section class="section" id="about">/s,'<section class="section" id="about">');
main=main.replace(/<div class="milestone"><strong>Our Commitment.*?<\/div>/s,'');
main=main.replace(/<section class="strip">.*?<\/section>/s,'');
main=main.replace(/<section class="section" id="projects">.*?<\/section>/s,'<Portfolio />');
main=main.replace(/<section class="section contact" id="contact">.*?<\/section>/s,'<Contact />');
main=main.replace(/class=/g,'className=').replace(/stroke-width=/g,'strokeWidth=').replace(/stroke-linecap=/g,'strokeLinecap=').replace(/stroke-linejoin=/g,'strokeLinejoin=');
main=main.replace(/data-img="(\w+)"/g,(_,id)=>`src="${paths[id]}"`).replace(/<img([^>]+)>/g,'<img$1 />').replace(/<br>/g,'<br />');
fs.writeFileSync('frontend/src/components/cmp/Sections.jsx', `// Content transcribed from the supplied prototype; pending official PDF verification.\nimport { Portfolio, Contact } from './Interactive.jsx';\nexport default function Sections() { return <main id="main">${main}</main>; }\n`);
