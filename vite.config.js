import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

const dist = fileURLToPath(new URL('./dist/', import.meta.url))
const prerenderPreview = {
 name: 'visapro-prerender-preview',
 configurePreviewServer(server) {
  server.middlewares.use((request, response, next) => {
   const path = new URL(request.url, 'http://localhost').pathname
   if (request.method !== 'GET' && request.method !== 'HEAD') return next()
   if (!/^\/[a-zA-Z0-9/-]*$/.test(path)) return next()
   const file = resolve(dist, '.' + path, 'index.html')
   const found = existsSync(file)
   response.statusCode = found ? 200 : 404
   response.setHeader('Content-Type', 'text/html; charset=utf-8')
   response.end(request.method === 'HEAD' ? undefined : readFileSync(found ? file : join(dist, '404.html')))
  })
 }
}
export default defineConfig({ plugins: [react(), tailwind(), prerenderPreview] })