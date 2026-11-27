import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { Frame } from './components/Layout'
import { pages, resources, services } from './data'

export default function App({views}){
 const {HomePage,DetailPage,ServicePage,ResourcePage,NotFound}=views
 return <MotionConfig reducedMotion="user"><Frame><Suspense fallback={<p className="wrap route-loading" role="status">Loading page…</p>}><Routes>
 <Route path="/" element={<HomePage/>}/>
 {Object.keys(pages).map(path=><Route path={path} key={path} element={<DetailPage key={path} path={path}/>}/>)}
 {services.map(s=><Route path={s.path} key={s.path} element={<ServicePage key={s.path} service={s}/>}/>)}
 {resources.map(item=><Route path={'/resources/'+item.slug} key={item.slug} element={<ResourcePage item={item}/>}/>)}
 <Route path="*" element={<NotFound/>}/>
 </Routes></Suspense></Frame></MotionConfig>
}
