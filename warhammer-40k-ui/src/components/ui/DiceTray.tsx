import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'

const DiceTray = () => {
  const { diceRolls, clearDiceRolls } = useGameStore((state) => ({
    diceRolls: state.diceRolls,
    clearDiceRolls: state.clearDiceRolls,
  }))

  useEffect(() => {
    if (!diceRolls) return
    const timeout = setTimeout(() => {
      clearDiceRolls()
    }, 2000)
    return () => clearTimeout(timeout)
  }, [diceRolls, clearDiceRolls])

  if (!diceRolls) return null

  const renderRow = (label: string, rolls?: number[]) => {
    if (!rolls || rolls.length === 0) return null
    return (
      <div className="mb-1 flex items-center gap-2 text-[10px] text-slate-200">
        <span className="w-14 text-right text-slate-400">{label}</span>
        <div className="flex flex-wrap gap-1">
          {rolls.map((r, idx) => (
            <div
              key={`${label}-${idx}-${r}`}
              className="flex h-5 w-5 items-center justify-center rounded bg-slate-800 text-[10px] font-semibold"
            >
              {r}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center">
      <div className="pointer-events-auto rounded-lg border border-slate-700 bg-slate-900/95 px-4 py-2 text-xs shadow-xl">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-200">
          Dice Tray
        </div>
        {renderRow('Hits', diceRolls.hits)}
        {renderRow('Wounds', diceRolls.wounds)}
        {renderRow('Saves', diceRolls.saves)}
        {renderRow('Damage', diceRolls.damage)}
      </div>
    </div>
  )
}

export default DiceTray



