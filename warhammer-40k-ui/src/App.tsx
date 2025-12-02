import './App.css'
import { useGameStore } from './store/gameStore'
import { BattleScreen, MainMenu, SkirmishSetup } from './components/ui'

function App() {
  const gameView = useGameStore((state) => state.gameView)

  if (gameView === 'MENU') {
    return <MainMenu />
  }

  if (gameView === 'SETUP') {
    return <SkirmishSetup />
  }

  return <BattleScreen />
}

export default App
