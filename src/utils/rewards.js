// Can this member redeem this reward right now? Returns { ok, reason }.
export function rewardState(reward, points, tierId, tiers) {
  if (reward.minTier) {
    const need = tiers.findIndex((t) => t.id === reward.minTier)
    const have = tiers.findIndex((t) => t.id === tierId)
    if (have < need) return { ok: false, reason: `${tiers[need].name} members only` }
  }
  if (points < reward.cost) return { ok: false, reason: `${(reward.cost - points).toLocaleString()} more points needed` }
  return { ok: true, reason: '' }
}
