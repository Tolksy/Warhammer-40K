import { useGameStore } from '../../store/gameStore'

const UnitCard = () => {
  const { units, selection } = useGameStore((state) => ({
    units: state.units,
    selection: state.selection,
  }))

  const unit = units.find((u) => u.id === selection.selectedUnitId)

  if (!unit) {
    return (
      <div className="h-48 rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-3 text-xs text-slate-400">
        Select a unit to see its datasheet.
      </div>
    )
  }

  const primaryModel = unit.models[0]

  return (
    <div className="h-48 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900/80 p-3 text-xs text-slate-100">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide">{unit.name}</div>
          <div className="text-[11px] text-slate-400">
            {unit.faction} · {unit.role}
          </div>
        </div>
        <div className="text-[11px] text-slate-400">
          Pos: ({unit.position.x.toFixed(1)}", {unit.position.y.toFixed(1)}")
        </div>
      </div>

      {primaryModel && (
        <>
          <div className="mb-2 grid grid-cols-3 gap-1 text-[11px]">
            <div>
              <div className="font-semibold text-slate-300">M</div>
              <div>{primaryModel.stats.movement}"</div>
            </div>
            <div>
              <div className="font-semibold text-slate-300">T</div>
              <div>{primaryModel.stats.toughness}</div>
            </div>
            <div>
              <div className="font-semibold text-slate-300">Sv</div>
              <div>{primaryModel.stats.save}+</div>
            </div>
            <div>
              <div className="font-semibold text-slate-300">W</div>
              <div>{primaryModel.stats.wounds}</div>
            </div>
            <div>
              <div className="font-semibold text-slate-300">Ld</div>
              <div>{primaryModel.stats.leadership}+</div>
            </div>
            <div>
              <div className="font-semibold text-slate-300">OC</div>
              <div>{unit.battleshocked ? 0 : primaryModel.stats.objectiveControl}</div>
            </div>
          </div>

          <div className="mb-1 text-[11px] font-semibold text-slate-300">Keywords</div>
          <div className="mb-2 flex flex-wrap gap-1 text-[10px] text-slate-300">
            {unit.keywords.map((kw) => (
              <span
                key={kw}
                className="rounded-full bg-slate-800 px-2 py-[1px] text-[10px] uppercase tracking-wide"
              >
                {kw}
              </span>
            ))}
          </div>

          <div className="mb-1 text-[11px] font-semibold text-slate-300">Weapons</div>
          <div className="space-y-1">
            {primaryModel.weapons.map((w) => (
              <div
                key={w.name}
                className="rounded border border-slate-700 bg-slate-950/60 px-2 py-1 text-[10px]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{w.name}</span>
                  <span className="text-slate-400">{w.type.toUpperCase()}</span>
                </div>
                <div className="mt-[2px] grid grid-cols-6 gap-1">
                  <span>R: {w.range === 'melee' ? 'Melee' : `${w.range}"`}</span>
                  <span>A: {typeof w.attacks === 'number' ? w.attacks : w.attacks}</span>
                  <span>Skill: {w.skill}+</span>
                  <span>S: {w.strength}</span>
                  <span>AP: {w.ap}</span>
                  <span>D: {typeof w.damage === 'number' ? w.damage : w.damage}</span>
                </div>
                {w.keywords && w.keywords.length > 0 && (
                  <div className="mt-[2px] text-[9px] text-slate-400">
                    {w.keywords.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default UnitCard




