import './App.css'
import { useGameStore } from './store/gameStore'
import Battlefield from './components/board/Battlefield'

function App() {
  const { currentPlayer, turnPhase, turnNumber } = useGameStore()

  return (
    <div className="min-h-screen bg-grimdark-bg text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
        <header className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 shadow">
          <div>
            <h1 className="text-lg font-semibold uppercase tracking-wide text-slate-100">
              Warhammer 40,000 – 10th Edition
            </h1>
            <p className="text-sm text-slate-300">
              Turn {turnNumber}: {turnPhase} Phase · {currentPlayer}
            </p>
          </div>
        </header>

        <main className="flex flex-1 justify-center">
          <Battlefield />
        </main>
      </div>
    </div>
  )
}

export default App
