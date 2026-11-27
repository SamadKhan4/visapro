import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Detail, {NotFound, ResourcePage, ServicePage} from './pages/Detail'
export { routes, renderHead, metadata, escapeHtml } from './seo'
const views={HomePage:Home,DetailPage:Detail,NotFound,ResourcePage,ServicePage}
export const render=path=>renderToString(<StaticRouter location={path}><App views={views}/></StaticRouter>)
