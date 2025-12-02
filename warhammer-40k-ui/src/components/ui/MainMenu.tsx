import { useGameStore } from '../../store/gameStore'

const MainMenu = () => {
  const startSkirmish = useGameStore((state) => state.startSkirmish)

  return (
    <div className="min-h-screen bg-black text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900/90 p-6 text-center shadow-2xl">
          <h1 className="mb-3 text-2xl font-semibold uppercase tracking-wide">
            Warhammer 40,000
          </h1>
          <p className="mb-6 text-sm text-slate-300">10th Edition Skirmish Demo</p>

          <button
            type="button"
            className="w-full rounded bg-yellow-400 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 hover:bg-yellow-300"
            onClick={() => startSkirmish()}
          >
            Start Skirmish
          </button>
        </div>
      </div>
    </div>
  )
}

export default MainMenu




