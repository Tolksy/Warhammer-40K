interface MainMenuProps {
  onPlay: () => void
  onArmyPainter: () => void
  onGameSettings: () => void
}

export function MainMenu({ onPlay, onArmyPainter, onGameSettings }: MainMenuProps) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#f9fafb' }}>
      <div
        style={{
          maxWidth: 480,
          margin: '0 auto',
          padding: '4rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '1.5rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Warhammer 40,000
          </h1>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#9ca3af' }}>
            10th Edition Skirmish
          </p>
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            type="button"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 6,
              border: 'none',
              backgroundColor: '#facc15',
              color: '#020617',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
            }}
            onClick={onPlay}
          >
            Play
          </button>

          <button
            type="button"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 6,
              border: '1px solid #4b5563',
              backgroundColor: '#020617',
              color: '#9ca3af',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            onClick={onGameSettings}
          >
            Game Settings
          </button>

          <button
            type="button"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 6,
              border: '1px dashed #4b5563',
              backgroundColor: '#020617',
              color: '#6b7280',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            onClick={onArmyPainter}
          >
            Army Painter (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  )
}




