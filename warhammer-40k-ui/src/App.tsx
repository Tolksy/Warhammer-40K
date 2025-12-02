import './App.css'
import { useState } from 'react'
import { GameScreen } from './components/ui/GameScreen'
import { GameSettingsScreen } from './components/ui/GameSettingsScreen'
import { MainMenu } from './components/ui/MainMenu'

type View = 'MENU' | 'SETTINGS' | 'GAME'

export type Faction = 'Space Marines' | 'Necrons'
export type ArmySize = 'Patrol' | 'Incursion' | 'Strike Force'
export type MapId = 'Dawn of War' | 'Sweep and Clear' | 'Urban Ruins'

export interface GameSettings {
  player1Faction: Faction
  player2Faction: Faction
  armySize: ArmySize
  map: MapId
}

function App() {
  const [view, setView] = useState<View>('MENU')

  const [settings, setSettings] = useState<GameSettings>({
    player1Faction: 'Space Marines',
    player2Faction: 'Necrons',
    armySize: 'Patrol',
    map: 'Dawn of War',
  })

  if (view === 'SETTINGS') {
    return (
      <GameSettingsScreen
        settings={settings}
        onChange={setSettings}
        onBack={() => setView('MENU')}
        onStartGame={() => setView('GAME')}
      />
    )
  }

  if (view === 'GAME') {
    return <GameScreen settings={settings} onBackToMenu={() => setView('MENU')} />
  }

  return (
    <MainMenu
      onPlay={() => setView('GAME')}
      onArmyPainter={() => alert('Army Painter is coming soon.')}
      onGameSettings={() => setView('SETTINGS')}
    />
  )
}

export default App
