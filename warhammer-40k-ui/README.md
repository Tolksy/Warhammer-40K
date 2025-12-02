## Warhammer 40,000 – 10th Edition Skirmish Notes (Rules & Data Only)

This repository has been intentionally wiped of all source files and configuration.  
The only surviving document is this README, which records the **core rules and data structures** we previously used so you can rebuild the app from a true blank slate.

There is **no runnable code** left – only documentation.

---

## 1. Core Game Concepts (10th Edition Simplified)

This section captures the minimal “engine” rules for Warhammer 40,000 10th Edition skirmishes as we used them.

### 1.1 Stats

Each model in a unit has:

- **M (Movement, inches)** – how far the unit can move in the Movement phase.
- **T (Toughness)** – used in the wound roll (S vs T table).
- **Sv (Save)** – armour save, usually shown as `3+`, `4+` etc. Internally stored as the roll value (e.g. `3` for 3+).
- **W (Wounds)** – how many wounds the model can take before being destroyed.
- **Ld (Leadership)** – used for Battleshock (2D6 vs Ld).
- **OC (Objective Control)** – how much influence the unit has when controlling objectives.

### 1.2 Weapons

Each weapon profile has:

- **Type**: `'ranged'` or `'melee'`.
- **Range**: inches, or `'melee'` for close combat weapons.
- **Attacks (A)**: how many dice are rolled to hit. Can be:
  - a number (e.g. `2`),
  - or dice notation (`'D3'`, `'D6'`, `'2D6'`).
- **Skill**: target number to hit (BS or WS, e.g. `3` for 3+).
- **Strength (S)**: used vs target Toughness.
- **AP (Armour Penetration)**: negative values for AP- (e.g. `-1`, `-2`).
- **Damage (D)**: damage per unsaved wound (number or dice notation).
- **Keywords**: array of strings for rules like `RAPID FIRE`, `LETHAL HITS`, etc.

### 1.3 Units and Models

- A **ModelProfile** stores a model’s stats and its list of weapons.
- A **UnitTemplate** describes a unit:
  - `name`, `faction`, `role` (Battleline/Elite/Vehicle/etc),
  - `keywords`,
  - an array of `ModelProfile`.
- A **UnitInstance** (runtime unit on the table) adds:
  - `id` – unique identifier.
  - `owner` – `'Player 1'` or `'Player 2'`.
  - `position` – a board coordinate `(x, y)` in inches on a 60" x 44" battlefield.
  - `models` – models with `currentWounds` for each.

---

## 2. Board & Coordinate System

We used a standard 10th Edition board size for smaller games:

- **Board width**: 60"  
- **Board height**: 44"

All in-game positions and distances were in **inches**:

- `position.x` in `[0, 60]`
- `position.y` in `[0, 44]`

UI rendering (when it existed) converted inches to percentages of the board:

- `left% = (x / 60) * 100`
- `top%  = (y / 44) * 100`

---

## 3. Movement Rules (Engine-Level)

We had a dedicated movement helper that worked entirely in inches:

### 3.1 Distance

```ts
distanceBetween(a: Position, b: Position): number
```

- Returns the straight-line distance between two positions using Pythagoras:
  \[
  d = \sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}
  \]

### 3.2 Clamping to the Board

```ts
clampToBoard(position: Position): Position
```

- Ensures `x` is between `0` and `60`, and `y` between `0` and `44`.

### 3.3 Validate Move

```ts
validateMove(
  unit: UnitInstance,
  targetX: number,
  targetY: number,
  options?: { advanceRoll?: number },
): { valid: boolean; distance: number; maxDistance: number; reason?: string }
```

Logic:

1. Start = `unit.position`
2. Target = `clampToBoard({ x: targetX, y: targetY })`
3. Movement characteristic = `unit.models[0].stats.movement`
4. Maximum distance:
   - Normal move: `M`
   - Advance: `M + advanceRoll`
5. If distance > max → invalid with reason `"Move exceeds maximum distance of X""`.
6. Otherwise valid.

This function never changed the unit; it only answered “is this move allowed and how far is it?”.

---

## 4. Dice & Wound Table

### 4.1 Rolling Dice

We had a simple dice helper:

- `rollD6()` → single number 1–6.
- `rollD6(n)` → array of `n` numbers 1–6.
- `rollDiceValue(value: DiceValue)`:
  - If `value` is a number, return it.
  - If `'D3'` → roll D6, map 1–2 → 1, 3–4 → 2, 5–6 → 3.
  - If `'D6'` → roll a D6.
  - If `'2D6'` → roll two D6 and sum.

### 4.2 Wound Target Number (S vs T)

```ts
woundTargetNumber(strength: number, toughness: number): number
```

Rules:

- If `S ≥ 2T` → **2+**
- Else if `S > T` → **3+**
- Else if `S = T` → **4+**
- Else if `S < T` and `S > T/2` → **5+**
- Else if `S ≤ T/2` → **6+**

---

## 5. Shooting Sequence (Engine-Level)

### 5.1 Overview

Shooting was handled by a single function:

```ts
resolveShootingAttack({
  attacker: UnitInstance,
  target: UnitInstance,
  weapon: Weapon,
}): ShootingResult
```

Where `ShootingResult` contained:

- `hits: number`
- `wounds: number`
- `unsavedWounds: number`
- `damageDealt: number`
- `slainModels: number`
- `logs: { message: string }[]`
- `updatedTarget: UnitInstance` (with wounds applied)
- `hitRolls?: number[]`
- `woundRolls?: number[]`
- `saveRolls?: number[]`
- `damageRolls?: number[]`

### 5.2 Steps

1. **Check weapon is ranged**:
   - If `weapon.type !== 'ranged'` or `weapon.range === 'melee'` → abort with log “not a ranged weapon”.

2. **Check range**:
   - Compute `distanceBetween(attacker.position, target.position)`.
   - If `distance > weapon.range` → abort with log `"{weapon.name} is out of range (Xd)".`

3. **Hit Roll**:
   - Determine number of attacks:
     - `attacks = rollDiceValue(weapon.attacks)` (accounting for D6 / D3).
   - Roll that many D6:
     - `hitRolls = rollD6(attacks)`.
   - Hits = count of rolls `>= weapon.skill`.
   - Log: `"Attacker fires Weapon: A shots, H hits."`

4. **Wound Roll**:
   - Let `T` be target’s primary model Toughness.
   - Compute `toWound = woundTargetNumber(weapon.strength, T)`.
   - Roll `hits` D6:
     - `woundRolls = rollD6(hits)`.
   - Wounds = count of rolls `>= toWound`.
   - Log: `"Weapon attempts to wound on X+: Y wounds."`

5. **Save Roll**:
   - Let target’s base save be `Sv` from primary model.
   - Modified save:

     ```ts
     modifiedSave = Sv - weapon.ap
     // then clamp between 2 and 7; 1 always fails
     ```

   - Roll `wounds` D6:
     - `saveRolls = rollD6(wounds)`.
   - Successful saves = rolls where `roll !== 1 && roll >= modifiedSave`.
   - Unsaved wounds = `wounds - successfulSaves`.
   - Log: `"Target makes saves on S+: X saved, Y fail."`

6. **Damage & Allocation (no spillover)**:

   - For each unsaved wound:
     - Roll damage: `damageRolls[i] = rollDiceValue(weapon.damage)`.
   - Apply each damage value to the **current model** (with `currentWounds > 0`):
     - If damage ≥ remaining wounds:
       - Model dies.
       - Damage actually applied = remaining wounds (no extra spills to the next model).
     - Else:
       - Subtract damage from `currentWounds`.
   - Track:
     - `damageDealt` (total wounds lost across models),
     - `slainModels` (how many models reached 0 wounds).
   - Log: `"Target suffers X damage, Y models slain."`

The function returns a **new target** instance with updated `currentWounds`/models, leaving the original untouched.

---

## 6. Minimal Data Sets (Example Units)

We had the following representative unit templates (in TypeScript) for demo purposes.

### 6.1 Space Marines

- **Intercessor Squad (Battleline)**
  - M6, T4, Sv3+, W2, Ld6+, OC2.
  - Weapons:
    - Bolt rifle: 24", A2, BS3+, S4, AP-1, D1, `['RAPID FIRE 1']`.
    - Astartes combat weapon: melee, A3, WS3+, S4, AP0, D1.

- **Terminator Squad (Elite)**
  - M5, T5, Sv2+, W3, Ld6+, OC1.
  - Weapons:
    - Storm bolter: 24", A2, BS3+, S4, AP0, D1, `['RAPID FIRE 2']`.
    - Power fist: melee, A3, WS3+, S8, AP-2, D2, `['ANTI-VEHICLE 3+']`.

- **Predator Destructor (Vehicle)**
  - M10, T10, Sv3+, W11, Ld7+, OC3.
  - Weapons:
    - Predator autocannon: 48", A4, BS3+, S9, AP-1, D3, `['TWIN-LINKED']`.
    - Sponson heavy bolters: 36", A6, BS3+, S5, AP-1, D2.

### 6.2 Necrons

- **Necron Warriors (Battleline)**
  - M5, T4, Sv4+, W1, Ld7+, OC2.
  - Weapons:
    - Gauss flayer: 24", A1, BS4+, S4, AP-1, D1, `['RAPID FIRE 1']`.
    - Close combat weapon: melee, A2, WS4+, S4, AP0, D1.

- **Immortals (Elite)**
  - M5, T5, Sv3+, W2, Ld7+, OC2.
  - Weapons:
    - Gauss blaster: 24", A2, BS3+, S5, AP-1, D1, `['RAPID FIRE 1']`.
    - Close combat weapon: melee, A2, WS4+, S5, AP0, D1.

- **Doomsday Ark (Vehicle)**
  - M10, T11, Sv3+, W14, Ld7+, OC4.
  - Weapons:
    - Doomsday cannon (focused): 72", A1, BS3+, S16, AP-4, D`D6`, `['BLAST']`.
    - Gauss flayer arrays: 24", A12, BS3+, S4, AP-1, D1, `['RAPID FIRE 3']`.

---

## 7. How to Rebuild from Here

Since all source files are gone, you’ll start from scratch:

1. **Create a new Vite + React + TS project** in this folder or elsewhere.
2. **Copy/adapt the types and rules** from this README into your new code:
   - `Stats`, `Weapon`, `ModelProfile`, `UnitTemplate`, `UnitInstance`, etc.
   - `distanceBetween`, `validateMove`, `woundTargetNumber`, `resolveShootingAttack`.
3. **Seed your data** using the example Space Marines and Necrons units above (or replace with accurate codex data).
4. **Build the UI one step at a time**:
   - Start with a main menu and a single “Quick Start” button.
   - Add a simple settings screen.
   - Then a battlefield view that:
     - Shows a board,
     - Shows units at Positions (inches),
     - Lets you click to move (using `validateMove`),
     - Later, select & shoot using `resolveShootingAttack`.

This README is intentionally dense: it’s your **design doc and rule reference** so you never have to reverse-engineer the old code again.
