/**
 * Orthographic SVG globe
 * – Flat black aesthetic — no 3D sphere gradient
 * – Arcs elevated above sphere surface (flight-path style)
 * – Very slow auto-rotation; drag to spin
 * – Worked-in country outlines only (PT, FR, DK, UK)
 * – Halo rim (pure glow, no solid line)
 * – Pulse animation on active city dot
 */

import { useState, useEffect, useRef, useMemo, type PointerEvent } from 'react'
import { geoOrthographic, geoPath, geoInterpolate } from 'd3-geo'
import { feature } from 'topojson-client'
import type { GeoPermissibleObjects, GeoProjection } from 'd3-geo'
import worldData from 'world-atlas/countries-110m.json'
import { useTheme } from '../context/ThemeContext'

// ─── world geometry ───────────────────────────────────────────────────────────

const land = feature(worldData, worldData.objects.land)

const WORKED_IN_CODES = new Set(['208', '250', '620', '826']) // DK, FR, PT, UK
const workedInFeatures = feature(worldData, {
  type: 'GeometryCollection' as const,
  geometries: (worldData.objects.countries.geometries as any[]).filter(
    g => WORKED_IN_CODES.has(String(g.id))
  ),
} as any)

// ─── constants ────────────────────────────────────────────────────────────────

const CX = 250
const CY = 250
const R  = 280

// Centre on Europe (~1°E, 47°N)
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

/** Bezier arc elevated above the sphere surface — flight-path style */
function elevatedArcPath(
  from: [number, number],
  to: [number, number],
  project: GeoProjection,
  elevation = 50,
): string | null {
  const p1 = project(from)
  const p2 = project(to)
  if (!p1 || !p2) return null

  // Great-circle midpoint, fall back to screen midpoint if behind sphere
  const mid  = geoInterpolate(from, to)(0.5)
  const pm0  = project(mid as [number, number])
  const pm: [number, number] = pm0 ?? [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2]

  // Push midpoint outward from sphere centre to simulate elevation
  const dx = pm[0] - CX
  const dy = pm[1] - CY
  const d  = Math.hypot(dx, dy)
  if (d < 1) return `M ${p1[0]},${p1[1]} L ${p2[0]},${p2[1]}`

  const scale = (d + elevation) / d
  const ex = CX + dx * scale
  const ey = CY + dy * scale

  return `M ${p1[0]},${p1[1]} Q ${ex},${ey} ${p2[0]},${p2[1]}`
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
  mode?: 'globe' | 'orb' | 'hero'
  activeArc: string | null
  activeLocation: string | null
  activeType: 'industry' | 'education' | null
  onCityClick?: (key: string, anchor?: { x: number; y: number }) => void
}

export default function Globe({ mode = 'globe', activeArc, activeLocation, activeType, onCityClick }: GlobeProps) {
  const isOrb = mode === 'orb'
  const isHero = mode === 'hero'
  const staticMode = useMemo(detectStatic, [])
  const { theme } = useTheme()
  const isDay = theme === 'day'

  // Keep the animation loop reading the latest mode without needing to recreate it.
  const modeRef = useRef(mode)
  useEffect(() => { modeRef.current = mode }, [mode])

  const [rotation, setRotation] = useState<[number, number, number]>([...INITIAL])
  const rotRef     = useRef<[number, number, number]>([...INITIAL])
  const isDragging = useRef(false)
  const dragStart  = useRef<[number, number]>([0, 0])
  const rotAtDrag  = useRef<[number, number, number]>([...INITIAL])
  const rafId      = useRef<number>()
  const flyAnim = useRef<{ from: [number, number]; to: [number, number]; t0: number } | null>(null)

  // When a city becomes active, start a timed ease-out fly-to
  useEffect(() => {
    if (!activeLocation) return
    const city = CITIES[activeLocation]
    if (!city) return

    // Normalise current longitude into [-180, 180] for shortest-arc math
    let cur0 = rotRef.current[0] % 360
    if (cur0 > 180)  cur0 -= 360
    if (cur0 < -180) cur0 += 360
    rotRef.current[0] = cur0

    // Target rotation that centres the city on screen
    let tLon = -city.coords[0]
    let tLat = -city.coords[1]

    // Pick the shortest longitudinal path
    let dLon = tLon - cur0
    if (dLon > 180)  tLon -= 360
    if (dLon < -180) tLon += 360

    flyAnim.current = {
      from: [cur0, rotRef.current[1]],
      to:   [tLon, tLat],
      t0:   performance.now(),
    }
  }, [activeLocation])

  useEffect(() => {
    if (staticMode) return
    let prev = performance.now()
    const SPEED    = 0.001
    const DURATION = 1700 // ms — full fly-to duration

    function easeInOutCubic(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    function tick(now: number) {
      const dt = Math.min(now - prev, 50)
      prev = now

      if (!isDragging.current && modeRef.current === 'globe') {
        if (flyAnim.current) {
          const { from, to, t0 } = flyAnim.current
          const t = Math.min((now - t0) / DURATION, 1)
          const e = easeInOutCubic(t)
          rotRef.current[0] = from[0] + (to[0] - from[0]) * e
          rotRef.current[1] = from[1] + (to[1] - from[1]) * e
          if (t >= 1) flyAnim.current = null
        } else {
          rotRef.current[0] -= SPEED * dt
        }
        setRotation([...rotRef.current] as [number, number, number])
      }
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current) }
  }, [staticMode])

  function onPointerDown(e: PointerEvent<SVGSVGElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    isDragging.current = true
    dragStart.current  = [e.clientX, e.clientY]
    rotAtDrag.current  = [...rotRef.current] as [number, number, number]
  }

  function onPointerMove(e: PointerEvent<SVGSVGElement>) {
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

  const CYAN   = isDay ? '#17786f' : '#4ad7c0'
  const PURPLE = isDay ? '#6a56d7' : '#b196ff'
  const DIM    = isDay ? 0.25 : 0.20
  const cursor = isOrb || isHero ? 'default' : isDragging.current ? 'grabbing' : 'grab'
  const haloColor = isOrb
    ? (isDay ? 'rgba(106,86,215,0.46)' : 'rgba(177,150,255,0.8)')
    : isHero
      ? (isDay ? 'rgba(63,103,214,0.24)' : 'rgba(107,130,255,0.34)')
    : (isDay ? 'rgba(23,120,111,0.54)' : 'rgba(74,215,192,0.82)')

  // Day/night palette
  const sphereFill   = isOrb ? 'transparent' : (isDay ? '#e8e3da' : '#06080d')
  const sphereStroke = isOrb
    ? (isDay ? 'rgba(92, 102, 140, 0.24)' : 'rgba(188, 210, 255, 0.24)')
    : isHero
      ? (isDay ? 'rgba(92, 102, 140, 0.14)' : 'rgba(188, 210, 255, 0.12)')
    : 'none'
  const sphereStrokeWidth = isOrb ? 1.25 : isHero ? 0.8 : 0
  const landFill     = isDay ? '#ddd7cd' : '#10151d'
  const outlineColor = isDay ? 'rgba(63,103,214,0.22)' : 'rgba(107,130,255,0.22)'
  const dotInactive  = isDay ? 'rgba(70,84,130,0.46)' : 'rgba(196,216,255,0.7)'
  const dotActive    = activeType === 'education' ? PURPLE : (isDay ? CYAN : '#ffffff')
  const labelActive  = isDay ? 'rgba(25,28,42,0.92)' : 'rgba(255,255,255,0.92)'
  const labelInact   = isDay ? 'rgba(78,86,118,0.5)' : 'rgba(162,197,255,0.38)'
  const outerHaloStroke = isOrb ? 10 : isHero ? 18 : 30
  const innerHaloStroke = isOrb ? 12 : isHero ? 42 : 80
  const contentOpacity = isOrb ? 0 : isHero ? 0.26 : 1
  const heroSphereFillValues = isDay
    ? '#e8e3da;#e4ddd1;#ece6de;#e7e1d7;#e8e3da'
    : '#06080d;#09101a;#101528;#0a0d16;#06080d'
  const heroSphereStrokeValues = isDay
    ? 'rgba(92,102,140,0.14);rgba(70,118,130,0.18);rgba(106,86,215,0.18);rgba(92,102,140,0.14)'
    : 'rgba(188,210,255,0.12);rgba(74,215,192,0.16);rgba(177,150,255,0.16);rgba(188,210,255,0.12)'
  const heroOuterGlowValues = isDay
    ? 'rgba(75,84,115,0.34);rgba(63,103,214,0.24);rgba(23,120,111,0.24);rgba(75,84,115,0.34)'
    : 'rgba(183,205,255,0.88);rgba(107,130,255,0.7);rgba(74,215,192,0.62);rgba(183,205,255,0.88)'
  const heroInnerGlowValues = isDay
    ? 'rgba(63,103,214,0.24);rgba(23,120,111,0.22);rgba(106,86,215,0.22);rgba(63,103,214,0.24)'
    : 'rgba(107,130,255,0.34);rgba(74,215,192,0.32);rgba(177,150,255,0.32);rgba(107,130,255,0.34)'

  return (
    <svg
      viewBox="0 0 500 500"
      style={{ width: '100%', height: '100%', cursor, overflow: 'visible' }}
      onPointerDown={isOrb || isHero ? undefined : onPointerDown}
      onPointerMove={isOrb || isHero ? undefined : onPointerMove}
      onPointerUp={isOrb || isHero ? undefined : onPointerUp}
      onPointerLeave={isOrb || isHero ? undefined : onPointerUp}
      aria-hidden="true"
    >
      <defs>
        {/* Halo rim — outer glow (spreads outward) */}
        <filter id="rim-outer" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="40" />
        </filter>
        {/* Halo rim — inner glow (spreads inward) */}
        <filter id="rim-inner" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="60" />
        </filter>
        <clipPath id="globe-clip">
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>

        <filter id="arc-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        <filter id="dot-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        <clipPath id="clip">
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>
      </defs>

      {/* Sphere */}
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill={sphereFill}
        stroke={sphereStroke}
        strokeWidth={sphereStrokeWidth}
        style={{ transition: 'fill 0.6s ease, stroke 0.6s ease, stroke-width 0.6s ease' }}
      >
        {isHero && <animate attributeName="fill" values={heroSphereFillValues} dur="34s" repeatCount="indefinite" />}
        {isHero && <animate attributeName="stroke" values={heroSphereStrokeValues} dur="34s" repeatCount="indefinite" />}
      </circle>

      {/* Clipped globe content */}
      {/* Globe content — fades out in orb mode */}
      <g style={{ opacity: contentOpacity, transition: 'opacity 0.9s ease' }}>
      <g clipPath="url(#clip)">
        {/* Land */}
        <path
          d={pathGen(land as GeoPermissibleObjects) ?? ''}
          fill={landFill}
          style={{ transition: 'fill 0.6s ease' }}
        />

        {/* Worked-in country outlines */}
        <path
          d={pathGen(workedInFeatures as GeoPermissibleObjects) ?? ''}
          fill="none"
          stroke={outlineColor}
          strokeWidth={0.5}
          style={{ transition: 'stroke 0.6s ease' }}
        />

        {/* City dots */}
        {!isHero && Object.entries(CITIES).map(([key, { coords, label, anchor }]) => {
          const pt = proj(coords)
          if (!pt) return null
          const [x, y] = pt
          const isActive = activeLocation === key
          const dx = anchor === 'end' ? -9 : 9

          return (
            <g
              key={key}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect()
                const clickAnchor = rect
                  ? {
                      x: rect.left + (x / 500) * rect.width,
                      y: rect.top + (y / 500) * rect.height,
                    }
                  : undefined
                onCityClick?.(key, clickAnchor)
              }}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={x}
                cy={y}
                r={12}
                fill="transparent"
              />
              {/* Pulse ring — only when active */}
              {isActive && (
                <circle cx={x} cy={y} r={5} fill="none" stroke={activeType === 'education' ? PURPLE : CYAN} strokeWidth={1}>
                  <animate attributeName="r" from="5" to="20" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.7" to="0" dur="1.8s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                cx={x} cy={y}
                r={isActive ? 4.5 : 3}
                fill={isActive ? dotActive : dotInactive}
                filter={isActive ? 'url(#dot-glow)' : undefined}
                style={{ transition: 'r 0.4s, fill 0.4s' }}
              />
              <text
                x={x + dx} y={y + 4}
                fontSize={10}
                textAnchor={anchor}
                fill={isActive ? labelActive : labelInact}
                fontFamily="var(--font-mono)"
                style={{ userSelect: 'none', pointerEvents: 'none', transition: 'fill 0.4s' }}
              >
                {label}
              </text>
            </g>
          )
        })}
      </g>

      {/* Elevated arcs — inside the fading group */}
      {!isHero && CAREER_ARCS.map(({ id, from, to }) => {
        const active = activeArc === id
        const d = elevatedArcPath(CITIES[from].coords, CITIES[to].coords, proj, 50)
        if (!d) return null
        return (
          <path
            key={id}
            d={d}
            fill="none"
            stroke={CYAN}
            strokeWidth={active ? 2.5 : 1}
            strokeOpacity={active ? 1 : DIM}
            strokeLinecap="round"
            filter={active ? 'url(#arc-glow)' : undefined}
            style={{ transition: 'stroke-width 0.5s, stroke-opacity 0.5s' }}
          />
        )
      })}

      {!isHero && EDU_ARCS.map(({ id, from, to }) => {
        const active = activeArc === id
        const d = elevatedArcPath(CITIES[from].coords, CITIES[to].coords, proj, 50)
        if (!d) return null
        return (
          <path
            key={id}
            d={d}
            fill="none"
            stroke={PURPLE}
            strokeWidth={active ? 2.5 : 1}
            strokeOpacity={active ? 1 : DIM}
            strokeLinecap="round"
            filter={active ? 'url(#arc-glow)' : undefined}
            style={{ transition: 'stroke-width 0.5s, stroke-opacity 0.5s' }}
          />
        )
      })}
      </g> {/* end fading globe content group */}

      {/* Rim halo — outer glow */}
      <circle
        cx={CX} cy={CY} r={R + 8}
        fill="none"
        stroke={isDay ? 'rgba(75,84,115,0.34)' : 'rgba(183,205,255,0.88)'}
        strokeWidth={outerHaloStroke}
        filter="url(#rim-outer)"
        style={{ transition: 'stroke 1.1s ease' }}
      >
        {isHero && <animate attributeName="stroke" values={heroOuterGlowValues} dur="30s" repeatCount="indefinite" />}
      </circle>
      {/* Rim halo — inner glow */}
      <circle
        cx={CX} cy={CY} r={R - 8}
        fill="none"
        stroke={haloColor}
        strokeWidth={innerHaloStroke}
        filter="url(#rim-inner)"
        clipPath="url(#globe-clip)"
        style={{ transition: 'stroke 1.1s ease' }}
      >
        {isHero && <animate attributeName="stroke" values={heroInnerGlowValues} dur="28s" repeatCount="indefinite" />}
      </circle>
    </svg>
  )
}
