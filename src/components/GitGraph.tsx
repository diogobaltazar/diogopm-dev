/**
 * Git-log-style branch visualisation.
 *
 * Rules:
 *  – One commit per entry, on its own branch (fork → commit → merge).
 *  – Branches whose real-world date ranges overlap occupy different lane columns.
 *  – Lane assignment: greedy interval colouring on branch "extents" (the set of
 *    rows a branch line passes through, from its merge point down to its commit row).
 *  – Branch line extends from the merge point (top, newer) to the fork point (bottom, older).
 *  – Clicking a node fires onNodeClick.
 */

import { useMemo } from 'react'

// ─── constants ────────────────────────────────────────────────────────────────

const MAIN_X    = 14
const LANE_BASE = 40   // x of lane 0
const LANE_STEP = 26   // px between lanes
const CURVE_R   = 14   // bezier curve arm length
const NODE_R = 4.5   // matches globe city dot size

const MAIN_COL = 'rgba(50,70,200,0.4)'
const CYAN     = '#00e5ff'
const PURPLE   = '#cc44ff'

// ─── types ────────────────────────────────────────────────────────────────────

export interface GitEntry {
  type: 'experience' | 'education'
  branchLabel: string   // e.g. "industry/principal-ai-engineer"
  startTs: number       // Date.UTC timestamp
  endTs: number | null  // null = ongoing / present
}

interface GitGraphProps {
  entries: GitEntry[]
  activeIdx: number | null
  entryHeights: number[]
  onNodeClick?: (idx: number) => void
}

// ─── layout computation ───────────────────────────────────────────────────────

function computeLayout(entries: GitEntry[]): { lanes: number[]; extentTopRow: number[] } {
  const n   = entries.length
  const now = Date.now()

  // extentTopRow[j] = the topmost row index where branch j's line is visible.
  // Branch j is visible at row i (i < j, higher up / newer) when:
  //   entries[j].endTs > entries[i].startTs
  // i.e. j's role ended after i's role started → they were simultaneously active.
  const extentTopRow = entries.map((e, j) => {
    const endTs = e.endTs ?? now
    let top = j
    for (let i = 0; i < j; i++) {
      if (endTs > entries[i].startTs) top = Math.min(top, i)
    }
    return top
  })

  // Greedy lane assignment: intervals are [extentTopRow[j], j].
  // Two intervals conflict if they share at least one row index.
  const lanes = new Array<number>(n).fill(0)
  for (let j = 0; j < n; j++) {
    const jTop = extentTopRow[j]
    const jBot = j
    const taken = new Set<number>()
    for (let k = 0; k < j; k++) {
      if (Math.max(jTop, extentTopRow[k]) <= Math.min(jBot, k)) {
        taken.add(lanes[k])
      }
    }
    let lane = 0
    while (taken.has(lane)) lane++
    lanes[j] = lane
  }

  return { lanes, extentTopRow }
}

// ─── component ────────────────────────────────────────────────────────────────

export default function GitGraph({ entries, activeIdx, entryHeights, onNodeClick }: GitGraphProps) {
  const totalHeight = entryHeights.reduce((a, b) => a + b, 0)

  const yPos = useMemo(() => {
    let y = 0
    return entryHeights.map(h => { const t = y; y += h; return t })
  }, [entryHeights])

  const { lanes, extentTopRow } = useMemo(() => computeLayout(entries), [entries])

  const maxLane = lanes.length > 0 ? Math.max(...lanes) : 0
  const SVG_W   = LANE_BASE + (maxLane + 1) * LANE_STEP + 2

  if (totalHeight === 0 || entries.length === 0) {
    return <div style={{ width: SVG_W, flexShrink: 0 }} />
  }

  const elems: React.ReactNode[] = []

  // ── Main trunk ─────────────────────────────────────────────────────────────
  elems.push(
    <line
      key="trunk"
      x1={MAIN_X} y1={0}
      x2={MAIN_X} y2={totalHeight}
      stroke={MAIN_COL}
      strokeWidth={1.2}
    />
  )

  // ── Per-branch rendering ───────────────────────────────────────────────────
  for (let j = 0; j < entries.length; j++) {
    const entry   = entries[j]
    const lane    = lanes[j]
    const extTop  = extentTopRow[j]
    const LX      = LANE_BASE + lane * LANE_STEP
    const col     = entry.type === 'experience' ? CYAN : PURPLE

    const mergeY  = yPos[extTop] ?? 0
    const forkY   = (yPos[j] ?? 0) + (entryHeights[j] ?? 0)
    const commitY = (yPos[j] ?? 0) + (entryHeights[j] ?? 0) / 2

    const isActive  = j === activeIdx
    const isOngoing = entry.endTs === null

    const lineOp = activeIdx === null ? 0.6  : isActive ? 0.9  : 0.4
    const lineW  = activeIdx === null ? 1.1  : isActive ? 1.8  : 1.0

    // Clamp curve radius to fit within the row height
    const avail = entryHeights[j] ?? 0
    const R     = Math.min(CURVE_R, avail * 0.38)

    // For ongoing branches the line just ends at the top — no merge curve
    const lineTop = isOngoing ? mergeY : mergeY + R

    // Fork curve: main trunk → branch lane (at bottom of commit row)
    const forkD = `M ${MAIN_X},${forkY} C ${MAIN_X},${forkY - R} ${LX},${forkY} ${LX},${forkY - R}`

    // Merge curve: branch lane → main trunk (at top of extent), only when merged
    const mergeD = `M ${LX},${mergeY + R} C ${LX},${mergeY} ${MAIN_X},${mergeY + R} ${MAIN_X},${mergeY}`

    elems.push(
      <g key={`branch-${j}`} style={{ transition: 'opacity 0.35s' }}>

        {/* Vertical branch line */}
        <line
          x1={LX} y1={lineTop}
          x2={LX} y2={Math.max(lineTop, forkY - R)}
          stroke={col}
          strokeWidth={lineW}
          strokeOpacity={lineOp}
          style={{ transition: 'stroke-width 0.35s, stroke-opacity 0.35s' }}
        />

        {/* Fork curve (always shown) */}
        <path
          d={forkD}
          fill="none"
          stroke={col}
          strokeWidth={lineW * 0.85}
          strokeOpacity={lineOp * 0.85}
        />

        {/* Merge curve — only when the branch has merged back to main */}
        {!isOngoing && (
          <path
            d={mergeD}
            fill="none"
            stroke={col}
            strokeWidth={lineW * 0.85}
            strokeOpacity={lineOp * 0.85}
          />
        )}

        {/* Merge node on main trunk — same size as commit node */}
        {!isOngoing && (
          <circle
            cx={MAIN_X}
            cy={mergeY}
            r={NODE_R}
            fill="rgba(200,210,255,0.55)"
          />
        )}

        {/* Commit node — solid fill, fixed size */}
        <circle
          cx={LX}
          cy={commitY}
          r={NODE_R}
          fill={col}
          fillOpacity={activeIdx === null ? 0.75 : isActive ? 1 : 0.45}
          style={{
            cursor: 'pointer',
            transition: 'fill-opacity 0.35s',
            filter: isActive ? `drop-shadow(0 0 6px ${col})` : 'none',
          }}
          onClick={() => onNodeClick?.(j)}
        />

        {/* Pulse ring when active */}
        {isActive && (
          <circle cx={LX} cy={commitY} r={NODE_R} fill="none" stroke={col} strokeWidth={1}>
            <animate attributeName="r"       from={String(NODE_R)} to="14" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0"     dur="1.6s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Branch label */}
        <text
          x={LX + 4}
          y={mergeY + 9}
          fontSize={6.5}
          fill={col}
          fillOpacity={isActive ? 0.65 : 0.25}
          fontFamily="var(--font-mono)"
          style={{ userSelect: 'none', pointerEvents: 'none', transition: 'fill-opacity 0.35s' }}
        >
          {entry.branchLabel}
        </text>

      </g>
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
