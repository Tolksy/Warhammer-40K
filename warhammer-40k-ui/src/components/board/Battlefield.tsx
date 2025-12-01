import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { UnitToken } from './UnitToken'

const BOARD_WIDTH = 60
const BOARD_HEIGHT = 44

const Battlefield = () => {
  const units = useGameStore((state) => state.units)
  const selection = useGameStore((state) => state.selection)
  const selectUnit = useGameStore((state) => state.selectUnit)
  const setTargetUnit = useGameStore((state) => state.setTargetUnit)
  const moveUnit = useGameStore((state) => state.moveUnit)

  const [moveError, setMoveError] = useState<string | null>(null)

  const handleUnitClick = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    const clickedUnit = units.find((u) => u.id === id)

    if (!clickedUnit) return

    // Shift+click on a different unit sets it as target
    if (event.shiftKey && selection.selectedUnitId && selection.selectedUnitId !== id) {
      setTargetUnit(id)
      return
    }

    // Normal click selects the unit
    if (selection.selectedUnitId === id) {
      selectUnit(null)
      setTargetUnit(null)
    } else {
      selectUnit(id)
      // Clear target if selecting a new unit
      setTargetUnit(null)
    }
  }

  const handleBattlefieldClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!selection.selectedUnitId) return

    const rect = event.currentTarget.getBoundingClientRect()
    const relX = event.clientX - rect.left
    const relY = event.clientY - rect.top

    const x = (relX / rect.width) * BOARD_WIDTH
    const y = (relY / rect.height) * BOARD_HEIGHT

    const result = moveUnit(selection.selectedUnitId, { x, y })

    if (!result.success) {
      setMoveError(result.message)
    } else {
      setMoveError(null)
    }
  }

  return (
    <div className="relative w-full max-w-5xl rounded-xl border border-slate-700 bg-slate-900/80 p-4 shadow-xl">
      <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-400">
        <span>Battlefield 60&quot; x 44&quot;</span>
        <span>Grimdark Engine – Demo Deployment</span>
      </div>

      <div className="relative aspect-[60/44] overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
        {/* Subtle grid background for the battlefield */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#1f2937_1px,transparent_0)] [background-size:24px_24px]" />

        {moveError && (
          <div className="pointer-events-none absolute inset-x-4 top-2 z-20 rounded bg-red-900/90 px-3 py-1 text-xs text-red-100 shadow">
            {moveError}
          </div>
        )}

        <div
          className="relative z-10 h-full w-full"
          onClick={handleBattlefieldClick}
          role="presentation"
        >
          {units.map((unit) => {
            const { x, y } = unit.position
            const left = (x / BOARD_WIDTH) * 100
            const top = (y / BOARD_HEIGHT) * 100

            return (
              <div
                key={unit.id}
                className="absolute"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <UnitToken
                  unit={unit}
                  isSelected={selection.selectedUnitId === unit.id}
                  isTarget={selection.targetUnitId === unit.id}
                  onClick={(event) => handleUnitClick(event, unit.id)}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Battlefield


