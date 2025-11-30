/**
 * Very small helper to create a reasonably unique ID for each unit instance.
 * This is not cryptographically secure, but is more than sufficient
 * for in-memory game state.
 */
const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

/**
 * Create a runtime unit instance from a unit template.
 * Adds a unique `id` and initialises `currentWounds` on each model
 * based on its profile's `stats.wounds`.
 *
 * @param {import('../types').UnitTemplate} template
 * @returns {import('../types').UnitInstance}
 */
export function createUnitInstance(template) {
  return {
    ...template,
    id: createId(),
    models: template.models.map((model) => ({
      ...model,
      currentWounds: model.stats.wounds,
    })),
  }
}


