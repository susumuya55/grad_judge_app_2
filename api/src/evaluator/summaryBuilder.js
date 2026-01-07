/**
 * summary を構築する
 * - MVP仕様
 * - 代表理由は決めない
 * - 未達成のドメインIDをすべて列挙する
 */

function buildSummary(normalConditions, specialConditions) {
  const unmetDomains = new Set();

  // =========================
  // 通常条件から未達成ドメインを抽出
  // =========================
  for (const [domain, condition] of Object.entries(normalConditions)) {
    const requiredNotSatisfied = !condition.required.satisfied;
    const electiveNotSatisfied = !condition.elective.satisfied;

    if (requiredNotSatisfied || electiveNotSatisfied) {
      unmetDomains.add(domain);
    }
  }

  // =========================
  // 特殊条件から未達成ドメインを抽出
  // =========================
  for (const condition of Object.values(specialConditions)) {
    if (!condition.result.satisfied) {
      unmetDomains.add(condition.domain);
    }
  }

  // =========================
  // summary を返却
  // =========================
  return {
    isEligible: unmetDomains.size === 0,
    unmetDomains: Array.from(unmetDomains)
  };
}

module.exports = buildSummary;

