/**
 * 卒業要件ルールブック（2025年度）
 *
 * このファイルは「一次資料」をコード化したもの。
 * 判定ロジックは一切持たず、
 * Evaluator が参照するための定数定義のみを行う。
 */

const RULEBOOK_2025 = {
  // =========================
  // 工学部 共通ルール
  // =========================
  common: {
    humanities: {
      // 人文社会科学科目
      // 必修なし、選択12単位
      required: 0,
      elective: 12
    },

    foreign_language: {
      // 外国語科目
      // 英語必修8単位＋選択2単位（合計10）
      required: 8,
      elective: 2
    },

    natural_science: {
      // 自然科学科目
      // 必修6単位＋選択14単位（合計20）
      // ※特殊条件あり（下記 specialConditions 参照）
      required: 6,
      elective: 14
    },

    engineering_basic: {
      // 工学部基礎科目
      // 必修10単位のみ
      required: 10,
      elective: 0
    }
  },

  // =========================
  // 学群ルール
  // =========================
  groups: {
    // 建築都市環境 学群
    architecture_environment: {
      common_major: {
        // 学群共通専門科目
        // 必修18単位＋選択8単位（合計26）
        // ※卒業研究6単位を含むが、MVPでは判定不可
        required: 18,
        elective: 8
      }
    },

    // 情報生命 学群
    information_life: {
      common_major: {
        // 学群共通専門科目
        // 必修16単位＋選択10単位（合計26）
        // ※卒業研究6単位を含むが、MVPでは判定不可
        required: 16,
        elective: 10
      }
    }
  },

  // =========================
  // プログラム別ルール
  // =========================
  programs: {
    // 建築都市環境 学群
    civil_environment: {
      major: {
        required: 36,
        elective: 16
      }
    },

    architecture_urban: {
      major: {
        required: 35,
        elective: 17
      }
    },

    engineering_design: {
      major: {
        // 工学デザインプログラム
        // 必修8単位＋選択44単位
        required: 8,
        elective: 44
      }
      // ※特殊条件あり（下記 specialConditions 参照）
    },

    // 情報生命 学群
    information_systems: {
      major: {
        required: 28,
        elective: 24
      }
    },

    medical_engineering: {
      major: {
        required: 31,
        elective: 21
      }
    },

    bio_application: {
      major: {
        required: 38,
        elective: 14
      }
    }
  },

  // =========================
  // 特殊条件（論理モデル）
  // =========================
  specialConditions: {
    // 自然科学 基礎条件（全生徒）
    basic_science_two_of_three: {
      // 物理Ⅰ・化学Ⅰ・生物Ⅰのうち2科目以上修得
      type: "atLeast",
      count: 2,
      from: ["physics", "chemistry", "biology"]
    },

    // 工学デザイン実習（工学デザインプログラムのみ）
    engineering_design_practice: {
      // 工学デザイン実習Ⅲ・Ⅳ・Ⅴをすべて修得
      type: "all",
      required: [
        "design_practice_3",
        "design_practice_4",
        "design_practice_5"
      ]
    }
  }
};

module.exports = RULEBOOK_2025;
