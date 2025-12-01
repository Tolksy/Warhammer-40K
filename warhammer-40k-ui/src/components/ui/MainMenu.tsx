import { useGameStore } from '../../store/gameStore'

const factionOptions = ['Space Marines', 'Necrons'] as const
const sizeOptions = [
  { id: 'PATROL', label: 'Patrol (up to 3 units)' },
  { id: 'INCURSION', label: 'Incursion (up to 5 units)' },
  { id: 'STRIKE_FORCE', label: 'Strike Force (up to 7 units)' },
] as const

const MainMenu = () => {
  const { config, setConfig, startSkirmish } = useGameStore((state) => ({
    config: state.config,
    setConfig: state.setConfig,
    startSkirmish: state.startSkirmish,
  }))

  const canStart =
    !!config.player1Faction && !!config.player2Faction && !!config.size && config.player1Faction !== null

  return (
    <div className="min-h-screen bg-grimdark-bg text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-900/90 p-6 shadow-2xl">
          <h1 className="mb-1 text-center text-2xl font-semibold uppercase tracking-wide">
            Warhammer 40,000 – 10th Edition
          </h1>
          <p className="mb-6 text-center text-sm text-slate-300">Skirmish Launcher</p>

          <div className="space-y-4 text-sm">
            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Player 1 Faction
              </h2>
              <div className="flex gap-2">
                {factionOptions.map((faction) => (
                  <button
                    key={faction}
                    type="button"
                    className={`flex-1 rounded border px-3 py-2 text-xs font-semibold ${
                      config.player1Faction === faction
                        ? 'border-grimdark-accent bg-yellow-400 text-slate-900'
                        : 'border-slate-600 bg-slate-900/60 text-slate-100 hover:border-slate-400'
                    }`}
                    onClick={() => setConfig({ player1Faction: faction })}
                  >
                    {faction}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Player 2 Faction
              </h2>
              <div className="flex gap-2">
                {factionOptions.map((faction) => (
                  <button
                    key={faction}
                    type="button"
                    className={`flex-1 rounded border px-3 py-2 text-xs font-semibold ${
                      config.player2Faction === faction
                        ? 'border-grimdark-accent bg-yellow-400 text-slate-900'
                        : 'border-slate-600 bg-slate-900/60 text-slate-100 hover:border-slate-400'
                    }`}
                    onClick={() => setConfig({ player2Faction: faction })}
                  >
                    {faction}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Army Size
              </h2>
              <div className="flex flex-col gap-2 sm:flex-row">
                {sizeOptions.map((size) => (
                  <button
                    key={size.id}
                    type="button"
                    className={`flex-1 rounded border px-3 py-2 text-xs font-semibold text-left sm:text-center ${
                      config.size === size.id
                        ? 'border-grimdark-accent bg-yellow-400 text-slate-900'
                        : 'border-slate-600 bg-slate-900/60 text-slate-100 hover:border-slate-400'
                    }`}
                    onClick={() => setConfig({ size: size.id as any })}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
              <div>
                <div>
                  P1:{' '}
                  <span className="font-semibold">
                    {config.player1Faction ?? '—'}
                  </span>
                </div>
                <div>
                  P2:{' '}
                  <span className="font-semibold">
                    {config.player2Faction ?? '—'}
                  </span>
                </div>
                <div>
                  Size:{' '}
                  <span className="font-semibold">
                    {config.size ?? '—'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="rounded bg-grimdark-accent px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
                onClick={() => startSkirmish()}
                disabled={!canStart}
              >
                Start Skirmish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainMenu



