import { useGameStore } from '../../store/gameStore'
import { UnitToken } from './UnitToken'

const BOARD_WIDTH = 60
const BOARD_HEIGHT = 44

const Battlefield = () => {
  const units = useGameStore((state) => state.units)
  const selection = useGameStore((state) => state.selection)
  const selectUnit = useGameStore((state) => state.selectUnit)

  const handleUnitClick = (id: string) => {
    if (selection.selectedUnitId === id) {
      selectUnit(null)
    } else {
      selectUnit(id)
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

        <div className="relative z-10 h-full w-full">
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
                  onClick={() => handleUnitClick(unit.id)}
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


