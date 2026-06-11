import { createContext, useContext, useRef, useState, useCallback, useMemo, type ReactNode } from 'react'

interface GlobeState {
  activeArc: string | null
  activeLocation: string | null
  activeType: 'industry' | 'education' | null
}

export interface CityClickAnchor {
  x: number
  y: number
}

interface GlobeCtxValue extends GlobeState {
  onCityClick: (key: string, anchor?: CityClickAnchor) => void
  _setOnCityClick: (fn: (key: string, anchor?: CityClickAnchor) => void) => void
  _setGlobeState: (state: GlobeState) => void
}

const Ctx = createContext<GlobeCtxValue>({
  activeArc: null, activeLocation: null, activeType: null,
  onCityClick: () => {}, _setOnCityClick: () => {}, _setGlobeState: () => {},
})

export function GlobeProvider({ children }: { children: ReactNode }) {
  const [state, setGlobeState] = useState<GlobeState>({ activeArc: null, activeLocation: null, activeType: null })
  const cityClickRef = useRef<(key: string, anchor?: CityClickAnchor) => void>(() => {})

  const onCityClick       = useCallback((key: string, anchor?: CityClickAnchor) => cityClickRef.current(key, anchor), [])
  const _setOnCityClick   = useCallback((fn: (key: string, anchor?: CityClickAnchor) => void) => { cityClickRef.current = fn }, [])
  const _setGlobeState    = useCallback((s: GlobeState) => setGlobeState(s), [])

  const value = useMemo(
    () => ({ ...state, onCityClick, _setOnCityClick, _setGlobeState }),
    [state, onCityClick, _setOnCityClick, _setGlobeState],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useGlobeCtx = () => useContext(Ctx)
