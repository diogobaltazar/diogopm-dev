import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import About from './pages/About'
import Blog from './pages/Blog'
import Post from './pages/Post'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Post />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
