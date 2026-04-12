/**
 * Git-log-style branch visualisation alongside the timeline.
 * – Industry entries on the right lane (cyan)
 * – Education entries on the left lane (purple)
 * – Curved bezier transitions at lane changes
 * – Active commit node glows and is filled
 */

import { useMemo } from 'react'

const LANE_X: Record<0 | 1, number> = { 0: 16, 1: 44 }  // 0=education(left), 1=industry(right)
const SVG_W   = 64
const CYAN    = '#00e5ff'
const PURPLE  = '#cc44ff'
const COL: Record<0 | 1, string> = { 0: PURPLE, 1: CYAN }

export interface GitSegment {
  lane: 0 | 1
  entryId: string
}

interface GitGraphProps {
  segments: GitSegment[]
  activeIdx: number
  entryHeights: number[]
  onNodeClick?: (idx: number) => void
}

export default function GitGraph({ segments, activeIdx, entryHeights, onNodeClick }: GitGraphProps) {
  const totalHeight = entryHeights.reduce((a, b) => a + b, 0)

  const yPos = useMemo(() => {
    let y = 0
    return entryHeights.map(h => { const t = y; y += h; return t })
  }, [entryHeights])

  if (totalHeight === 0 || segments.length === 0) {
    return <div style={{ width: SVG_W, flexShrink: 0 }} />
  }

  const elems: React.ReactNode[] = []

  for (let i = 0; i < segments.length; i++) {
    const seg    = segments[i]
    const h      = entryHeights[i] ?? 0
    const y0     = yPos[i] ?? 0
    const midY   = y0 + h / 2
    const y1     = y0 + h
    const x      = LANE_X[seg.lane]
    const col    = COL[seg.lane]
    const active = i === activeIdx
    const nextSeg = segments[i + 1]

    // Line: top of segment → commit dot
    elems.push(
      <line
        key={`top-${i}`}
        x1={x} y1={y0}
        x2={x} y2={midY}
        stroke={col}
        strokeWidth={active ? 1.5 : 0.7}
        strokeOpacity={active ? 0.9 : 0.25}
        style={{ transition: 'stroke-width 0.4s, stroke-opacity 0.4s' }}
      />
    )

    // Line/curve: commit dot → bottom of segment (connecting to next)
    if (nextSeg) {
      const nextX      = LANE_X[nextSeg.lane]
      const nextActive = i + 1 === activeIdx

      if (nextSeg.lane !== seg.lane) {
        // Lane change: smooth cubic bezier curve
        const nextMidY = (yPos[i + 1] ?? y1) + (entryHeights[i + 1] ?? h) / 2
        const ctrl1Y   = y1 + (nextMidY - y1) * 0.3
        const ctrl2Y   = y1 + (nextMidY - y1) * 0.7
        elems.push(
          <path
            key={`curve-${i}`}
            d={`M ${x},${midY} L ${x},${y1} C ${x},${ctrl1Y} ${nextX},${ctrl2Y} ${nextX},${nextMidY}`}
            fill="none"
            stroke={col}
            strokeWidth={0.7}
            strokeOpacity={0.25}
          />
        )
      } else {
        // Same lane: straight down
        const lineActive = active || nextActive
        elems.push(
          <line
            key={`bot-${i}`}
            x1={x} y1={midY}
            x2={nextX} y2={y1 + (entryHeights[i + 1] ?? h) / 2}
            stroke={col}
            strokeWidth={lineActive ? 1.5 : 0.7}
            strokeOpacity={lineActive ? 0.9 : 0.25}
            style={{ transition: 'stroke-width 0.4s, stroke-opacity 0.4s' }}
          />
        )
      }
    } else {
      // Last entry — line from dot to bottom edge
      elems.push(
        <line
          key={`bot-${i}`}
          x1={x} y1={midY}
          x2={x} y2={y1}
          stroke={col}
          strokeWidth={active ? 1.5 : 0.7}
          strokeOpacity={active ? 0.9 : 0.25}
          style={{ transition: 'stroke-width 0.4s, stroke-opacity 0.4s' }}
        />
      )
    }

    // Commit dot
    elems.push(
      <circle
        key={`dot-${i}`}
        cx={x}
        cy={midY}
        r={active ? 5 : 3}
        fill={active ? col : '#0a0a0a'}
        stroke={col}
        strokeWidth={active ? 0 : 1.2}
        strokeOpacity={active ? 1 : 0.55}
        style={{
          cursor: 'pointer',
          transition: 'r 0.4s, fill 0.4s',
          filter: active ? `drop-shadow(0 0 5px ${col})` : 'none',
        }}
        onClick={() => onNodeClick?.(i)}
      />
    )
  }

  return (
    <svg
      width={SVG_W}
      height={totalHeight}
      style={{ display: 'block', overflow: 'visible', flexShrink: 0 }}
    >
      {elems}
    </svg>
  )
}
