import './App.css'
import { useGameStore } from './store/gameStore'
import { BattleScreen, MainMenu } from './components/ui'

function App() {
  const gameView = useGameStore((state) => state.gameView)

  if (gameView === 'MENU') {
    return <MainMenu />
  }

  return <BattleScreen />
}

export default App
