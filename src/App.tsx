import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import About from './pages/About'
import Blog from './pages/Blog'
import Post from './pages/Post'
import { GlobeProvider } from './context/GlobeContext'
import { ThemeProvider } from './context/ThemeContext'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/cv" element={<About />} />
        <Route path="/about" element={<Navigate to="/cv" replace />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Post />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <GlobeProvider>
          <Layout>
            <AnimatedRoutes />
          </Layout>
        </GlobeProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
