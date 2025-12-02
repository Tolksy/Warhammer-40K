import { useGameStore } from '../../store/gameStore'

const ShootingPanel = () => {
  const { units, selection, resolveShooting } = useGameStore((state) => ({
    units: state.units,
    selection: state.selection,
    resolveShooting: state.resolveShooting,
  }))

  const attacker = units.find((u) => u.id === selection.selectedUnitId)
  const target = units.find((u) => u.id === selection.targetUnitId)

  if (!attacker || !target) {
    return (
      <div className="h-40 rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-3 text-xs text-slate-400">
        Select an attacker, then Shift+click an enemy unit to set a target for shooting.
      </div>
    )
  }

  const primary = attacker.models[0]
  const rangedWeapons = primary?.weapons.filter((w) => w.type === 'ranged') ?? []

  if (rangedWeapons.length === 0) {
    return (
      <div className="h-40 rounded-lg border border-slate-700 bg-slate-900/80 p-3 text-xs text-slate-100">
        <div className="font-semibold text-slate-200">Shooting</div>
        <div className="mt-1 text-slate-300">
          {attacker.name} has no ranged weapons available for shooting.
        </div>
      </div>
    )
  }

  return (
    <div className="h-40 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900/80 p-3 text-xs text-slate-100">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <div className="font-semibold text-slate-200">Shooting</div>
          <div className="text-[11px] text-slate-400">
            {attacker.name} → {target.name}
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {rangedWeapons.map((weapon, idx) => (
          <div
            key={weapon.name}
            className="flex items-center justify-between rounded border border-slate-700 bg-slate-950/60 px-2 py-1 text-[10px]"
          >
            <div>
              <div className="font-semibold">{weapon.name}</div>
              <div className="text-[9px] text-slate-400">
                R {typeof weapon.range === 'number' ? `${weapon.range}"` : 'Melee'} · A{' '}
                {typeof weapon.attacks === 'number' ? weapon.attacks : weapon.attacks} · S{' '}
                {weapon.strength} · AP {weapon.ap} · D{' '}
                {typeof weapon.damage === 'number' ? weapon.damage : weapon.damage}
              </div>
            </div>
            <button
              type="button"
              className="rounded bg-grimdark-accent px-2 py-1 text-[10px] font-semibold text-slate-900 hover:bg-yellow-300"
              onClick={() => resolveShooting(attacker.id, target.id, idx)}
            >
              Fire
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ShootingPanel




