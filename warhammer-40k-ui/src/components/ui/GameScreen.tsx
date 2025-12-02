import { useEffect, useState, type MouseEvent } from 'react'
import type { GameSettings, MapId, Faction } from '../../App'
import { spaceMarineUnits } from '../../data/space_marines'
import { necronUnits } from '../../data/necrons'

interface GameScreenProps {
  settings: GameSettings
  onBackToMenu: () => void
}

type ObjectivePoint = { x: number; y: number }

interface MapConfig {
  name: string
  background: string
  gridOverlay: string
  objectives: ObjectivePoint[] // values are 0–1 for x/y, we scale to board size
}

const MAP_CONFIGS: Record<MapId, MapConfig> = {
  'Dawn of War': {
    name: 'Dawn of War',
    background: '#020617',
    gridOverlay:
      'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.15) 1px, transparent 0)',
    objectives: [
      { x: 0.5, y: 0.5 },
      { x: 0.25, y: 0.25 },
      { x: 0.75, y: 0.75 },
    ],
  },
  'Sweep and Clear': {
    name: 'Sweep and Clear',
    background: '#020617',
    gridOverlay:
      'radial-gradient(circle at 1px 1px, rgba(52,211,153,0.2) 1px, transparent 0)',
    objectives: [
      { x: 0.2, y: 0.3 },
      { x: 0.8, y: 0.3 },
      { x: 0.5, y: 0.7 },
    ],
  },
  'Urban Ruins': {
    name: 'Urban Ruins',
    background: '#020617',
    gridOverlay:
      'radial-gradient(circle at 1px 1px, rgba(248,113,113,0.25) 1px, transparent 0)',
    objectives: [
      { x: 0.2, y: 0.8 },
      { x: 0.8, y: 0.8 },
      { x: 0.5, y: 0.35 },
    ],
  },
}

// Board aspect ratio 60" x 44" (we store unit positions in inches)
const BOARD_WIDTH = 60
const BOARD_HEIGHT = 44

type Owner = 'P1' | 'P2'

interface DisplayUnit {
  id: string
  name: string
  owner: Owner
  faction: Faction
  movement: number // inches
  x: number // inches (0 – BOARD_WIDTH)
  y: number // inches (0 – BOARD_HEIGHT)
}

const armySizeToCount = (size: GameSettings['armySize']): number => {
  switch (size) {
    case 'Patrol':
      return 3
    case 'Incursion':
      return 5
    case 'Strike Force':
      return 7
    default:
      return 3
  }
}

const templatesForFaction = (faction: Faction) =>
  faction === 'Space Marines' ? spaceMarineUnits : necronUnits

const spawnLine = (count: number, yInches: number, owner: Owner, faction: Faction): DisplayUnit[] => {
  if (count === 0) return []

  const templates = templatesForFaction(faction)
  const chosen = templates.slice(0, count)
  const segment = BOARD_WIDTH / (count + 1)

  return chosen.map((template, index) => ({
    id: `${owner}-${template.name}-${index}`,
    name: template.name,
    owner,
    faction,
    movement: template.models[0]?.stats.movement ?? 6,
    x: segment * (index + 1),
    y: yInches,
  }))
}

export function GameScreen({ settings, onBackToMenu }: GameScreenProps) {
  const mapConfig = MAP_CONFIGS[settings.map]
  const [units, setUnits] = useState<DisplayUnit[]>([])
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null)

  // (Re)spawn units whenever settings change (e.g. new game)
  useEffect(() => {
    const count = armySizeToCount(settings.armySize)
    const p1Units = spawnLine(count, BOARD_HEIGHT * 0.8, 'P1', settings.player1Faction)
    const p2Units = spawnLine(count, BOARD_HEIGHT * 0.2, 'P2', settings.player2Faction)
    setUnits([...p1Units, ...p2Units])
    setSelectedUnitId(null)
  }, [settings])

  const handleUnitClick = (id: string) => {
    setSelectedUnitId((current) => (current === id ? null : id))
  }

  const handleBoardClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!selectedUnitId) return

    const rect = event.currentTarget.getBoundingClientRect()
    const relX = event.clientX - rect.left
    const relY = event.clientY - rect.top

    const targetXInches = Math.min(
      Math.max((relX / rect.width) * BOARD_WIDTH, 0),
      BOARD_WIDTH,
    )
    const targetYInches = Math.min(
      Math.max((relY / rect.height) * BOARD_HEIGHT, 0),
      BOARD_HEIGHT,
    )

    const unit = units.find((u) => u.id === selectedUnitId)
    if (!unit) return

    setUnits((prev) =>
      prev.map((u) =>
        u.id === unit.id ? { ...u, x: targetXInches, y: targetYInches } : u,
      ),
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#020617',
        color: '#f9fafb',
        padding: '2rem',
        boxSizing: 'border-box',
      }}
    >
      <button type="button" onClick={onBackToMenu} style={{ marginBottom: '1rem' }}>
        Back to Main Menu
      </button>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
        Skirmish – {mapConfig.name}
      </h1>
      <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#9ca3af' }}>
        P1: {settings.player1Faction} · P2: {settings.player2Faction} · Size: {settings.armySize}
      </p>

      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {/* Battlefield */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 480px',
            maxWidth: 800,
            aspectRatio: `${BOARD_WIDTH} / ${BOARD_HEIGHT}`,
            borderRadius: 12,
            border: '1px solid #4b5563',
            overflow: 'hidden',
            backgroundColor: mapConfig.background,
          }}
          onClick={handleBoardClick}
        >
          {/* Grid / texture overlay to differentiate maps visually */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: mapConfig.gridOverlay,
              backgroundSize: '32px 32px',
              opacity: 0.9,
            }}
          />

          {/* Objective markers */}
          {mapConfig.objectives.map((pt, index) => {
            const left = pt.x * 100
            const top = pt.y * 100
            return (
              <div
                key={`${mapConfig.name}-obj-${index}`}
                style={{
                  position: 'absolute',
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: 'translate(-50%, -50%)',
                  width: 18,
                  height: 18,
                  borderRadius: '999px',
                  border: '2px solid #facc15',
                  backgroundColor: 'rgba(15,23,42,0.85)',
                  boxShadow: '0 0 8px rgba(250,204,21,0.7)',
                }}
              />
            )
          })}

          {/* Units (simple tokens for now) */}
          {units.map((unit) => {
            const left = unit.x * 100
            const top = unit.y * 100
            const isP1 = unit.owner === 'P1'

            return (
              <div
                key={unit.id}
                style={{
                  position: 'absolute',
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: 'translate(-50%, -50%)',
                  padding: '4px 8px',
                  borderRadius: 6,
                  backgroundColor: isP1 ? 'rgba(59,130,246,0.9)' : 'rgba(16,185,129,0.9)',
                  fontSize: '0.7rem',
                  whiteSpace: 'nowrap',
                  border:
                    selectedUnitId === unit.id
                      ? '2px solid rgba(250,204,21,0.9)'
                      : '1px solid rgba(15,23,42,0.9)',
                  boxShadow:
                    selectedUnitId === unit.id
                      ? '0 0 10px rgba(250,204,21,0.8)'
                      : 'none',
                  cursor: 'pointer',
                }}
                title={`${unit.owner} – ${unit.name}`}
                onClick={(ev) => {
                  ev.stopPropagation()
                  handleUnitClick(unit.id)
                }}
              >
                {unit.owner}: {unit.name}
              </div>
            )
          })}
        </div>

        {/* Side info panel */}
        <div
          style={{
            width: 260,
            flex: '0 0 auto',
            borderRadius: 12,
            border: '1px solid #4b5563',
            padding: '1rem',
            backgroundColor: '#020617',
            boxSizing: 'border-box',
          }}
        >
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Map Info</h2>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.75rem' }}>
            Map: <strong>{mapConfig.name}</strong>
          </p>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
            Objectives: {mapConfig.objectives.length} markers on the field.
          </p>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
            Next step: spawn units and apply movement/shooting rules using your existing engine.
          </p>
        </div>
      </div>
    </div>
  )
}
