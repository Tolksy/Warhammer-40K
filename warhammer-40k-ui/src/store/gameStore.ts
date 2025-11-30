import { create } from 'zustand'
import type { Position, UnitInstance } from '../types'
import { spaceMarineUnits } from '../data/space_marines'
import { necronUnits } from '../data/necrons'
import { createUnitInstance } from '../engine/UnitFactory'

export type Player = 'Player 1' | 'Player 2'

export type TurnPhase = 'COMMAND' | 'MOVEMENT' | 'SHOOTING' | 'CHARGE' | 'FIGHT'

export interface SelectionState {
  selectedUnitId: string | null
  targetUnitId: string | null
}

export interface CommandPoints {
  player1: number
  player2: number
}

export interface GameState {
  units: UnitInstance[]
  currentPlayer: Player
  turnPhase: TurnPhase
  turnNumber: number
  cp: CommandPoints
  selection: SelectionState

  selectUnit: (unitId: string | null) => void
  nextPhase: () => void
  addCP: (player: keyof CommandPoints, amount?: number) => void
}

const phaseOrder: TurnPhase[] = ['COMMAND', 'MOVEMENT', 'SHOOTING', 'CHARGE', 'FIGHT']

const BOARD_WIDTH = 60
const BOARD_HEIGHT = 44

const spawnLine = (count: number, y: number): Position[] => {
  if (count === 0) return []
  const segment = BOARD_WIDTH / (count + 1)
  return Array.from({ length: count }, (_, idx) => ({
    x: segment * (idx + 1),
    y,
  }))
}

const initialUnits: UnitInstance[] = (() => {
  const marinePositions = spawnLine(spaceMarineUnits.length, 8)
  const necronPositions = spawnLine(necronUnits.length, BOARD_HEIGHT - 8)

  const marines = spaceMarineUnits.map((template, index) =>
    createUnitInstance(template, marinePositions[index] ?? { x: 10 + index * 6, y: 8 }),
  )

  const necrons = necronUnits.map((template, index) =>
    createUnitInstance(template, necronPositions[index] ?? { x: 10 + index * 6, y: BOARD_HEIGHT - 8 }),
  )

  return [...marines, ...necrons]
})()

export const useGameStore = create<GameState>((set) => ({
  units: initialUnits,
  currentPlayer: 'Player 1',
  turnPhase: 'COMMAND',
  turnNumber: 1,
  cp: { player1: 0, player2: 0 },
  selection: { selectedUnitId: null, targetUnitId: null },

  selectUnit: (unitId) =>
    set((state) => ({
      selection: {
        ...state.selection,
        selectedUnitId: unitId,
      },
    })),

  nextPhase: () =>
    set((state) => {
      const currentIndex = phaseOrder.indexOf(state.turnPhase)

      // If for some reason the current phase is unknown or we're at the end,
      // wrap to COMMAND and hand the turn to the other player.
      if (currentIndex === -1 || currentIndex === phaseOrder.length - 1) {
        const isSecondPlayer = state.currentPlayer === 'Player 2'

        return {
          ...state,
          turnPhase: 'COMMAND' as TurnPhase,
          currentPlayer: isSecondPlayer ? ('Player 1' as Player) : ('Player 2' as Player),
          turnNumber: isSecondPlayer ? state.turnNumber + 1 : state.turnNumber,
        }
      }

      return {
        ...state,
        turnPhase: phaseOrder[currentIndex + 1],
      }
    }),

  addCP: (player, amount = 1) =>
    set((state) => ({
      ...state,
      cp: {
        ...state.cp,
        [player]: state.cp[player] + amount,
      },
    })),
}))


