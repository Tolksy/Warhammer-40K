import type { UnitTemplate } from '../types'

// NOTE: These stats are intended to be representative of 10th Edition datasheets
// for demo and testing purposes in the Grimdark Engine. If you want to be
// tournament-accurate, swap these out for your exact codex values.

export const spaceMarineUnits: UnitTemplate[] = [
  // Battleline – Intercessor Squad
  {
    name: 'Intercessor Squad',
    faction: 'Space Marines',
    role: 'Battleline',
    keywords: ['INFANTRY', 'BATTLELINE', 'INTERCESSORS', 'OC2'],
    models: [
      {
        name: 'Intercessor',
        stats: {
          movement: 6,
          toughness: 4,
          save: 3,
          wounds: 2,
          leadership: 6,
          objectiveControl: 2,
        },
        weapons: [
          {
            name: 'Bolt rifle',
            type: 'ranged',
            range: 24,
            attacks: 2,
            skill: 3,
            strength: 4,
            ap: -1,
            damage: 1,
            keywords: ['RAPID FIRE 1'],
          },
          {
            name: 'Astartes combat weapon',
            type: 'melee',
            range: 'melee',
            attacks: 3,
            skill: 3,
            strength: 4,
            ap: 0,
            damage: 1,
            keywords: [],
          },
        ],
      },
    ],
  },

  // Elite – Terminator Squad
  {
    name: 'Terminator Squad',
    faction: 'Space Marines',
    role: 'Elite',
    keywords: ['INFANTRY', 'TERMINATOR', 'ELITE', 'OC1'],
    models: [
      {
        name: 'Terminator',
        stats: {
          movement: 5,
          toughness: 5,
          save: 2,
          wounds: 3,
          leadership: 6,
          objectiveControl: 1,
        },
        weapons: [
          {
            name: 'Storm bolter',
            type: 'ranged',
            range: 24,
            attacks: 2,
            skill: 3,
            strength: 4,
            ap: 0,
            damage: 1,
            keywords: ['RAPID FIRE 2'],
          },
          {
            name: 'Power fist',
            type: 'melee',
            range: 'melee',
            attacks: 3,
            skill: 3,
            strength: 8,
            ap: -2,
            damage: 2,
            keywords: ['ANTI-VEHICLE 3+'],
          },
        ],
      },
    ],
  },

  // Vehicle – Predator Destructor
  {
    name: 'Predator Destructor',
    faction: 'Space Marines',
    role: 'Vehicle',
    keywords: ['VEHICLE', 'TANK', 'PREDATOR', 'OC3'],
    models: [
      {
        name: 'Predator Destructor',
        stats: {
          movement: 10,
          toughness: 10,
          save: 3,
          wounds: 11,
          leadership: 7,
          objectiveControl: 3,
        },
        weapons: [
          {
            name: 'Predator autocannon',
            type: 'ranged',
            range: 48,
            attacks: 4,
            skill: 3,
            strength: 9,
            ap: -1,
            damage: 3,
            keywords: ['TWIN-LINKED'],
          },
          {
            name: 'Sponson heavy bolters',
            type: 'ranged',
            range: 36,
            attacks: 6,
            skill: 3,
            strength: 5,
            ap: -1,
            damage: 2,
            keywords: [],
          },
        ],
      },
    ],
  },
]



