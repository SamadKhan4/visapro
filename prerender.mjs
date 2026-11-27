import {mkdir,readFile,writeFile} from 'node:fs/promises'
import {dirname,join} from 'node:path'
import {render,renderHead,routes,metadata,escapeHtml} from './.ssr/entry-server.js'

const template=await readFile('dist/index.html','utf8')
for(const path of [...routes,'/404']){
 const output=path==='/404'?'dist/404.html':join('dist',path.slice(1),'index.html')
 await mkdir(dirname(output),{recursive:true})
 await writeFile(output,template.replace(/<!--page-head--><title>.*?<\/title>/,()=>renderHead(path))
  .replace('<div id="root">','<div id="root" data-page="'+escapeHtml(path)+'">')
  .replace('<!--page-body-->',()=>render(path)))
}
const sitemap=routes.map(path=>'<url><loc>'+escapeHtml(metadata(path).url)+'</loc></url>').join('')
await writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+sitemap+'</urlset>')
await writeFile('dist/robots.txt','User-agent: *\nAllow: /\nSitemap: '+metadata('/').url+'sitemap.xml\n')
console.log('Prerendered '+routes.length+' public routes and a custom 404.')
