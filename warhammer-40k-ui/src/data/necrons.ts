import type { UnitTemplate } from '../types'

// NOTE: These stats are intended to be representative of 10th Edition datasheets
// for demo and testing purposes in the Grimdark Engine. If you want to be
// tournament-accurate, swap these out for your exact codex values.

export const necronUnits: UnitTemplate[] = [
  // Battleline – Necron Warriors
  {
    name: 'Necron Warriors',
    faction: 'Necrons',
    role: 'Battleline',
    keywords: ['INFANTRY', 'BATTLELINE', 'NECRON WARRIORS', 'REANIMATION', 'OC2'],
    models: [
      {
        name: 'Necron Warrior',
        stats: {
          movement: 5,
          toughness: 4,
          save: 4,
          wounds: 1,
          leadership: 7,
          objectiveControl: 2,
        },
        weapons: [
          {
            name: 'Gauss flayer',
            type: 'ranged',
            range: 24,
            attacks: 1,
            skill: 4,
            strength: 4,
            ap: -1,
            damage: 1,
            keywords: ['RAPID FIRE 1'],
          },
          {
            name: 'Close combat weapon',
            type: 'melee',
            range: 'melee',
            attacks: 2,
            skill: 4,
            strength: 4,
            ap: 0,
            damage: 1,
            keywords: [],
          },
        ],
      },
    ],
  },

  // Elite – Immortals
  {
    name: 'Necron Immortals',
    faction: 'Necrons',
    role: 'Elite',
    keywords: ['INFANTRY', 'IMMORTALS', 'OC2'],
    models: [
      {
        name: 'Necron Immortal',
        stats: {
          movement: 5,
          toughness: 5,
          save: 3,
          wounds: 2,
          leadership: 7,
          objectiveControl: 2,
        },
        weapons: [
          {
            name: 'Gauss blaster',
            type: 'ranged',
            range: 24,
            attacks: 2,
            skill: 3,
            strength: 5,
            ap: -1,
            damage: 1,
            keywords: ['RAPID FIRE 1'],
          },
          {
            name: 'Close combat weapon',
            type: 'melee',
            range: 'melee',
            attacks: 2,
            skill: 4,
            strength: 5,
            ap: 0,
            damage: 1,
            keywords: [],
          },
        ],
      },
    ],
  },

  // Vehicle – Doomsday Ark
  {
    name: 'Doomsday Ark',
    faction: 'Necrons',
    role: 'Vehicle',
    keywords: ['VEHICLE', 'TANK', 'DOOMSDAY ARK', 'OC4'],
    models: [
      {
        name: 'Doomsday Ark',
        stats: {
          movement: 10,
          toughness: 11,
          save: 3,
          wounds: 14,
          leadership: 7,
          objectiveControl: 4,
        },
        weapons: [
          {
            name: 'Doomsday cannon (focused)',
            type: 'ranged',
            range: 72,
            attacks: 1,
            skill: 3,
            strength: 16,
            ap: -4,
            damage: 'D6',
            keywords: ['BLAST'],
          },
          {
            name: 'Gauss flayer arrays',
            type: 'ranged',
            range: 24,
            attacks: 12,
            skill: 3,
            strength: 4,
            ap: -1,
            damage: 1,
            keywords: ['RAPID FIRE 3'],
          },
        ],
      },
    ],
  },
]


