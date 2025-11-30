import { clsx } from 'clsx'
import type { UnitInstance } from '../../types'

interface UnitTokenProps {
  unit: UnitInstance
  isSelected: boolean
  onClick: () => void
}

export const UnitToken = ({ unit, isSelected, onClick }: UnitTokenProps) => {
  const modelCount = unit.models.length
  const totalWounds = unit.models.reduce((sum, model) => sum + model.stats.wounds, 0)
  const currentWounds = unit.models.reduce((sum, model) => sum + model.currentWounds, 0)
  const healthPct = totalWounds > 0 ? (currentWounds / totalWounds) * 100 : 100

  const firstModel = unit.models[0]

  const factionGradient =
    unit.faction === 'Space Marines'
      ? 'from-blue-500/80 to-sky-500/80'
      : unit.faction === 'Necrons'
        ? 'from-emerald-500/80 to-lime-500/80'
        : 'from-slate-500/80 to-slate-300/80'

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'relative flex h-20 w-36 flex-col justify-between rounded-lg border px-3 py-2 text-left text-xs shadow-md transition',
        'border-slate-600 bg-slate-900/80 hover:border-grimdark-accent hover:shadow-lg',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-grimdark-accent',
        isSelected && 'ring-2 ring-grimdark-accent',
      )}
    >
      {/* Engagement ring (1\" aura visualised as a subtle halo) */}
      <div
        className={clsx(
          'pointer-events-none absolute -inset-1 rounded-xl border-2 border-red-500/60 opacity-0 transition-opacity',
          isSelected && 'opacity-80',
        )}
      />

      <div className="flex items-center justify-between font-semibold uppercase tracking-wide text-slate-100">
        <span className="truncate">{unit.name}</span>
        <span className="text-[10px] text-slate-400">{unit.role}</span>
      </div>

      <div className="flex items-baseline justify-between text-slate-300">
        <span>Models: {modelCount}</span>
        {firstModel ? (
          <span>
            T{firstModel.stats.toughness} · Sv {firstModel.stats.save}+
          </span>
        ) : (
          <span>-</span>
        )}
      </div>

      {/* Wound health bar */}
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-700">
        <div
          className={clsx('h-full bg-gradient-to-r', factionGradient)}
          style={{ width: `${healthPct}%` }}
        />
      </div>
    </button>
  )
}


