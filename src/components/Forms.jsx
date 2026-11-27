import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { official, services } from '../data'

export function track(name,properties={}) {
 if(typeof window==='undefined') return
 if(window.gtag) window.gtag('event',name,properties)
 else if(import.meta.env.VITE_GTM_ID) window.dataLayer?.push({event:name,...properties})
}
async function submitLead(kind,payload) {
 const base=import.meta.env.VITE_LEAD_API_URL
 if(!base) return false
 const response=await fetch(base.replace(/\/$/,'')+'/'+kind,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
 if(!response.ok) throw new Error('Request failed')
 return true
}
export function LeadForm({newsletter=false}){
 const [status,setStatus]=useState('')
 const [today,setToday]=useState()
 useEffect(()=>{
  if(newsletter)return
  const date=new Date()
  date.setMinutes(date.getMinutes()-date.getTimezoneOffset())
  setToday(date.toISOString().slice(0,10))
 },[newsletter])
 const live=Boolean(import.meta.env.VITE_LEAD_API_URL)
 async function submit(event){
  event.preventDefault()
  const fields=Object.fromEntries(new FormData(event.currentTarget))
  setStatus('pending')
  try{
   const sent=await submitLead(newsletter?'newsletter':'consultation',fields)
   setStatus(sent?'success':'demo')
   if(sent) track(newsletter?'newsletter_signup':'consultation_submitted')
  }catch{setStatus('error')}
 }
 return <form className={newsletter?'newsletter':'lead-form'} onSubmit={submit}>
 {!live&&<p className="form-note">Demo mode. This form sends no information.</p>}
 {!newsletter&&<label>Full name<input name="name" autoComplete="name" required/></label>}
 <label>Email address<input name="email" type="email" autoComplete="email" required placeholder={newsletter?'you@example.com':undefined}/></label>
 {!newsletter&&<>
 <label>Phone number with country code<input type="tel" name="phone" autoComplete="tel" pattern="[+]?[0-9][0-9 \(\)\-]{6,24}" title="Enter an international phone number with country code" required/></label>
 <label>Country of residence<input name="country" autoComplete="country-name" required/></label>
 <label>Immigration service<select name="service" defaultValue="" required><option value="" disabled>Select a service</option>{services.map(s=><option key={s.slug} value={s.slug}>{s.title}</option>)}<option value="unsure">I’m exploring my options</option></select></label>
 <label>Preferred consultation date <span>(optional)</span><input type="date" name="preferredDate" min={today}/></label>
 <label className="wide">Message<textarea name="message" rows="4" maxLength="2000" required placeholder="Give a brief overview of your goals. Leave out document numbers and other sensitive details."/></label>
 </>}
 <label className="consent wide"><input type="checkbox" name="consent" required/><span>I agree to the <Link to="/privacy">Privacy Policy</Link>{newsletter?' and consent to email updates.':'.'}</span></label>
 <button className="button gold" disabled={status==='pending'||status==='success'}>{status==='pending'?'Submitting…':newsletter?'Subscribe':live?'Request consultation':'Preview consultation request'}</button>
 <div role="status" className="wide form-status">{status==='demo'?(newsletter?'Demo complete. No subscription was created.':<>Demo complete. <a href={official.consultation}>Book through VisaPro’s official site.</a></>):status==='success'?(newsletter?'You’re subscribed.':'Your request was received. VisaPro can follow up to confirm availability.'):status==='error'?'The request failed. Please try again.':''}</div>
 </form>
}
const steps=[
 ['What is your primary purpose?',['Work in the U.S.','Join family','Invest or expand a business','Visit temporarily','Seek permanent residence','Explore options']],
 ['Where do you currently live?',null],
 ['Which best describes your background?',['Bachelor’s degree or equivalent','Advanced degree','Internationally recognized achievements','Senior management or executive experience','Other experience']],
 ['What is your employment or sponsorship status?',['U.S. job offer','Transfer from a related overseas company','Planning my own business','No employer sponsor','Unsure']],
 ['Do you have a U.S. family connection?',['U.S. citizen fiancé','U.S. citizen spouse or relative','Permanent resident spouse or relative','None or unsure']],
 ['What is your immigration goal?',['Temporary stay','Permanent residence','Compare both possibilities']]
]
function pathways(answers){
 const [purpose,,background,sponsor,family,goal]=answers
 const picks=new Set()
 if(family==='U.S. citizen fiancé') picks.add('k-1-fiance-visa')
 if(family.includes('relative')||purpose==='Join family') picks.add('family-immigration')
 if(purpose==='Visit temporarily') picks.add('b1-b2-visitor-visa')
 if(purpose==='Invest or expand a business'||sponsor==='Planning my own business'){picks.add('e-2-investor-visa');picks.add('business-immigration')}
 if(sponsor==='Transfer from a related overseas company') picks.add('l-1-visa')
 if(sponsor==='U.S. job offer'||purpose==='Work in the U.S.') picks.add('h-1b-visa')
 if(background.includes('recognized')) {picks.add('o-1-visa');if(goal!=='Temporary stay') picks.add('eb-1-green-card')}
 if(goal!=='Temporary stay'&&(purpose==='Seek permanent residence'||background==='Advanced degree')) {picks.add('green-cards');if(background==='Advanced degree') picks.add('eb-2-niw')}
 return [...picks].map(slug=>services.find(s=>s.slug===slug))
}
export function Assessment(){
 const [step,setStep]=useState(0),[answers,setAnswers]=useState(steps.map(()=>''))
 const done=step===steps.length
 const matches=done?pathways(answers):[]
 function advance(e){e.preventDefault();if(!answers[step].trim())return;if(step===steps.length-1)track('assessment_completed');setStep(step+1)}
 return <div className="assessment-form">{done?<><h2>Pathways to discuss</h2>{matches.length?<ul className="route-list">{matches.map(s=><li key={s.slug}><Link to={s.path}>{s.title}</Link><p>{s.description}</p></li>)}</ul>:<p>A consultation can help narrow your options based on your circumstances.</p>}<p className="form-note">These suggestions are informational and do not constitute legal advice or an eligibility determination. Your answers are not transmitted.</p><Link className="button gold" to="/consultation">Book a Consultation</Link> <button className="button line" onClick={()=>{setAnswers(steps.map(()=>''));setStep(0)}}>Start again</button></>:<form onSubmit={advance}>
 <p className="eyebrow">STEP {step+1} OF {steps.length}</p><progress aria-label="Assessment progress" value={step+1} max={steps.length}/>
 <fieldset key={step}><legend>{steps[step][0]}</legend>
 {steps[step][1]?steps[step][1].map(option=><label className="choice" key={option}><input type="radio" name="answer" value={option} checked={answers[step]===option} required onChange={e=>setAnswers(answers.map((a,i)=>i===step?e.target.value:a))}/>{option}</label>):<label>Country of residence<input required maxLength="100" value={answers[step]} onChange={e=>{e.target.setCustomValidity(e.target.value.trim()||!e.target.value?'':'Enter your country of residence.');setAnswers(answers.map((a,i)=>i===step?e.target.value:a))}}/></label>}</fieldset>
 <div className="button-row">{step>0&&<button type="button" className="button line" onClick={()=>setStep(step-1)}>Previous</button>}<button className="button gold">{step===steps.length-1?'See pathways':'Next'}</button></div>
 </form>}</div>
}
