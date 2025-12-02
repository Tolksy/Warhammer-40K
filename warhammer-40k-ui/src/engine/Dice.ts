import type { DiceValue } from '../types'

const rollSingleD6 = (): number => Math.floor(Math.random() * 6) + 1

export function rollD6(): number
export function rollD6(count: number): number[]
export function rollD6(count?: number): number | number[] {
  if (typeof count === 'number') {
    return Array.from({ length: count }, () => rollSingleD6())
  }
  return rollSingleD6()
}

export function rollDiceValue(value: DiceValue): number {
  if (typeof value === 'number') return value

  switch (value) {
    case 'D3': {
      const roll = rollSingleD6()
      return Math.ceil(roll / 2)
    }
    case 'D6':
      return rollSingleD6()
    case '2D6': {
      const rolls = rollD6(2) as number[]
      return rolls[0] + rolls[1]
    }
    default:
      return 0
  }
}

export const woundTargetNumber = (strength: number, toughness: number): number => {
  if (strength >= toughness * 2) return 2
  if (strength > toughness) return 3
  if (strength === toughness) return 4
  if (strength * 2 <= toughness) return 6
  return 5
}




