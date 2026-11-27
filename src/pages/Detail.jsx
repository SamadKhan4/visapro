import { Link } from 'react-router-dom'
import { Button, contact, phone, phoneLink } from '../components/Layout'
import { Breadcrumb, CTA, Directory, FAQs, Heading, Hero, Photo, Section } from '../components/Content'
import { Assessment, LeadForm } from '../components/Forms'
import { official, pages, services } from '../data'

export function ServicePage({service:s}){
 const related=services.filter(item=>item.slug!==s.slug).sort((a,b)=>Number(b.group===s.group)-Number(a.group===s.group)).slice(0,3)
 const sections=[['Who may qualify',s.eligibility],['Documentation requirements',s.documents],['Application process',s.process],['Benefits and limitations',s.description+' '+s.limitations],['How VisaPro can help','A consultation can help you assess whether this category fits your plans, identify supporting documents and discuss common challenges before you file.']]
 return <><Breadcrumb items={[['Immigration Services','/services'],[s.title]]}/><Hero title={s.title} description={s.description} image={s.image} tag={s.group.toUpperCase()}><Button/></Hero>
 <Section><div className="detail-grid"><article>{sections.map(([title,copy])=><section key={title}><h2>{title}</h2><p>{copy}</p></section>)}<section><h2>Common questions</h2><FAQs items={[[`What evidence should I prepare for ${s.title}?`,s.documents],['What should I check before filing?',s.limitations],['Where can I find official requirements?','Use the government source below to check agency guidance and filing instructions.']]}/></section><p><a className="text-link" href={s.source}>Official government guidance</a></p></article>
 <aside><h2>Discuss your options</h2><p>Get guidance tailored to your plans and circumstances.</p><Button/><Link to="/assessment" className="text-link">Start a visa assessment</Link></aside></div></Section>
 <Section tone="pale"><Heading title="Related immigration services"/><Directory items={related}/></Section><CTA/></>
}
export function ResourcePage({item}){return <><Breadcrumb items={[['Immigration Insights','/resources'],[item.title]]}/><Hero title={item.title} description={item.category} image={item.image} tag="IMMIGRATION INSIGHTS"/><Section><article className="prose"><time dateTime="2026-11-27">November 27, 2026</time><h2>What to check</h2><p>{item.description}</p><a className="text-link" href={item.source}>Read the official government resource</a></article></Section><CTA/></>}
const portrait='/images/ravneet-brar.png'
const stories=[
 ['A multinational manager’s path to permanent residence','VisaPro describes how the company used a transfer and an EB-1C strategy to support its U.S. expansion.','expedited-green-card-approval'],
 ['A Canadian spouse’s adjustment of status','VisaPro describes how the couple pursued adjustment of status during pandemic travel restrictions.','green-card-love-story'],
 ['An employer’s response to an EB-1C case challenge','VisaPro recounts the evidence submitted after an agency site visit and a notice of intent to revoke.','l1-to-eb1c-green-card-for-ceo']
]
function Legal({path}){
 const content={
  '/privacy':[['Consultation and newsletter information','The forms ask for contact details and, for a consultation, general immigration goals. In demo mode the site sends no form submissions. Avoid including immigration document numbers or other sensitive records.'],['Analytics','If enabled, analytics receive interaction events such as a consultation button click or assessment completion. Form fields and assessment answers are excluded.']],
  '/terms':[['Use of this website','You can use these materials to learn about U.S. immigration pathways and prepare questions for a consultation. Read the official VisaPro terms before using its live services.']],
  '/disclaimer':[['General information','This site provides general immigration information. It does not provide legal advice or establish an attorney-client relationship. Laws, agency policies and processing practices can change.'],['Case outcomes','Prior results do not guarantee a similar outcome. Consult an immigration attorney about your specific circumstances.'],['Attorney advertising','This website may be considered attorney advertising in some jurisdictions.']]
 }
 return <article className="prose">{content[path].map(([title,copy])=><section key={title}><h2>{title}</h2><p>{copy}</p></section>)}{path!=='/disclaimer'&&<a className="text-link" href={path==='/privacy'?official.privacy:official.terms}>Read VisaPro’s official {path==='/privacy'?'Privacy Policy':'Terms of Use'}</a>}</article>
}
export default function Detail({path}){
 const [title,description]=pages[path]
 const business=path==='/businesses'
 const images={'/about':'work','/businesses':'meeting','/individuals':'family','/experts':'people','/success-stories':'visit','/resources':'desk','/services':'city'}
 let body
 switch(path){
 case '/services':body=<Directory/>;break
 case '/resources':body=<Directory kind="resources"/>;break
 case '/assessment':body=<Assessment/>;break
 case '/consultation':body=<div className="detail-grid"><LeadForm/><aside><h2>What to expect</h2><p>Share your goals and preferred date. A live request is subject to availability and confirmation.</p><a className="text-link" href={official.consultation}>Visit VisaPro’s official booking page</a></aside></div>;break
 case '/businesses':
 case '/individuals':body=<><Heading title={business?'Plan for your U.S. workforce':'Find a pathway that fits your plans'} description={business?'Coordinate sponsorship, transfers and expansion with your hiring and operating plans.':'Explore options based on your qualifications, relationships and intended stay.'}/><Directory items={services.filter(s=>!business||['Work Visas','Business Immigration','Green Cards'].includes(s.group))}/></>;break
 case '/about':body=<div className="split"><div className="media"><Photo name="people"/></div><div><Heading title="Immigration planning shaped by your circumstances" description="VisaPro helps individuals and organizations understand U.S. immigration options, prepare documentation and navigate case milestones. Start with your priorities, whether that means hiring someone, joining family or planning a move."/><Link className="text-link" to="/experts">Meet the immigration team</Link><p><a className="text-link" href={official.about}>Visit VisaPro’s official company profile</a></p></div></div>;break
 case '/experts':body=<div className="expert-card"><img className="expert-photo" src={portrait} alt="Ravneet Brar" loading="lazy"/><p className="eyebrow">IMMIGRATION ATTORNEY</p><h2>Ravneet Brar</h2><p>Corporate immigration, global mobility and cross-border expansion.</p><Button to="/experts/ravneet-brar" type="line">View Profile</Button><p><a className="text-link" href={official.experts}>See the official attorney directory</a></p></div>;break
 case '/experts/ravneet-brar':body=<article className="prose"><img className="expert-photo" src={portrait} alt="Ravneet Brar" loading="lazy"/><h2>Areas of practice</h2><p>VisaPro’s biography lists licenses in the United States, Canada and India. Her practice includes corporate immigration, global mobility and cross-border expansion.</p><p>Her work covers intracompany transfers, employment-based green cards, treaty investment and family-based sponsorship.</p><a className="text-link" href={official.profile}>Read the official VisaPro biography</a></article>;break
 case '/success-stories':body=<><div className="story-grid">{stories.map(([heading,summary,slug])=><article key={slug}><h2>{heading}</h2><p>{summary}</p><a className="text-link" href={official.stories+slug+'/'}>Read VisaPro’s published case study</a></article>)}</div><p>Case outcomes depend on the individual facts and circumstances.</p></>;break
 case '/contact':body=<div className="detail-grid"><LeadForm/><aside><h2>Contact VisaPro</h2><address>1120 Connecticut Avenue NW<br/>Suite 425<br/>Washington, DC 20036</address><a className="text-link" href={phoneLink}>{phone}</a><a className="text-link" href="mailto:cs@visapro.com">cs@visapro.com</a><a className="text-link" href={contact}>Official contact page</a><a className="text-link" href={official.consultation}>Official consultation booking</a></aside></div>;break
 default:body=<Legal path={path}/>
 }
 return <><Breadcrumb items={path==='/experts/ravneet-brar'?[['Our Immigration Experts','/experts'],[title]]:[[title]]}/><Hero title={title} description={description} image={images[path]}/><Section>{body}</Section>{!['/consultation','/contact','/privacy','/terms','/disclaimer'].includes(path)&&<CTA/>}</>
}
export function NotFound(){return <><Hero title="Page not found" description="The page you requested may have moved. Explore the service directory or return to the homepage." tag="404"/><Section><div className="button-row"><Button to="/">Return home</Button><Button to="/services" type="line">Browse immigration services</Button></div></Section></>}
