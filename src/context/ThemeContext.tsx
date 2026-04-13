import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Theme = 'day' | 'night'

function detectTheme(): Theme {
  const stored = localStorage.getItem('theme') as Theme | null
  if (stored === 'day' || stored === 'night') return stored
  const hour = new Date().getHours()
  return hour >= 7 && hour < 19 ? 'day' : 'night'
}

interface ThemeCtxValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeCtxValue>({ theme: 'night', toggleTheme: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(detectTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(t => (t === 'day' ? 'night' : 'day'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
