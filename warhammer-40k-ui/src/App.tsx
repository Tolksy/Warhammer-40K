import './App.css'
import { useGameStore } from './store/gameStore'
import Battlefield from './components/board/Battlefield'
import { BattleLog, UnitCard, ShootingPanel, DiceTray } from './components/ui'

function App() {
  const { currentPlayer, turnPhase, turnNumber, cp, vp, addCP, nextPhase, resolveBattleshock, scoreObjectivesForCurrentPlayer } =
    useGameStore()

  const cpKey = currentPlayer === 'Player 1' ? 'player1' : 'player2'

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
            <p className="text-xs text-slate-400">
              CP – P1: {cp.player1} · P2: {cp.player2} · VP – P1: {vp.player1} · P2: {vp.player2}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded bg-slate-800 px-2 py-1 text-xs font-semibold hover:bg-slate-700"
              onClick={() => addCP(cpKey, 1)}
            >
              Gain CP ({currentPlayer})
            </button>
            <button
              type="button"
              className="rounded bg-slate-800 px-2 py-1 text-xs font-semibold hover:bg-slate-700"
              onClick={() => resolveBattleshock()}
            >
              Resolve Battleshock
            </button>
            <button
              type="button"
              className="rounded bg-slate-800 px-2 py-1 text-xs font-semibold hover:bg-slate-700"
              onClick={() => scoreObjectivesForCurrentPlayer()}
            >
              Score Objectives
            </button>
            <button
              type="button"
              className="rounded bg-grimdark-accent px-2 py-1 text-xs font-semibold text-slate-900 hover:bg-yellow-300"
              onClick={() => nextPhase()}
            >
              End Phase
            </button>
          </div>
        </header>

        <main className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-3">
            <Battlefield />
          </div>
          <div className="flex flex-col gap-3">
            <UnitCard />
            <ShootingPanel />
            <BattleLog />
          </div>
        </main>

        <DiceTray />
      </div>
    </div>
  )
}

export default App
