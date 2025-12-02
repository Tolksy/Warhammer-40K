import type { GameSettings, MapId } from '../../App'

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

// Board aspect ratio 60" x 44"
const BOARD_WIDTH = 60
const BOARD_HEIGHT = 44

export function GameScreen({ settings, onBackToMenu }: GameScreenProps) {
  const mapConfig = MAP_CONFIGS[settings.map]

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
