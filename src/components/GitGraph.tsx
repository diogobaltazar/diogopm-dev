/**
 * Git-log-style branch visualisation.
 * – Central main branch line (dark indigo trunk, full height)
 * – Industry commits (cyan) and education commits (purple) share the same BRANCH_X lane
 * – Entries grouped into consecutive runs of the same type
 * – Each group: vertical branch line + fork curve at top + merge curve at bottom
 * – Hollow circle nodes; active node glows with pulse ring
 */

import { useMemo } from 'react'

const MAIN_X   = 10
const BRANCH_X = 38
const SVG_W    = 52

const MAIN_COL = 'rgba(50,70,200,0.4)'
const CYAN     = '#00e5ff'
const PURPLE   = '#cc44ff'

export interface GitSegment {
  lane: 0 | 1   // 0 = education (purple)  1 = industry (cyan)
  entryId: string
}

interface GitGraphProps {
  segments: GitSegment[]
  activeIdx: number | null
  entryHeights: number[]
  onNodeClick?: (idx: number) => void
}

interface Group {
  lane: 0 | 1
  col: string
  start: number   // first index in this group
  end: number     // last index in this group (inclusive)
}

function buildGroups(segments: GitSegment[]): Group[] {
  if (segments.length === 0) return []
  const groups: Group[] = []
  let cur: Group = {
    lane: segments[0].lane,
    col: segments[0].lane === 1 ? CYAN : PURPLE,
    start: 0,
    end: 0,
  }
  for (let i = 1; i < segments.length; i++) {
    if (segments[i].lane === cur.lane) {
      cur.end = i
    } else {
      groups.push(cur)
      cur = {
        lane: segments[i].lane,
        col: segments[i].lane === 1 ? CYAN : PURPLE,
        start: i,
        end: i,
      }
    }
  }
  groups.push(cur)
  return groups
}

export default function GitGraph({ segments, activeIdx, entryHeights, onNodeClick }: GitGraphProps) {
  const totalHeight = entryHeights.reduce((a, b) => a + b, 0)

  const yPos = useMemo(() => {
    let y = 0
    return entryHeights.map(h => { const t = y; y += h; return t })
  }, [entryHeights])

  const groups = useMemo(() => buildGroups(segments), [segments])

  if (totalHeight === 0 || segments.length === 0) {
    return <div style={{ width: SVG_W, flexShrink: 0 }} />
  }

  const elems: React.ReactNode[] = []

  // ── Main vertical trunk (continuous, full height) ──────────────────────────
  elems.push(
    <line
      key="trunk"
      x1={MAIN_X} y1={0}
      x2={MAIN_X} y2={totalHeight}
      stroke={MAIN_COL}
      strokeWidth={1.2}
    />
  )

  // ── Per-group: branch line + fork/merge curves ─────────────────────────────
  for (const group of groups) {
    const { col, start, end } = group

    const y0      = yPos[start] ?? 0
    const y1      = (yPos[end] ?? 0) + (entryHeights[end] ?? 0)
    const hFirst  = entryHeights[start] ?? 0
    const hLast   = entryHeights[end] ?? 0

    // Is any entry in this group the active one?
    const groupActive = activeIdx !== null && activeIdx >= start && activeIdx <= end

    const branchOp = groupActive ? 0.9 : 0.3
    const branchW  = groupActive ? 1.8 : 1

    // Vertical branch line from group top to bottom
    elems.push(
      <line
        key={`branch-${start}-${end}`}
        x1={BRANCH_X} y1={y0 + hFirst * 0.45}
        x2={BRANCH_X} y2={y1 - hLast * 0.45}
        stroke={col}
        strokeWidth={branchW}
        strokeOpacity={branchOp}
        style={{ transition: 'stroke-width 0.35s, stroke-opacity 0.35s' }}
      />
    )

    // Fork curve: MAIN → BRANCH at group top
    const forkD = [
      `M ${MAIN_X},${y0}`,
      `C ${MAIN_X},${y0 + hFirst * 0.45}`,
      `  ${BRANCH_X},${y0}`,
      `  ${BRANCH_X},${y0 + hFirst * 0.45}`,
    ].join(' ')

    elems.push(
      <path
        key={`fork-${start}`}
        d={forkD}
        fill="none"
        stroke={col}
        strokeWidth={1}
        strokeOpacity={0.35}
      />
    )

    // Merge curve: BRANCH → MAIN at group bottom
    const mergeD = [
      `M ${BRANCH_X},${y1 - hLast * 0.45}`,
      `C ${BRANCH_X},${y1}`,
      `  ${MAIN_X},${y1 - hLast * 0.45}`,
      `  ${MAIN_X},${y1}`,
    ].join(' ')

    elems.push(
      <path
        key={`merge-${end}`}
        d={mergeD}
        fill="none"
        stroke={col}
        strokeWidth={1}
        strokeOpacity={0.35}
      />
    )

    // ── Nodes for each entry in this group ──────────────────────────────────
    for (let i = start; i <= end; i++) {
      const midY  = (yPos[i] ?? 0) + (entryHeights[i] ?? 0) / 2
      const active = i === activeIdx

      elems.push(
        <circle
          key={`node-${i}`}
          cx={BRANCH_X}
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

      if (active) {
        elems.push(
          <circle key={`pulse-${i}`} cx={BRANCH_X} cy={midY} r={5.5} fill="none" stroke={col} strokeWidth={1}>
            <animate attributeName="r"       from="5.5" to="14" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.7"  to="0"  dur="1.6s" repeatCount="indefinite" />
          </circle>
        )
      }
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
