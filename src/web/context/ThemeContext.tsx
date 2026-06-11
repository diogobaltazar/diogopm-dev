import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Theme = 'day' | 'night'

function detectTheme(): Theme {
  const stored = localStorage.getItem('theme') as Theme | null
  if (stored === 'day' || stored === 'night') return stored
  return 'night'
}

interface ThemeCtxValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeCtxValue>({ theme: 'night', setTheme: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(detectTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
