/**
 * 通常条件（単位数）の評価を行う
 * - 必修 / 選択は対等
 * - 合計（total）は扱わない
 * - 判定は diff >= 0 かどうか
 *
 * 返却値は details.normalConditions にそのまま入る構造
 */

function evaluateNormalConditions(request, rulebook, userInfo) {
  const result = {};

  // =========================
  // 工学部 共通
  // =========================
  const common = rulebook.common;

  result.humanities = buildDiff(
    common.humanities,
    request.credits.humanities
  );

  result.foreign_language = buildDiff(
    common.foreign_language,
    request.credits.foreign_language
  );

  result.natural_science = buildDiff(
    common.natural_science,
    request.credits.natural_science
  );

  result.engineering_basic = buildDiff(
    common.engineering_basic,
    request.credits.engineering_basic
  );

  // =========================
  // 学群 共通
  // =========================
  const groupRule = rulebook.groups[userInfo.group];

  if (groupRule && groupRule.common_major) {
    result.group_common = buildDiff(
      groupRule.common_major,
      request.credits.group_common
    );
  }

  // =========================
  // プログラム 専門科目
  // =========================
  const programRule = rulebook.programs[userInfo.program];

  if (programRule && programRule.major) {
    result.major = buildDiff(
      programRule.major,
      request.credits.major
    );
  }

  return result;
}

/**
 * 必修・選択の差分を計算するヘルパー
 */
function buildDiff(rule, input) {
  return {
    required: {
      rule: rule.required,
      input: input.required,
      diff: input.required - rule.required,
      satisfied: input.required - rule.required >= 0
    },
    elective: {
      rule: rule.elective,
      input: input.elective,
      diff: input.elective - rule.elective,
      satisfied: input.elective - rule.elective >= 0
    }
  };
}

module.exports = evaluateNormalConditions;
