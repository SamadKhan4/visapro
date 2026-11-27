import { lazy, useEffect } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import App from './App'
import { renderHead, routes } from './seo'
import './index.css'

function setupAnalytics(){
 const ga=import.meta.env.VITE_GA_ID
 const gtm=import.meta.env.VITE_GTM_ID
 if(!ga&&!gtm)return
 window.dataLayer=window.dataLayer||[]
 function addScript(url){const script=document.createElement('script');script.async=true;script.src=url;document.head.append(script)}
 if(/^G-[A-Z0-9]+$/.test(ga||'')){
  window.gtag=function(){window.dataLayer.push(arguments)}
  window.gtag('js',new Date())
  window.gtag('config',ga,{send_page_view:false})
  addScript('https://www.googletagmanager.com/gtag/js?id='+ga)
 }
 if(/^GTM-[A-Z0-9]+$/.test(gtm||'')){
  window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'})
  addScript('https://www.googletagmanager.com/gtm.js?id='+gtm)
 }
}
setupAnalytics()

const loadHome=()=>import('./pages/Home')
const loadDetails=()=>import('./pages/Detail')
const lazyViews={
 HomePage:lazy(loadHome),
 DetailPage:lazy(loadDetails),
 ServicePage:lazy(()=>loadDetails().then(module=>({default:module.ServicePage}))),
 ResourcePage:lazy(()=>loadDetails().then(module=>({default:module.ResourcePage}))),
 NotFound:lazy(()=>loadDetails().then(module=>({default:module.NotFound})))
}

async function loadRoute(path){
 if(path==='/') return {...lazyViews,HomePage:(await loadHome()).default}
 const {default:DetailPage,ServicePage,ResourcePage,NotFound}=await loadDetails()
 return {...lazyViews,DetailPage,ServicePage,ResourcePage,NotFound}
}

function Site({views}){
 const {pathname}=useLocation()
 useEffect(()=>{
  document.head.querySelectorAll('title, meta[name="description"], meta[name="robots"], meta[property^="og:"], meta[name="google-site-verification"], link[rel="canonical"], #structured-data').forEach(node=>node.remove())
  document.head.insertAdjacentHTML('beforeend',renderHead(pathname.replace(/\/$/,'')||'/'))
 },[pathname])
 return <App views={views}/>
}
async function start(){
 const container=document.getElementById('root')
 const path=window.location.pathname.replace(/\/$/,'')||'/'
 const views=await loadRoute(path)
 const app=<BrowserRouter><Site views={views}/></BrowserRouter>
 if(container.dataset.page===(routes.includes(path)?path:'/404'))hydrateRoot(container,app)
 else createRoot(container).render(app)
}
start()
