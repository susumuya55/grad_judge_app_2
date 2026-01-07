const rulebook = require("../rulebook/rulebook_2025");

const evaluateNormalConditions = require("./normalEvaluator");
const evaluateSpecialConditions = require("./specialEvaluator");
const buildSummary = require("./summaryBuilder");

function evaluate(request) {
  // ① user_info を構築
  const userInfo = {
    faculty: "engineering",
    group: request.group,
    program: request.program
  };

  // ② 通常条件の評価
  const normalConditions = evaluateNormalConditions(
    request,
    rulebook,
    userInfo
  );

  // ③ 特殊条件の評価
  const specialConditions = evaluateSpecialConditions(
    request,
    rulebook,
    userInfo
  );

  // ④ summary を作成
  const summary = buildSummary(
    normalConditions,
    specialConditions
  );

  // ⑤ 最終結果を組み立てる
  return {
    meta: {
      rulebookVersion: "2025",
      evaluatedAt: new Date().toISOString()
    },
    user_info: userInfo,
    summary,
    details: {
      normalConditions,
      specialConditions
    }
  };
}

module.exports = evaluate;
