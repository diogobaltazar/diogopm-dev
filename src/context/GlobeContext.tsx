import { createContext, useContext, useRef, useState, useCallback, useMemo, type ReactNode } from 'react'

interface GlobeState {
  activeArc: string | null
  activeLocation: string | null
  activeType: 'industry' | 'education' | null
}

interface GlobeCtxValue extends GlobeState {
  onCityClick: (key: string) => void
  _setOnCityClick: (fn: (key: string) => void) => void
  _setGlobeState: (state: GlobeState) => void
}

const Ctx = createContext<GlobeCtxValue>({
  activeArc: null, activeLocation: null, activeType: null,
  onCityClick: () => {}, _setOnCityClick: () => {}, _setGlobeState: () => {},
})

export function GlobeProvider({ children }: { children: ReactNode }) {
  const [state, setGlobeState] = useState<GlobeState>({ activeArc: null, activeLocation: null, activeType: null })
  const cityClickRef = useRef<(key: string) => void>(() => {})

  const onCityClick       = useCallback((key: string) => cityClickRef.current(key), [])
  const _setOnCityClick   = useCallback((fn: (key: string) => void) => { cityClickRef.current = fn }, [])
  const _setGlobeState    = useCallback((s: GlobeState) => setGlobeState(s), [])

  const value = useMemo(
    () => ({ ...state, onCityClick, _setOnCityClick, _setGlobeState }),
    [state, onCityClick, _setOnCityClick, _setGlobeState],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useGlobeCtx = () => useContext(Ctx)
