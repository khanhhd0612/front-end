import { BrowserRouter as Router, useRoutes } from 'react-router-dom'
import routes from './routes'
import './assets/css/app.css'
import 'nprogress/nprogress.css'
import 'font-awesome/css/font-awesome.min.css'
import '@mdi/font/css/materialdesignicons.min.css'


function AppRoutes() {
  const element = useRoutes(routes)
  return element
}
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App
