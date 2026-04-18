import { SavedPlan } from '../types'

const PLANS_KEY = 'study_timer_plans'

export function loadPlans(): SavedPlan[] {
  try {
    const raw = localStorage.getItem(PLANS_KEY)
    return raw ? (JSON.parse(raw) as SavedPlan[]) : []
  } catch {
    return []
  }
}

export function savePlan(plan: SavedPlan): void {
  const plans = loadPlans().filter((p) => p.id !== plan.id)
  localStorage.setItem(PLANS_KEY, JSON.stringify([plan, ...plans]))
}

export function deletePlan(id: string): void {
  const plans = loadPlans().filter((p) => p.id !== id)
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans))
}
