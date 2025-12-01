export type Inches = number

export type PlayerId = 'Player 1' | 'Player 2'

export interface Position {
  /** X coordinate on a 60\" wide battlefield (inches) */
  x: number
  /** Y coordinate on a 44\" deep battlefield (inches) */
  y: number
}

export interface Stats {
  /** Movement characteristic in inches (e.g. 6 = 6\") */
  movement: Inches
  /** Toughness characteristic (e.g. 4, 5, 10) */
  toughness: number
  /** Armour Save, stored as the roll value (e.g. 3 = 3+) */
  save: number
  /** Wounds per model */
  wounds: number
  /** Leadership target on 2D6 (e.g. 6 = 6+) */
  leadership: number
  /** Objective Control characteristic */
  objectiveControl: number
}

export type WeaponRange = Inches | 'melee'

export type DiceValue = number | 'D3' | 'D6' | '2D6'

export interface Weapon {
  name: string
  /** 'ranged' or 'melee' for convenience when resolving phases */
  type: 'ranged' | 'melee'
  range: WeaponRange
  /** Attacks characteristic. Can be a flat number or a dice expression. */
  attacks: DiceValue
  /** To-hit value (BS or WS), stored as roll value (e.g. 3 = 3+) */
  skill: number
  strength: number
  /** Armour Penetration (AP). Use negative numbers for AP- (e.g. -1) */
  ap: number
  damage: DiceValue
  keywords?: string[]
}

export interface ModelProfile {
  name: string
  stats: Stats
  weapons: Weapon[]
}

export interface UnitTemplate {
  name: string
  faction: 'Space Marines' | 'Necrons' | (string & {})
  role: 'Battleline' | 'Elite' | 'Vehicle' | (string & {})
  keywords: string[]
  models: ModelProfile[]
}

export interface ModelInstance extends ModelProfile {
  /** Remaining wounds for this specific model on the table */
  currentWounds: number
}

export interface UnitInstance extends UnitTemplate {
  /** Unique runtime identifier for this unit on the battlefield */
  id: string
  /** Which player currently controls this unit */
  owner: PlayerId
  models: ModelInstance[]
  /** Current position of the unit on the battlefield */
  position: Position
  /** If true, this unit is currently battleshocked and has OC treated as 0 */
  battleshocked?: boolean
}


