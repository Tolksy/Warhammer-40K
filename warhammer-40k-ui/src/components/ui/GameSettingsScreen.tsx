import type { ArmySize, Faction, GameSettings, MapId } from '../../App'

interface GameSettingsScreenProps {
  settings: GameSettings
  onChange: (s: GameSettings) => void
  onBack: () => void
  onStartGame: () => void
}

export function GameSettingsScreen({ settings, onChange, onBack, onStartGame }: GameSettingsScreenProps) {
  const update = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#f9fafb' }}>
      <div
        style={{
          maxWidth: 640,
          margin: '0 auto',
          padding: '3rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, textAlign: 'center' }}>Game Settings</h1>

        <label style={{ fontSize: '0.85rem' }}>
          Player 1 Faction
          <select
            value={settings.player1Faction}
            onChange={(e) => update('player1Faction', e.target.value as Faction)}
            style={{ display: 'block', width: '100%', marginTop: 4, padding: 6 }}
          >
            <option>Space Marines</option>
            <option>Necrons</option>
          </select>
        </label>

        <label style={{ fontSize: '0.85rem' }}>
          Player 2 Faction
          <select
            value={settings.player2Faction}
            onChange={(e) => update('player2Faction', e.target.value as Faction)}
            style={{ display: 'block', width: '100%', marginTop: 4, padding: 6 }}
          >
            <option>Space Marines</option>
            <option>Necrons</option>
          </select>
        </label>

        <label style={{ fontSize: '0.85rem' }}>
          Army Size
          <select
            value={settings.armySize}
            onChange={(e) => update('armySize', e.target.value as ArmySize)}
            style={{ display: 'block', width: '100%', marginTop: 4, padding: 6 }}
          >
            <option>Patrol</option>
            <option>Incursion</option>
            <option>Strike Force</option>
          </select>
        </label>

        <label style={{ fontSize: '0.85rem' }}>
          Map
          <select
            value={settings.map}
            onChange={(e) => update('map', e.target.value as MapId)}
            style={{ display: 'block', width: '100%', marginTop: 4, padding: 6 }}
          >
            <option>Dawn of War</option>
            <option>Sweep and Clear</option>
            <option>Urban Ruins</option>
          </select>
        </label>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', gap: '0.5rem' }}>
          <button type="button" onClick={onBack} style={{ flex: 1, padding: 8 }}>
            Back
          </button>
          <button
            type="button"
            onClick={onStartGame}
            style={{ flex: 1, padding: 8, backgroundColor: '#facc15', border: 'none', fontWeight: 600 }}
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  )
}


