import type { UnitInstance, Weapon } from '../types'
import { distanceBetween } from './Movement'
import { rollD6, rollDiceValue, woundTargetNumber } from './Dice'

export interface ShootingLogEntry {
  message: string
}

export interface ShootingResult {
  hits: number
  wounds: number
  unsavedWounds: number
  damageDealt: number
  slainModels: number
  logs: ShootingLogEntry[]
  updatedTarget: UnitInstance
  // Dice detail for UI dice tray
  hitRolls?: number[]
  woundRolls?: number[]
  saveRolls?: number[]
  damageRolls?: number[]
}

const getPrimaryProfile = (unit: UnitInstance) => unit.models[0]

const getSaveTarget = (weapon: Weapon, target: UnitInstance): number => {
  const primary = getPrimaryProfile(target)
  const baseSave = primary?.stats.save ?? 7

  // AP is stored as negative for AP- (e.g. -1). Higher final value is worse.
  const modified = baseSave - weapon.ap

  // 1s always fail, and a 7+ save is effectively impossible under normal rules.
  return Math.min(Math.max(modified, 2), 7)
}

const cloneUnit = (unit: UnitInstance): UnitInstance => ({
  ...unit,
  models: unit.models.map((m) => ({ ...m })),
})

const allocateDamage = (target: UnitInstance, damagePerWound: number[]): ShootingResult => {
  const updatedTarget = cloneUnit(target)
  let damageDealt = 0
  let slainModels = 0

  for (const dmg of damagePerWound) {
    if (dmg <= 0) continue

    const model = updatedTarget.models.find((m) => m.currentWounds > 0)
    if (!model) break

    const before = model.currentWounds
    const after = before - dmg

    if (after <= 0) {
      slainModels += 1
      damageDealt += before // no spillover to the next model
      model.currentWounds = 0
    } else {
      damageDealt += dmg
      model.currentWounds = after
    }
  }

  return {
    hits: 0,
    wounds: 0,
    unsavedWounds: damagePerWound.length,
    damageDealt,
    slainModels,
    logs: [],
    updatedTarget,
  }
}

export interface ShootingAttackInput {
  attacker: UnitInstance
  target: UnitInstance
  weapon: Weapon
}

export function resolveShootingAttack(input: ShootingAttackInput): ShootingResult {
  const { attacker, target, weapon } = input
  const logs: ShootingLogEntry[] = []

  if (weapon.type !== 'ranged' || weapon.range === 'melee') {
    return {
      hits: 0,
      wounds: 0,
      unsavedWounds: 0,
      damageDealt: 0,
      slainModels: 0,
      logs: [{ message: `${weapon.name} is not a ranged weapon.` }],
      updatedTarget: target,
      hitRolls: [],
      woundRolls: [],
      saveRolls: [],
      damageRolls: [],
    }
  }

  // 1. Check Range
  const attackerPos = attacker.position
  const targetPos = target.position
  const distance = distanceBetween(attackerPos, targetPos)

  if (typeof weapon.range === 'number' && distance > weapon.range) {
    return {
      hits: 0,
      wounds: 0,
      unsavedWounds: 0,
      damageDealt: 0,
      slainModels: 0,
      logs: [{ message: `${weapon.name} is out of range (${distance.toFixed(1)}").` }],
      updatedTarget: target,
      hitRolls: [],
      woundRolls: [],
      saveRolls: [],
      damageRolls: [],
    }
  }

  // 2. Hit Roll
  const attackCount = Math.max(0, rollDiceValue(weapon.attacks))
  const hitRolls = rollD6(attackCount) as number[]
  const hits = hitRolls.filter((r) => r >= weapon.skill).length

  logs.push({
    message: `${attacker.name} fires ${weapon.name}: ${attackCount} shots, ${hits} hits.`,
  })

  if (hits === 0) {
    return {
      hits,
      wounds: 0,
      unsavedWounds: 0,
      damageDealt: 0,
      slainModels: 0,
      logs,
      updatedTarget: target,
      hitRolls,
      woundRolls: [],
      saveRolls: [],
      damageRolls: [],
    }
  }

  // 3. Wound Roll
  const primaryTarget = getPrimaryProfile(target)
  const toughness = primaryTarget?.stats.toughness ?? 0
  const toWound = woundTargetNumber(weapon.strength, toughness)
  const woundRolls = rollD6(hits) as number[]
  const wounds = woundRolls.filter((r) => r >= toWound).length

  logs.push({
    message: `${weapon.name} attempts to wound on ${toWound}+: ${wounds} wounds.`,
  })

  if (wounds === 0) {
    return {
      hits,
      wounds,
      unsavedWounds: 0,
      damageDealt: 0,
      slainModels: 0,
      logs,
      updatedTarget: target,
      hitRolls,
      woundRolls,
      saveRolls: [],
      damageRolls: [],
    }
  }

  // 4. Save Roll
  const saveTarget = getSaveTarget(weapon, target)
  const saveRolls = rollD6(wounds) as number[]
  const successfulSaves = saveRolls.filter((r) => r !== 1 && r >= saveTarget).length
  const unsavedWounds = wounds - successfulSaves

  logs.push({
    message: `${target.name} makes saves on ${saveTarget}+: ${successfulSaves} saved, ${unsavedWounds} fail.`,
  })

  if (unsavedWounds <= 0) {
    return {
      hits,
      wounds,
      unsavedWounds: 0,
      damageDealt: 0,
      slainModels: 0,
      logs,
      updatedTarget: target,
      hitRolls,
      woundRolls,
      saveRolls,
      damageRolls: [],
    }
  }

  // 5. Damage and Allocation
  const damagePerWound: number[] = []
  for (let i = 0; i < unsavedWounds; i += 1) {
    damagePerWound.push(rollDiceValue(weapon.damage))
  }

  const allocation = allocateDamage(target, damagePerWound)

  logs.push({
    message: `${target.name} suffers ${allocation.damageDealt} damage, ${allocation.slainModels} models slain.`,
  })

  return {
    hits,
    wounds,
    unsavedWounds,
    damageDealt: allocation.damageDealt,
    slainModels: allocation.slainModels,
    logs,
    updatedTarget: allocation.updatedTarget,
    hitRolls,
    woundRolls,
    saveRolls,
    damageRolls: damagePerWound,
  }
}


