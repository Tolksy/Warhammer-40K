import type { GameSettings } from '../../App'

interface GameScreenProps {
  settings: GameSettings
  onBackToMenu: () => void
}

export function GameScreen({ settings, onBackToMenu }: GameScreenProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#020617',
        color: '#f9fafb',
        padding: '2rem',
      }}
    >
      <button type="button" onClick={onBackToMenu} style={{ marginBottom: '1rem' }}>
        Back to Main Menu
      </button>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Game Screen (Placeholder)</h1>
      <p>Player 1: {settings.player1Faction}</p>
      <p>Player 2: {settings.player2Faction}</p>
      <p>Army Size: {settings.armySize}</p>
      <p>Map: {settings.map}</p>
      <p style={{ marginTop: '1rem', color: '#9ca3af' }}>
        Next step: hook this screen into your actual rules engine and unit spawning.
      </p>
    </div>
  )
}


