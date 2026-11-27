import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ChevronDown, Globe2, Menu, X } from 'lucide-react'
import { services, groups } from '../data'
import { LeadForm, track } from './Forms'

export const navigation = [['Home','/'],['Immigration Services','/services'],['For Businesses','/businesses'],['For Individuals','/individuals'],['Resources','/resources'],['About Us','/about'],['Contact','/contact']]
export const contact = 'https://www.visapro.com/contact-us/'
export const phone = '+1 202-787-1944'
export const phoneLink = 'tel:+12027871944'
export const portal = 'https://www.visapro.com/login/'
export function Brand(){
 return <Link to="/" className="brand" aria-label="VisaPro Immigration Attorneys home">
  <img src="/logo.jpeg" alt="VisaPro Immigration Attorneys" width={159} height={58}/>
 </Link>
}
export function Button({to='/consultation',children='Book a Consultation',type='gold',onClick}){return <Link className={'button '+type} to={to} onClick={()=>{track('cta_click',{destination:to});onClick?.()}}>{children}</Link>}
export function Header(){
 const [mobile,setMobile]=useState(false), [mega,setMega]=useState(false)
 const {pathname}=useLocation()
 useEffect(()=>{setMobile(false);setMega(false)},[pathname])
 return <header className="site-header" onKeyDown={e=>{if(e.key==='Escape'){setMega(false);setMobile(false)}}}>
  <div className="utility"><div className="wrap"><a href={phoneLink}><Globe2 size={14}/> {phone}</a><div><a href={portal}>Client Portal</a><Link to="/resources">Immigration Updates</Link></div></div></div>
  <div className="nav-shell"><div className="wrap nav-inner"><Brand/>
  <button className="menu-toggle" aria-label={mobile?'Close navigation':'Open navigation'} aria-expanded={mobile} aria-controls="main-navigation" onClick={()=>setMobile(!mobile)}>{mobile?<X/>:<Menu/>}</button>
  <nav id="main-navigation" className={mobile?'navigation open':'navigation'} aria-label="Main navigation">
   {navigation.map(([label,path])=><div key={path} className="nav-item"><NavLink to={path} end={path==='/'} onClick={()=>{setMobile(false);setMega(false)}}>{label}</NavLink>{path==='/services'&&<button className="mega-toggle" aria-label="Toggle immigration service categories" aria-expanded={mega} aria-controls="service-menu" onClick={()=>setMega(!mega)}><ChevronDown size={14}/></button>}</div>)}
   <Button onClick={()=>{setMega(false);setMobile(false)}}/>
  <AnimatePresence>{mega&&<motion.div id="service-menu" className="mega" initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}><div className="wrap mega-inner">{[...new Set(groups.map(g=>g[0]))].map(group=><div key={group}><strong>{group}</strong>{services.filter(s=>s.group===group).map(s=><Link key={s.slug} to={s.path} onClick={()=>{setMega(false);setMobile(false)}}>{s.title}</Link>)}</div>)}</div></motion.div>}</AnimatePresence></nav></div></div>
 </header>
}
export function Footer(){return <footer className="footer"><div className="wrap footer-grid"><div><Brand/><p>U.S. immigration services for individuals, families and businesses.</p><a href={phoneLink}>{phone}</a><a href="mailto:cs@visapro.com">cs@visapro.com</a><a href="https://www.linkedin.com/company/visapro-immigration-services-llc">LinkedIn <ArrowUpRight size={14}/></a><a href="https://www.youtube.com/user/visapro">YouTube <ArrowUpRight size={14}/></a></div>
 <div><h3>Services</h3><Link to="/services">All immigration services</Link><Link to="/businesses">For businesses</Link><Link to="/individuals">For individuals</Link><Link to="/assessment">Visa assessment</Link></div>
 <div><h3>VisaPro</h3><Link to="/about">About us</Link><Link to="/experts">Our experts</Link><Link to="/success-stories">Client success stories</Link><Link to="/resources">Immigration insights</Link></div>
 <div><h3>Immigration updates</h3><LeadForm newsletter/></div></div>
 <div className="wrap footer-bottom"><span>© VisaPro. All rights reserved.</span><div><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms &amp; Conditions</Link><Link to="/disclaimer">Legal Disclaimer</Link><Link to="/disclaimer">Attorney Advertising</Link></div></div></footer>}
export function Frame({children}){const {pathname}=useLocation();useEffect(()=>{window.scrollTo(0,0)},[pathname]);return <><a className="skip" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/>{pathname!=='/consultation'&&<div className="mobile-cta"><Button/></div>}</>}
