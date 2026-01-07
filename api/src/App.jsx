import { useState } from "react";
import "./App.css";

/* ========= 共通UI部品 ========= */

function QuestionInput({ label, value, isValid, onChange }) {
  const handleChange = (e) => {
    const raw = e.target.value;

    if (raw === "") {
      onChange(null, false);
      return;
    }

    const num = Number(raw);
    if (Number.isInteger(num) && num >= 0) {
      onChange(num, true);
    } else {
      onChange(num, false);
    }
  };

  return (
    <div className="question-row">
      <label className="question-label">
        {label}
      </label>
      <input
        type="number"
        value={value ?? ""}
        onChange={handleChange}
        className={`question-input ${isValid ? "" : "invalid"}`}
      />
    </div>
  );
}


function MultiSelectQuestion({ prompt, options, value, onChange }) {
  const toggle = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <p>{prompt}</p>
      {options.map((opt) => (
        <label key={opt.id} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={value.includes(opt.id)}
            onChange={() => toggle(opt.id)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

function ProgramSelect({ value, onChange }) {
  const programs = [
    { id: "civil_environment", label: "土木環境プログラム" },
    { id: "architecture_urban", label: "建築都市プログラム" },
    { id: "engineering_design", label: "工学デザインプログラム" },
    { id: "information_systems", label: "情報システムプログラム" },
    { id: "medical_engineering", label: "医工学プログラム" },
    { id: "bio_application", label: "生物応用プログラム" }
  ];

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2>所属プログラム</h2>
      {programs.map((p) => (
        <label key={p.id} style={{ display: "block" }}>
          <input
            type="radio"
            name="program"
            checked={value === p.id}
            onChange={() => onChange(p.id)}
          />
          {p.label}
        </label>
      ))}
    </div>
  );
}

function ResultDetailTable({ normalConditions }) {
  if (!normalConditions) return null;

  const categoryLabels = {
    humanities: "人文社会科目",
    foreign_language: "外国語科目",
    natural_science: "自然科学科目",
    engineering_basic: "工学基礎科目",
    group_common: "学群共通科目",
    major: "専門科目"
  };

  const rows = [];

  Object.entries(normalConditions).forEach(([categoryKey, categoryValue]) => {
    const categoryLabel = categoryLabels[categoryKey];
    if (!categoryLabel) return;

    Object.entries(categoryValue).forEach(([type, data]) => {
      rows.push({
        condition: `${categoryLabel} ${type === "required" ? "必修" : "選択"}`,
        input: data.input,
        rule: data.rule,
        diff: data.diff,
        satisfied: data.satisfied
      });
    });
  });

  return (
    <table
      border="1"
      cellPadding="8"
      style={{ marginTop: "2rem", borderCollapse: "collapse" }}
    >
      <thead>
        <tr>
          <th>条件名</th>
          <th>入力</th>
          <th>必要単位</th>
          <th>差分</th>
          <th>合否</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            <td>{row.condition}</td>
            <td>{row.input}</td>
            <td>{row.rule}</td>
            <td>{row.diff}</td>
            <td>{row.satisfied ? "合格" : "不合格"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function UnmetConditionsSummary({ receivedJson, program }) {
  if (!receivedJson) return null;

  const unmetItems = [];

  const normalConditions = receivedJson.details?.normalConditions;

  // ===== 通常条件（単位不足） =====
  if (normalConditions) {
    const categoryLabels = {
      humanities: "人文社会科目",
      foreign_language: "外国語科目",
      natural_science: "自然科学科目",
      engineering_basic: "工学基礎科目",
      group_common: "学群共通科目",
      major: "専門科目"
    };

    Object.entries(normalConditions).forEach(
      ([categoryKey, categoryValue]) => {
        const categoryLabel = categoryLabels[categoryKey];
        if (!categoryLabel) return;

        Object.entries(categoryValue).forEach(([type, data]) => {
          if (data.diff < 0) {
            unmetItems.push({
              kind: "normal",
              message: `${categoryLabel}（${type === "required" ? "必修" : "選択"}）が ${Math.abs(
                data.diff
              )} 単位不足しています`
            });
          }
        });
      }
    );
  }

  // ===== 特殊条件：基礎科学 =====
  const basicScience =
    receivedJson.details?.specialConditions?.basic_science;

  if (basicScience && basicScience.result?.satisfied === false) {
    unmetItems.push({
      kind: "special",
      message:
        "基礎科学科目が未達成です。化学Ⅰ・物理学Ⅰ・生物学Ⅰの中から 2 科目を修得する必要があります。"
    });
  }

  // ===== 特殊条件：工学デザイン実習 =====
  const designPractice =
    receivedJson.details?.specialConditions?.engineering_design_practice;

  if (
    program === "engineering_design" &&
    designPractice &&
    designPractice.result?.satisfied === false
  ) {
    unmetItems.push({
      kind: "special",
      message:
        "工学デザイン実習が未達成です。工学デザイン実習Ⅲ・Ⅳ・Ⅴに該当する科目をそれぞれ 1 科目ずつ修得する必要があります。"
    });
  }

  return (
    <div>
      <h3>未達成条件</h3>

      {unmetItems.length === 0 ? (
        <p>不足なし</p>
      ) : (
        <ul>
          {unmetItems.map((item, idx) => (
            <li key={idx}>{item.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}


/* ========= App ========= */

export default function App() {
  const [program, setProgram] = useState(null);

  const [credits, setCredits] = useState({
    humanities: { required: null, elective: null },
    foreign_language: { required: null, elective: null },
    natural_science: { required: null, elective: null },
    engineering_basic: { required: null, elective: null },
    group_common: { required: null, elective: null },
    major: { required: null, elective: null }
  });

  const [validations, setValidations] = useState({});
  const [specialConditions, setSpecialConditions] = useState({
    basic_science_completed: [],
    design_practice_completed: []
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // デバッグ用
  const [sentJson, setSentJson] = useState(null);
  const [receivedJson, setReceivedJson] = useState(null);

  const updateValue = (category, type, value, isValid) => {
    setCredits((prev) => ({
      ...prev,
      [category]: { ...prev[category], [type]: value }
    }));

    setValidations((prev) => ({
      ...prev,
      [`${category}_${type}`]: isValid
    }));
  };




  const buildSpecialConditionsForRequest = () => {
    const result = {
      basic_science_completed: specialConditions.basic_science_completed
    };

    const selected = specialConditions.design_practice_completed;

    result.design_practice_3 = selected.includes("design_practice_3");
    result.design_practice_4 = selected.includes("design_practice_4");
    result.design_practice_5 = selected.includes("design_practice_5");

    return result;
  };


  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    setReceivedJson(null);

    if (!program) {
      setError("所属プログラムを選択してください");
      return;
    }

    const allValid = Object.values(validations).every((v) => v === true);
    if (!allValid) {
      setError("未入力または不正な単位入力があります");
      return;
    }

    const requestBody = {
      program,
      credits,
      specialConditions: buildSpecialConditionsForRequest()
    };

    setSentJson(requestBody);

    try {
      const res = await fetch("https://grad-judge-backend.onrender.com/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const data = await res.json();
      setResult(data.summary.isEligible === true);
      setReceivedJson(data);
    } catch (e) {
      setError(e.message);
    }
  };

  const questions = [
    ["人文社会科目 必修単位数", "humanities", "required"],
    ["人文社会科目 選択単位数", "humanities", "elective"],
    ["外国語科目 必修単位数", "foreign_language", "required"],
    ["外国語科目 選択単位数", "foreign_language", "elective"],
    ["自然科学科目 必修単位数", "natural_science", "required"],
    ["自然科学科目 選択単位数", "natural_science", "elective"],
    ["工学基礎科目 必修単位数", "engineering_basic", "required"],
    ["工学基礎科目 選択単位数", "engineering_basic", "elective"],
    ["学群共通科目 必修単位数", "group_common", "required"],
    ["学群共通科目 選択単位数", "group_common", "elective"],
    ["専門科目 必修単位数", "major", "required"],
    ["専門科目 選択単位数", "major", "elective"]
  ];

  const specialQuestions = [
    {
      id: "basic_science_completed",
      prompt: "以下から修得している科目をすべて選んでください",
      options: [
        { id: "physics", label: "物理学Ⅰ" },
        { id: "chemistry", label: "化学Ⅰ" },
        { id: "biology", label: "生物学Ⅰ" }
      ]
    },
    {
      id: "design_practice_completed",
      prompt:
        "あなたが工学デザインプログラムなら修得している科目をすべて選んでください",
      options: [
        { id: "design_practice_3", label: "工学デザイン実習Ⅲ" },
        { id: "design_practice_4", label: "工学デザイン実習Ⅳ" },
        { id: "design_practice_5", label: "工学デザイン実習Ⅴ" }
      ]
    }
  ];

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>卒業判定</h1>

      <ProgramSelect value={program} onChange={setProgram} />

      {questions.map(([label, category, type]) => {
        const key = `${category}_${type}`;
        return (
          <QuestionInput
            key={key}
            label={label}
            value={credits[category][type]}
            isValid={validations[key] !== false}
            onChange={(value, isValid) =>
              updateValue(category, type, value, isValid)
            }
          />
        );
      })}

      {specialQuestions.map((q) => (
        <MultiSelectQuestion
          key={q.id}
          prompt={q.prompt}
          options={q.options}
          value={specialConditions[q.id]}
          onChange={(next) =>
            setSpecialConditions((prev) => ({
              ...prev,
              [q.id]: next
            }))
          }
        />
      ))}

      <button onClick={handleSubmit} style={{ marginTop: "2rem" }}>
        判定する
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result !== null && (
        <>
          <h2>{result ? "卒業できます" : "卒業できません"}</h2>
          <p>
            ※ 本判定は、令和6年度 学生便覧記載の卒業要件に基づいています。
            </p>

          <UnmetConditionsSummary receivedJson={receivedJson} program={program} />
          
          <h3>判定詳細</h3>
          <ResultDetailTable normalConditions={receivedJson?.details?.normalConditions} />







        </>
      )}
    </div>
  );
}
