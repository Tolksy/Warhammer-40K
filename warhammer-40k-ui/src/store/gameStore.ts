import { create } from 'zustand'
import type { PlayerId, Position, UnitInstance } from '../types'
import { spaceMarineUnits } from '../data/space_marines'
import { necronUnits } from '../data/necrons'
import { createUnitInstance } from '../engine/UnitFactory'
import { validateMove } from '../engine/Movement'
import { rollD6 } from '../engine/Dice'
import { resolveShootingAttack, type ShootingResult } from '../engine/ShootingPhase'

export type Player = PlayerId

export type TurnPhase = 'COMMAND' | 'MOVEMENT' | 'SHOOTING' | 'CHARGE' | 'FIGHT'

export interface BattleLogEntry {
  id: string
  text: string
  turn: number
  phase: TurnPhase
}

export interface DiceRollSummary {
  hits?: number[]
  wounds?: number[]
  saves?: number[]
  damage?: number[]
}

export interface VictoryPoints {
  player1: number
  player2: number
}

export interface ObjectiveMarker extends Position {
  id: string
}

export type GameView = 'MENU' | 'SETUP' | 'SKIRMISH'

export type FactionId = 'Space Marines' | 'Necrons'

export type SkirmishSize = 'PATROL' | 'INCURSION' | 'STRIKE_FORCE'

export interface SkirmishConfig {
  player1Faction: FactionId | null
  player2Faction: FactionId | null
  size: SkirmishSize | null
}

export interface SelectionState {
  selectedUnitId: string | null
  targetUnitId: string | null
}

export interface CommandPoints {
  player1: number
  player2: number
}

export interface MoveActionResult {
  success: boolean
  message: string
  distance: number
  maxDistance: number
}

export interface GameState {
  units: UnitInstance[]
  gameView: GameView
  currentPlayer: Player
  turnPhase: TurnPhase
  turnNumber: number
  cp: CommandPoints
  /** Victory points for each player */
  vp: VictoryPoints
  selection: SelectionState
  battleLog: BattleLogEntry[]
  /** Last dice rolls, for dice tray UI */
  diceRolls: DiceRollSummary | null
  objectiveMarkers: ObjectiveMarker[]
  config: SkirmishConfig

  selectUnit: (unitId: string | null) => void
  setTargetUnit: (unitId: string | null) => void
  nextPhase: () => void
  addCP: (player: keyof CommandPoints, amount?: number) => void
  moveUnit: (unitId: string, target: Position, opts?: { advance?: boolean }) => MoveActionResult
  resolveShooting: (attackerId: string, targetId: string, weaponIndex: number) => ShootingResult | null
  clearDiceRolls: () => void
  resolveBattleshock: () => void
  scoreObjectivesForCurrentPlayer: () => void
  setConfig: (partial: Partial<SkirmishConfig>) => void
  startSkirmish: () => void
  resetGame: () => void
  setGameView: (view: GameView) => void
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

const defaultConfig: SkirmishConfig = {
  player1Faction: 'Space Marines',
  player2Faction: 'Necrons',
  size: 'PATROL',
}

const sizeToUnitCount: Record<SkirmishSize, number> = {
  PATROL: 3,
  INCURSION: 5,
  STRIKE_FORCE: 7,
}

const templatesForFaction = (faction: FactionId) =>
  faction === 'Space Marines' ? spaceMarineUnits : necronUnits

const createUnitsForConfig = (config: SkirmishConfig): UnitInstance[] => {
  if (!config.player1Faction || !config.player2Faction || !config.size) return []

  const maxUnits = sizeToUnitCount[config.size]

  const p1Templates = templatesForFaction(config.player1Faction).slice(0, maxUnits)
  const p2Templates = templatesForFaction(config.player2Faction).slice(0, maxUnits)

  const p1Positions = spawnLine(p1Templates.length, 8)
  const p2Positions = spawnLine(p2Templates.length, BOARD_HEIGHT - 8)

  const p1Units = p1Templates.map((template, index) =>
    createUnitInstance(template, 'Player 1', p1Positions[index] ?? { x: 10 + index * 6, y: 8 }),
  )

  const p2Units = p2Templates.map((template, index) =>
    createUnitInstance(
      template,
      'Player 2',
      p2Positions[index] ?? { x: 10 + index * 6, y: BOARD_HEIGHT - 8 },
    ),
  )

  return [...p1Units, ...p2Units]
}

const createLogId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const OBJECTIVES: ObjectiveMarker[] = [
  { id: 'obj-center', x: BOARD_WIDTH / 2, y: BOARD_HEIGHT / 2 },
  { id: 'obj-left', x: BOARD_WIDTH * 0.25, y: BOARD_HEIGHT / 2 },
  { id: 'obj-right', x: BOARD_WIDTH * 0.75, y: BOARD_HEIGHT / 2 },
]

export const useGameStore = create<GameState>((set, get) => ({
  units: [],
  gameView: 'MENU',
  currentPlayer: 'Player 1',
  turnPhase: 'COMMAND',
  turnNumber: 1,
  cp: { player1: 0, player2: 0 },
  vp: { player1: 0, player2: 0 },
  selection: { selectedUnitId: null, targetUnitId: null },
  battleLog: [],
  diceRolls: null,
  objectiveMarkers: OBJECTIVES,
  config: defaultConfig,

  selectUnit: (unitId) =>
    set((state) => ({
      selection: {
        ...state.selection,
        selectedUnitId: unitId,
        // Reset target when changing selected unit
        targetUnitId: unitId === null ? null : state.selection.targetUnitId,
      },
    })),

  setTargetUnit: (unitId) =>
    set((state) => ({
      selection: {
        ...state.selection,
        targetUnitId: unitId,
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

  moveUnit: (unitId, target, opts) => {
    let result: MoveActionResult = {
      success: false,
      message: 'Unknown error',
      distance: 0,
      maxDistance: 0,
    }

    set((state) => {
      const unit = state.units.find((u) => u.id === unitId)
      if (!unit) {
        result = {
          success: false,
          message: 'Unit not found.',
          distance: 0,
          maxDistance: 0,
        }
        return state
      }

      const advanceRoll = opts?.advance ? (rollD6() as number) : 0
      const validation = validateMove(unit, target.x, target.y, {
        advanceRoll: advanceRoll || undefined,
      })

      result = {
        success: validation.valid,
        message: validation.valid
          ? opts?.advance && advanceRoll
            ? `Advanced ${validation.distance.toFixed(1)}" (M + ${advanceRoll}).`
            : `Moved ${validation.distance.toFixed(1)}".`
          : validation.reason ?? 'Move is not valid.',
        distance: validation.distance,
        maxDistance: validation.maxDistance,
      }

      if (!validation.valid) {
        return state
      }

      const units = state.units.map((u) =>
        u.id === unitId
          ? {
              ...u,
              position: {
                x: target.x,
                y: target.y,
              },
            }
          : u,
      )

      const newLog: BattleLogEntry = {
        id: createLogId(),
        text: `${state.currentPlayer} – MOVEMENT: ${unit.name} ${
          opts?.advance && advanceRoll ? 'advances' : 'moves'
        } to (${target.x.toFixed(1)}", ${target.y.toFixed(1)}").`,
        turn: state.turnNumber,
        phase: state.turnPhase,
      }

      return {
        ...state,
        units,
        battleLog: [...state.battleLog, newLog],
      }
    })

    return result
  },

  resolveShooting: (attackerId, targetId, weaponIndex) => {
    const state = get()
    const attacker = state.units.find((u) => u.id === attackerId)
    const target = state.units.find((u) => u.id === targetId)

    if (!attacker || !target) return null

    const primaryModel = attacker.models[0]
    const weapon = primaryModel?.weapons[weaponIndex]
    if (!weapon) return null

    const result = resolveShootingAttack({ attacker, target, weapon })

    set((prev) => {
      const updatedUnits = prev.units
        .map((u) => (u.id === target.id ? result.updatedTarget : u))
        .filter((u) => u.models.some((m) => m.currentWounds > 0))

      const logEntries: BattleLogEntry[] = result.logs.map((entry) => ({
        id: createLogId(),
        text: `${prev.currentPlayer} – SHOOTING: ${entry.message}`,
        turn: prev.turnNumber,
        phase: prev.turnPhase,
      }))

      return {
        ...prev,
        units: updatedUnits,
        battleLog: [...prev.battleLog, ...logEntries],
        diceRolls: {
          hits: result.hitRolls,
          wounds: result.woundRolls,
          saves: result.saveRolls,
          damage: result.damageRolls,
        },
      }
    })

    return result
  },

  clearDiceRolls: () =>
    set((state) => ({
      ...state,
      diceRolls: null,
    })),

  resolveBattleshock: () => {
    const rollsDescription: string[] = []

    set((state) => {
      const units = state.units.map((unit) => {
        if (unit.owner !== state.currentPlayer) return unit

        const startingModels = unit.models.length
        const aliveModels = unit.models.filter((m) => m.currentWounds > 0).length

        if (aliveModels === 0 || aliveModels * 2 >= startingModels) {
          return { ...unit, battleshocked: false }
        }

        const rolls = rollD6(2) as number[]
        const total = rolls[0] + rolls[1]
        const leadership = unit.models[0]?.stats.leadership ?? 7
        const failed = total > leadership

        rollsDescription.push(
          `${unit.name}: rolled ${total} vs Ld ${leadership} → ${failed ? 'FAILED' : 'PASSED'}`,
        )

        return {
          ...unit,
          battleshocked: failed,
        }
      })

      const logText =
        rollsDescription.length > 0
          ? `Battleshock tests – ${rollsDescription.join('; ')}.`
          : 'No eligible units for Battleshock tests.'

      const newLog: BattleLogEntry = {
        id: createLogId(),
        text: `${state.currentPlayer} – COMMAND: ${logText}`,
        turn: state.turnNumber,
        phase: state.turnPhase,
      }

      return {
        ...state,
        units,
        battleLog: [...state.battleLog, newLog],
      }
    })
  },

  scoreObjectivesForCurrentPlayer: () => {
    set((state) => {
      const ocForUnit = (unit: UnitInstance): number => {
        if (unit.battleshocked) return 0
        const primary = unit.models[0]
        return primary?.stats.objectiveControl ?? 0
      }

      const distance = (a: Position, b: Position): number => {
        const dx = a.x - b.x
        const dy = a.y - b.y
        return Math.sqrt(dx * dx + dy * dy)
      }

      let totalOC = 0

      state.objectiveMarkers.forEach((obj) => {
        state.units.forEach((unit) => {
          if (unit.owner !== state.currentPlayer) return
          if (distance(unit.position, obj) <= 3) {
            totalOC += ocForUnit(unit)
          }
        })
      })

      const vpGain = totalOC

      const newVp: VictoryPoints = {
        ...state.vp,
        [state.currentPlayer === 'Player 1' ? 'player1' : 'player2']:
          state.vp[state.currentPlayer === 'Player 1' ? 'player1' : 'player2'] + vpGain,
      }

      const newLog: BattleLogEntry = {
        id: createLogId(),
        text: `${state.currentPlayer} scores ${vpGain} VP from objectives this Command phase.`,
        turn: state.turnNumber,
        phase: state.turnPhase,
      }

      return {
        ...state,
        vp: newVp,
        battleLog: [...state.battleLog, newLog],
      }
    })
  },

  setConfig: (partial) =>
    set((state) => ({
      ...state,
      config: {
        ...state.config,
        ...partial,
      },
    })),

  startSkirmish: () =>
    set((state) => {
      const units = createUnitsForConfig(state.config)

      if (units.length === 0) {
        return state
      }

      const newLog: BattleLogEntry = {
        id: createLogId(),
        text: `Skirmish started: Player 1 (${state.config.player1Faction}), Player 2 (${state.config.player2Faction}), size ${state.config.size}.`,
        turn: 1,
        phase: 'COMMAND',
      }

      return {
        ...state,
        units,
        gameView: 'SKIRMISH',
        currentPlayer: 'Player 1',
        turnPhase: 'COMMAND',
        turnNumber: 1,
        cp: { player1: 0, player2: 0 },
        vp: { player1: 0, player2: 0 },
        selection: { selectedUnitId: null, targetUnitId: null },
        battleLog: [newLog],
        diceRolls: null,
      }
    }),

  resetGame: () =>
    set((state) => ({
      ...state,
      units: [],
      gameView: 'MENU',
      currentPlayer: 'Player 1',
      turnPhase: 'COMMAND',
      turnNumber: 1,
      cp: { player1: 0, player2: 0 },
      vp: { player1: 0, player2: 0 },
      selection: { selectedUnitId: null, targetUnitId: null },
      battleLog: [],
      diceRolls: null,
    })),

  setGameView: (view) =>
    set((state) => ({
      ...state,
      gameView: view,
    })),
}))


