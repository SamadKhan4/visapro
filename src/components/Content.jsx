import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Search, ChevronDown } from 'lucide-react'
import { services, resources, faqs } from '../data'
import { Button } from './Layout'

const alts={city:'Modern glass towers viewed from street level',work:'Open-plan office with tall windows',people:'Colleagues talking around a table',visit:'City skyline and surrounding neighborhoods',family:'Family spending time outdoors',desk:'Professional reviewing paperwork at a desk',meeting:'Business team meeting in a conference room',transfer:'Colleagues working in a shared office',residency:'Professional working at a laptop',couple:'Celebration venue with arranged tables',business:'Professionals reviewing business documents together'}
export const photo=name=>'/images/'+name+'.webp'
export function Photo({name,eager=false,decorative=false}){return <img className="photo" src={photo(name)} alt={decorative?'':alts[name]} loading={eager?'eager':'lazy'} fetchPriority={eager?'high':undefined} onError={e=>{e.currentTarget.hidden=true}}/>}
export function Section({children,tone='',id}){return <section id={id} className={'section '+tone}><div className="wrap">{children}</div></section>}
export function Heading({tag,title,description}){return <div className="section-heading">{tag&&<p className="eyebrow">{tag}</p>}<h2>{title}</h2>{description&&<p>{description}</p>}</div>}
export function Reveal({children,className=''}){const reduced=useReducedMotion();return <motion.div className={className} initial={false} whileInView={reduced?undefined:{y:[10,0]}} viewport={{once:true,amount:.2}} transition={{duration:.4}}>{children}</motion.div>}
export function Hero({title,description,image,tag='U.S. IMMIGRATION SERVICES',home=false,children}){
 const reduced=useReducedMotion()
 return <section className={home?'hero hero-home':'hero hero-inner'}>{image&&<div className="hero-media"><Photo name={image} eager={home} decorative/></div>}<div className="wrap hero-content"><motion.div initial={false} animate={reduced?undefined:{y:[12,0]}} transition={{duration:.65,ease:'easeOut'}}><p className="eyebrow">{tag}</p><h1>{title}</h1><p className="hero-description">{description}</p>{children}</motion.div></div></section>
}
export function Breadcrumb({items}){return <nav aria-label="Breadcrumb" className="breadcrumbs wrap"><Link to="/">Home</Link>{items.map(([label,path])=><span key={label}><span aria-hidden="true">/</span>{path?<Link to={path}>{label}</Link>:<span aria-current="page">{label}</span>}</span>)}</nav>}
export function CTA(){return <Section tone="cta"><div className="cta-inner"><Heading tag="PLAN YOUR NEXT STEP" title="Take the Next Step Toward Your American Future." description="Get personalized guidance and explore immigration options aligned with your goals."/><Button>Schedule Your Consultation</Button></div></Section>}
export function FAQs({items=faqs}){return <div className="faq-list">{items.map(([question,answer])=><details key={question}><summary>{question}<ChevronDown size={19}/></summary><p>{answer}</p></details>)}</div>}
export function Directory({kind='visa',items=services}){
 const resource=kind==='resources'
 const list=resource?resources:items
 const [query,setQuery]=useState(''),[filter,setFilter]=useState('All')
 const getCategory=item=>item.category||item.group
 const categories=['All',...new Set(list.map(getCategory))]
 const shown=list.filter(item=>(filter==='All'||getCategory(item)===filter)&&[item.title,item.description,getCategory(item)].join(' ').toLowerCase().includes(query.trim().toLowerCase()))
 return <div className="directory"><label className="search"><Search size={18}/><input type="search" value={query} placeholder={resource?'Search immigration resources':'Search visa categories'} aria-label={resource?'Search immigration resources':'Search visa categories'} onChange={e=>setQuery(e.target.value)}/></label>
 <div className="filters" aria-label="Filter categories">{categories.map(category=><button key={category} type="button" aria-pressed={filter===category} onClick={()=>setFilter(category)}>{category}</button>)}</div>
 <p className="sr-only" role="status">{shown.length} results</p>
 {shown.length===0?<p>No results. Try a different search or filter.</p>:resource?<div className="resource-grid">{shown.map(r=><ArticleCard key={r.slug} item={r}/>)}</div>:<div className="visa-grid">{shown.map(s=><Link key={s.slug} to={s.path}><span><small>{s.group}</small><strong>{s.title}</strong></span><ArrowUpRight size={19}/></Link>)}</div>}</div>
}
export function ArticleCard({item}){return <article className="article-card"><div className="media"><Photo name={item.image}/></div><small>{item.category} · <time dateTime="2026-11-27">Nov 27, 2026</time></small><h3><Link to={'/resources/'+item.slug}>{item.title}</Link></h3><Link className="text-link" to={'/resources/'+item.slug}>Read the guide <ArrowUpRight size={15}/></Link></article>}
