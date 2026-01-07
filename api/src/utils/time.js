/**
 * 特殊条件の評価を行う
 * - 条件を満たしているかどうか
 * - 未取得項目（missing）を列挙
 *
 * 返却値は details.specialConditions にそのまま入る構造
 */

function evaluateSpecialConditions(request, rulebook, userInfo) {
  const result = {};

  // =========================
  // 特殊条件①：自然科学（基礎条件）
  // 対象：全生徒
  // =========================
  const scienceRule =
    rulebook.specialConditions.basic_science_two_of_three;

  const completedScience =
    request.specialConditions.basic_science_completed || [];

  const earnedCount = completedScience.length;

  const scienceMissing = scienceRule.from.filter(
    subject => !completedScience.includes(subject)
  );

  result.basic_science = {
    domain: "natural_science",
    rule: {
      type: scienceRule.type,
      count: scienceRule.count,
      from: scienceRule.from
    },
    input: {
      completed: completedScience
    },
    result: {
      earnedCount,
      missing: scienceMissing,
      satisfied: earnedCount >= scienceRule.count
    }
  };

  // =========================
  // 特殊条件②：工学デザイン実習
  // 対象：工学デザインプログラムのみ
  // =========================
  if (userInfo.program === "engineering_design") {
    const designRule =
      rulebook.specialConditions.engineering_design_practice;

    const designMissing = [];

    if (!request.specialConditions.design_practice_3) {
      designMissing.push("design_practice_3");
    }
    if (!request.specialConditions.design_practice_4) {
      designMissing.push("design_practice_4");
    }
    if (!request.specialConditions.design_practice_5) {
      designMissing.push("design_practice_5");
    }

    result.engineering_design_practice = {
      domain: "major",
      rule: {
        type: designRule.type,
        required: designRule.required
      },
      input: {
        completed: designRule.required.filter(
          key => request.specialConditions[key]
        )
      },
      result: {
        missing: designMissing,
        satisfied: designMissing.length === 0
      }
    };
  }

  return result;
}

module.exports = evaluateSpecialConditions;
