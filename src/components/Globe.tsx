/**
 * Orthographic SVG globe
 * – d3-geo projection with world-atlas country outlines
 * – Auto-rotates very slowly; drag to spin; click city dots to scroll timeline
 * – Only shows borders for worked-in countries (PT, FR, DK, UK)
 * – Halo rim (pure glow, no solid line)
 * – Falls back to static when prefers-reduced-motion or low-end CPU
 */

import { useState, useEffect, useRef, useMemo } from 'react'
import { geoOrthographic, geoPath, geoInterpolate } from 'd3-geo'
import { feature } from 'topojson-client'
import type { GeoPermissibleObjects } from 'd3-geo'
import worldData from 'world-atlas/countries-110m.json'

// ─── world geometry (computed once at module load) ────────────────────────────

const land = feature(worldData, worldData.objects.land)

// Only outlines for countries where Diogo has worked: DK, FR, PT, UK
const WORKED_IN_CODES = new Set(['208', '250', '620', '826'])
const workedInFeatures = feature(worldData, {
  type: 'GeometryCollection' as const,
  geometries: (worldData.objects.countries.geometries as any[]).filter(
    g => WORKED_IN_CODES.has(String(g.id))
  ),
} as any)

// ─── constants ────────────────────────────────────────────────────────────────

const CX = 250
const CY = 250
const R  = 210

// d3-geo rotation: [-lon, -lat, 0] — centred on Europe (~1°E, 47°N)
const INITIAL: [number, number, number] = [-1, -47, 0]

const CITIES: Record<string, { coords: [number, number]; label: string; anchor: 'start' | 'end' }> = {
  lisbon:     { coords: [-9.1,  38.7], label: 'Lisbon',     anchor: 'end'   },
  toulouse:   { coords: [1.4,   43.6], label: 'Toulouse',   anchor: 'end'   },
  copenhagen: { coords: [12.6,  55.7], label: 'Copenhagen', anchor: 'start' },
  london:     { coords: [-0.1,  51.5], label: 'London',     anchor: 'end'   },
}

const CAREER_ARCS = [
  { id: 'lisbon-toulouse',     from: 'lisbon',     to: 'toulouse'   },
  { id: 'toulouse-copenhagen', from: 'toulouse',   to: 'copenhagen' },
  { id: 'copenhagen-london',   from: 'copenhagen', to: 'london'     },
]

const EDU_ARCS = [
  { id: 'lisbon-copenhagen-edu', from: 'lisbon', to: 'copenhagen' },
]

// ─── helpers ──────────────────────────────────────────────────────────────────

function gc(from: [number, number], to: [number, number], n = 64) {
  const interp = geoInterpolate(from, to)
  return {
    type: 'LineString' as const,
    coordinates: Array.from({ length: n + 1 }, (_, i) => interp(i / n)),
  }
}

function detectStatic() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  const nav = navigator as Navigator & { hardwareConcurrency?: number }
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2) return true
  return false
}

// ─── component ────────────────────────────────────────────────────────────────

interface GlobeProps {
  activeArc: string | null
  activeLocation: string | null
  onCityClick?: (key: string) => void
}

export default function Globe({ activeArc, activeLocation, onCityClick }: GlobeProps) {
  const staticMode = useMemo(detectStatic, [])

  const [rotation, setRotation] = useState<[number, number, number]>([...INITIAL])
  const rotRef     = useRef<[number, number, number]>([...INITIAL])
  const isDragging = useRef(false)
  const dragStart  = useRef<[number, number]>([0, 0])
  const rotAtDrag  = useRef<[number, number, number]>([...INITIAL])
  const rafId      = useRef<number>()

  // Auto-rotation — very slow
  useEffect(() => {
    if (staticMode) return
    let prev = performance.now()
    const SPEED = 0.003 // degrees per ms

    function tick(now: number) {
      const dt = Math.min(now - prev, 50)
      prev = now
      if (!isDragging.current) {
        rotRef.current[0] -= SPEED * dt
        setRotation([...rotRef.current] as [number, number, number])
      }
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current) }
  }, [staticMode])

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    isDragging.current = true
    dragStart.current  = [e.clientX, e.clientY]
    rotAtDrag.current  = [...rotRef.current] as [number, number, number]
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!isDragging.current) return
    const k  = 0.25
    const dx = e.clientX - dragStart.current[0]
    const dy = e.clientY - dragStart.current[1]
    rotRef.current[0] = rotAtDrag.current[0] + dx * k
    rotRef.current[1] = Math.max(-80, Math.min(80, rotAtDrag.current[1] - dy * k))
    setRotation([...rotRef.current] as [number, number, number])
  }

  function onPointerUp() { isDragging.current = false }

  const { proj, pathGen } = useMemo(() => {
    const p = geoOrthographic()
      .scale(R)
      .translate([CX, CY])
      .rotate(rotation)
      .clipAngle(90)
    return { proj: p, pathGen: geoPath(p) }
  }, [rotation])

  const CYAN   = '#00e5ff'
  const PURPLE = '#cc44ff'
  const DIM    = 0.18
  const cursor = isDragging.current ? 'grabbing' : 'grab'

  return (
    <svg
      viewBox="0 0 500 500"
      style={{ width: '100%', height: '100%', cursor }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="sphere-grad" cx="30%" cy="25%" r="75%">
          <stop offset="0%"   stopColor="#0d2a6e" stopOpacity="0.95" />
          <stop offset="50%"  stopColor="#020b22" stopOpacity="0.98" />
          <stop offset="100%" stopColor="#00040f" stopOpacity="1"    />
        </radialGradient>

        {/* Halo rim — pure diffuse glow, no solid line */}
        <filter id="rim" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="10" />
        </filter>

        <filter id="arc-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        <filter id="dot-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        <clipPath id="clip">
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>
      </defs>

      {/* Sphere base */}
      <circle cx={CX} cy={CY} r={R} fill="url(#sphere-grad)" />

      {/* Clipped globe content */}
      <g clipPath="url(#clip)">
        {/* Land */}
        <path
          d={pathGen(land as GeoPermissibleObjects) ?? ''}
          fill="rgba(8, 22, 58, 0.88)"
        />

        {/* Worked-in country outlines (PT, FR, DK, UK) */}
        <path
          d={pathGen(workedInFeatures as GeoPermissibleObjects) ?? ''}
          fill="none"
          stroke="rgba(0,150,220,0.32)"
          strokeWidth={0.6}
        />

        {/* Career arcs — cyan great circles */}
        {CAREER_ARCS.map(({ id, from, to }) => {
          const active = activeArc === id
          return (
            <path
              key={id}
              d={pathGen(gc(CITIES[from].coords, CITIES[to].coords) as GeoPermissibleObjects) ?? ''}
              fill="none"
              stroke={CYAN}
              strokeWidth={active ? 2 : 0.7}
              strokeOpacity={active ? 1 : DIM}
              strokeLinecap="round"
              filter={active ? 'url(#arc-glow)' : undefined}
              style={{ transition: 'stroke-width 0.5s, stroke-opacity 0.5s' }}
            />
          )
        })}

        {/* Education arc — purple dashed */}
        {EDU_ARCS.map(({ id, from, to }) => {
          const active = activeArc === id
          return (
            <path
              key={id}
              d={pathGen(gc(CITIES[from].coords, CITIES[to].coords) as GeoPermissibleObjects) ?? ''}
              fill="none"
              stroke={PURPLE}
              strokeWidth={active ? 2 : 0.7}
              strokeOpacity={active ? 1 : DIM}
              strokeLinecap="round"
              strokeDasharray={active ? undefined : '5 6'}
              filter={active ? 'url(#arc-glow)' : undefined}
              style={{ transition: 'stroke-width 0.5s, stroke-opacity 0.5s' }}
            />
          )
        })}

        {/* City dots */}
        {Object.entries(CITIES).map(([key, { coords, label, anchor }]) => {
          const pt = proj(coords)
          if (!pt) return null
          const [x, y] = pt
          const isActive = activeLocation === key
          const dx = anchor === 'end' ? -9 : 9

          return (
            <g key={key} onClick={() => onCityClick?.(key)} style={{ cursor: 'pointer' }}>
              {isActive && (
                <circle cx={x} cy={y} r={14} fill="none" stroke={CYAN} strokeWidth={0.7} strokeOpacity={0.45} />
              )}
              <circle
                cx={x} cy={y}
                r={isActive ? 4.5 : 3}
                fill={isActive ? '#ffffff' : 'rgba(180,230,255,0.65)'}
                filter={isActive ? 'url(#dot-glow)' : undefined}
                style={{ transition: 'r 0.4s, fill 0.4s' }}
              />
              <text
                x={x + dx} y={y + 4}
                fontSize={10}
                textAnchor={anchor}
                fill={isActive ? 'rgba(255,255,255,0.95)' : 'rgba(150,210,255,0.38)'}
                fontFamily="var(--font-mono)"
                style={{ userSelect: 'none', pointerEvents: 'none', transition: 'fill 0.4s' }}
              >
                {label}
              </text>
            </g>
          )
        })}
      </g>

      {/* Rim halo — diffuse glow ring, no solid border */}
      <circle
        cx={CX} cy={CY} r={R}
        fill="none"
        stroke="rgba(0,200,255,0.65)"
        strokeWidth={2}
        filter="url(#rim)"
      />

      {/* Legend */}
      <g transform={`translate(${CX - 64}, ${CY + R + 14})`}>
        <line x1={0} y1={0} x2={16} y2={0} stroke={CYAN}   strokeWidth={1.5} />
        <text x={20} y={4} fontSize={8} fill="rgba(150,210,255,0.35)" fontFamily="var(--font-mono)">career</text>
        <line x1={72} y1={0} x2={88} y2={0} stroke={PURPLE} strokeWidth={1.5} strokeDasharray="5 6" />
        <text x={92} y={4} fontSize={8} fill="rgba(150,210,255,0.35)" fontFamily="var(--font-mono)">education</text>
      </g>
    </svg>
  )
}
