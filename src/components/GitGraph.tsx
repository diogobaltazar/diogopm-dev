/**
 * Git-log-style branch visualisation.
 * – Central main branch line (dark indigo)
 * – Industry commits branch LEFT via S-curve (cyan)
 * – Education commits branch RIGHT via S-curve (purple)
 * – Hollow circle nodes; active node glows
 * – Click a node to select/deselect the corresponding entry
 */

import { useMemo } from 'react'

const MAIN_X  = 30   // centre vertical main line
const IND_X   = 6    // industry node (left of main)
const EDU_X   = 54   // education node (right of main)
const SVG_W   = 64

const MAIN_COL = 'rgba(60,80,200,0.45)'  // dark indigo for the trunk
const CYAN     = '#00e5ff'
const PURPLE   = '#cc44ff'

export interface GitSegment {
  lane: 0 | 1   // 0 = education (right, purple)  1 = industry (left, cyan)
  entryId: string
}

interface GitGraphProps {
  segments: GitSegment[]
  activeIdx: number | null
  entryHeights: number[]
  onNodeClick?: (idx: number) => void
}

/** S-curve cubic bezier from (x1,y0) on the main line to (xN, midY) on the branch */
function sCurve(x1: number, y0: number, xN: number, midY: number): string {
  // M x1,y0  C x1,midY  xN,y0  xN,midY
  // → starts going vertically along x1, swings horizontally to xN
  return `M ${x1},${y0} C ${x1},${midY} ${xN},${y0} ${xN},${midY}`
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

  // ── Main vertical trunk (continuous) ──────────────────────────────────────
  elems.push(
    <line
      key="trunk"
      x1={MAIN_X} y1={0}
      x2={MAIN_X} y2={totalHeight}
      stroke={MAIN_COL}
      strokeWidth={1.2}
    />
  )

  // ── Per-entry branch + node ────────────────────────────────────────────────
  for (let i = 0; i < segments.length; i++) {
    const seg    = segments[i]
    const h      = entryHeights[i] ?? 0
    const y0     = yPos[i] ?? 0
    const midY   = y0 + h / 2
    const isInd  = seg.lane === 1
    const nodeX  = isInd ? IND_X : EDU_X
    const col    = isInd ? CYAN : PURPLE
    const active = i === activeIdx

    const branchOp = active ? 0.9 : 0.3
    const branchW  = active ? 1.4 : 0.8

    // S-curve from main trunk to node
    elems.push(
      <path
        key={`branch-${i}`}
        d={sCurve(MAIN_X, y0, nodeX, midY)}
        fill="none"
        stroke={col}
        strokeWidth={branchW}
        strokeOpacity={branchOp}
        style={{ transition: 'stroke-width 0.35s, stroke-opacity 0.35s' }}
      />
    )

    // Outer hollow circle
    elems.push(
      <circle
        key={`ring-${i}`}
        cx={nodeX}
        cy={midY}
        r={active ? 5.5 : 4}
        fill="none"
        stroke={col}
        strokeWidth={active ? 1.5 : 1}
        strokeOpacity={active ? 1 : 0.5}
        style={{
          cursor: 'pointer',
          transition: 'r 0.35s, stroke-opacity 0.35s',
          filter: active ? `drop-shadow(0 0 5px ${col})` : 'none',
        }}
        onClick={() => onNodeClick?.(i)}
      />
    )

    // Pulse ring when active
    if (active) {
      elems.push(
        <circle key={`pulse-${i}`} cx={nodeX} cy={midY} r={5.5} fill="none" stroke={col} strokeWidth={1}>
          <animate attributeName="r"       from="5.5" to="14"  dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.7"  to="0"   dur="1.6s" repeatCount="indefinite" />
        </circle>
      )
    }
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
