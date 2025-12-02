import { useGameStore } from '../../store/gameStore'

const BattleLog = () => {
  const entries = useGameStore((state) => state.battleLog)

  if (entries.length === 0) {
    return (
      <div className="h-48 rounded-lg border border-slate-700 bg-slate-900/80 p-3 text-xs text-slate-400">
        No battle log entries yet.
      </div>
    )
  }

  const ordered = [...entries].reverse()

  return (
    <div className="h-48 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900/80 p-3 text-xs">
      {ordered.map((entry) => (
        <div key={entry.id} className="mb-1 last:mb-0">
          <div className="text-[10px] text-slate-500">
            Turn {entry.turn} · {entry.phase}
          </div>
          <div className="text-slate-100">{entry.text}</div>
        </div>
      ))}
    </div>
  )
}

export default BattleLog




