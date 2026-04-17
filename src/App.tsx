import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
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
        <Route path="/" element={<About />} />
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
