import { pages, services, resources } from './data'
const base=(import.meta.env.VITE_SITE_URL||'https://www.visapro.com').replace(/\/$/,'')
export const routes=['/',...Object.keys(pages),...services.map(s=>s.path),...resources.map(r=>'/resources/'+r.slug)]
export const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))
export function metadata(path){
 const service=services.find(s=>s.path===path)
 const article=resources.find(r=>'/resources/'+r.slug===path)
 const [name,description]=pages[path]||(service?[service.title,service.description]:article?[article.title,article.description]:path==='/'?['U.S. Immigration Services','Explore U.S. immigration services, visa options and consultations for individuals, families and businesses.']:['Page not found','Browse VisaPro’s U.S. immigration services.'])
 const title=path==='/'?'VisaPro | U.S. Immigration Services':name+' | VisaPro'
 const url=base+(path==='/'?'/':path)
 const known=routes.includes(path)
 const organization={'@type':['Organization','LegalService'],'@id':base+'/#organization',name:'VisaPro',url:base+'/',logo:base+'/logo.jpeg',telephone:'+1-202-787-1944',address:{'@type':'PostalAddress',streetAddress:'1120 Connecticut Avenue NW, Suite 425',addressLocality:'Washington',addressRegion:'DC',postalCode:'20036',addressCountry:'US'}}
 const graph=[organization]
 if(known&&path!=='/'){
  const ancestors=service?[['Immigration Services','/services']]:article?[['Immigration Insights','/resources']]:path==='/experts/ravneet-brar'?[['Our Immigration Experts','/experts']]:[]
  graph.push({'@type':'BreadcrumbList',itemListElement:[['Home','/'],...ancestors,[name,path]].map(([label,p],i)=>({'@type':'ListItem',position:i+1,name:label,item:base+p}))})
 }
 if(article)graph.push({'@type':'Article',headline:name,description,mainEntityOfPage:url,datePublished:'2026-11-27',publisher:{'@id':organization['@id']}})
 return {title,description,url,known,article,graph}
}
export function renderHead(path){
 const {title,description,url,known,article,graph}=metadata(path)
 const verification=import.meta.env.VITE_SEARCH_CONSOLE_VERIFICATION
 return '<title>'+escapeHtml(title)+'</title><meta name="description" content="'+escapeHtml(description)+'">'+(known?'<link rel="canonical" href="'+escapeHtml(url)+'">':'<meta name="robots" content="noindex">')+'<meta property="og:type" content="'+(article?'article':'website')+'"><meta property="og:title" content="'+escapeHtml(title)+'"><meta property="og:description" content="'+escapeHtml(description)+'"><meta property="og:url" content="'+escapeHtml(url)+'"><meta property="og:site_name" content="VisaPro"><meta property="og:image" content="'+escapeHtml(base+'/images/'+(article?.image||'city')+'.webp')+'">'+(verification?'<meta name="google-site-verification" content="'+escapeHtml(verification)+'">':'')+'<script id="structured-data" type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')+'</script>'
}
