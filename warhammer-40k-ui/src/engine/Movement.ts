import type { Position, UnitInstance } from '../types'

export const BOARD_WIDTH = 60
export const BOARD_HEIGHT = 44

export interface MoveValidationOptions {
  /** If provided, treat this move as an Advance using M + D6 (or other roll) */
  advanceRoll?: number
}

export interface MoveValidationResult {
  valid: boolean
  distance: number
  maxDistance: number
  reason?: string
}

export const distanceBetween = (a: Position, b: Position): number => {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}

export const clampToBoard = (position: Position): Position => ({
  x: Math.min(Math.max(position.x, 0), BOARD_WIDTH),
  y: Math.min(Math.max(position.y, 0), BOARD_HEIGHT),
})

/**
 * Validate a normal move (or an Advance) for a unit.
 * Checks:
 *  - Target is on the battlefield
 *  - Distance does not exceed M (or M + advanceRoll for an Advance)
 */
export function validateMove(
  unit: UnitInstance,
  targetX: number,
  targetY: number,
  options: MoveValidationOptions = {},
): MoveValidationResult {
  const start = unit.position
  const target = clampToBoard({ x: targetX, y: targetY })

  const model = unit.models[0]
  const moveStat = model?.stats.movement ?? 0

  const baseMax = moveStat
  const maxDistance = baseMax + (options.advanceRoll ?? 0)
  const distance = distanceBetween(start, target)

  if (moveStat <= 0) {
    return {
      valid: false,
      distance,
      maxDistance,
      reason: 'Unit has no Movement characteristic.',
    }
  }

  if (distance > maxDistance) {
    return {
      valid: false,
      distance,
      maxDistance,
      reason: `Move exceeds maximum distance of ${maxDistance}"`,
    }
  }

  return {
    valid: true,
    distance,
    maxDistance,
  }
}




