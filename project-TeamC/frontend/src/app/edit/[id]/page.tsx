"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getReport, updateReport } from "@/lib/reportsApi";
import type { ReportInput, ReportType } from "@/types/report";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const initialForm: ReportInput = {
  type: "daily_report",
  title: "",
  content: "",
  blockers: null,
  nextAction: null,
  studyMinutes: null,
  understandingLevel: null,
};

export default function EditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const reportId = Number(params.id);
  const isValidReportId =
    Number.isInteger(reportId) && reportId > 0;

  const [form, setForm] = useState<ReportInput>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isValidReportId) {
      return;
    }

    const loadReport = async () => {
      try {
        const report = await getReport(reportId);

        setForm({
          type: report.type,
          title: report.title,
          content: report.content,
          blockers: report.blockers,
          nextAction: report.nextAction,
          studyMinutes: report.studyMinutes,
          understandingLevel: report.understandingLevel,
        });
      } catch {
        setErrorMessage("投稿の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    void loadReport();
  }, [isValidReportId, reportId]);

  const updateField = <Key extends keyof ReportInput>(
    key: Key,
    value: ReportInput[Key],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (!isValidReportId) {
      return;
    }

    if (!form.title.trim() || !form.content.trim()) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await updateReport(reportId, {
        ...form,
        title: form.title.trim(),
        content: form.content.trim(),
        blockers: form.blockers?.trim() || null,
        nextAction: form.nextAction?.trim() || null,
      });

      router.push(`/detail/${reportId}`);
    } catch {
      setErrorMessage("投稿の更新に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <main
        style={{
          minHeight: "100vh",
          padding: "20px",
          backgroundColor: "#f0f4f8",
        }}
      >
        <button
          type="button"
          onClick={() =>
            isValidReportId
              ? router.push(`/detail/${reportId}`)
              : router.push("/report-list")
          }
          style={backButtonStyle}
        >
          戻る
        </button>

        <section
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            padding: "24px",
            borderRadius: "12px",
            backgroundColor: "white",
            boxShadow: "2px 4px 8px rgba(0,0,0,0.15)",
          }}
        >
          <h1>日報を編集する</h1>

          {!isValidReportId ? (
            <p role="alert">投稿IDが正しくありません。</p>
          ) : isLoading ? (
            <p>読み込み中...</p>
          ) : (
            <>
              {errorMessage && (
                <p role="alert">{errorMessage}</p>
              )}

              <label style={labelStyle}>
                投稿種別
                <select
                  value={form.type}
                  onChange={(event) =>
                    updateField(
                      "type",
                      event.target.value as ReportType,
                    )
                  }
                  style={inputStyle}
                >
                  <option value="daily_report">日報</option>
                  <option value="progress_report">進捗報告</option>
                </select>
              </label>

              <label style={labelStyle}>
                タイトル
                <input
                  value={form.title}
                  maxLength={255}
                  onChange={(event) =>
                    updateField("title", event.target.value)
                  }
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                内容
                <textarea
                  value={form.content}
                  onChange={(event) =>
                    updateField("content", event.target.value)
                  }
                  style={{
                    ...inputStyle,
                    height: "180px",
                    resize: "vertical",
                  }}
                />
              </label>

              <label style={labelStyle}>
                困りごと
                <textarea
                  value={form.blockers ?? ""}
                  onChange={(event) =>
                    updateField(
                      "blockers",
                      event.target.value || null,
                    )
                  }
                  style={{
                    ...inputStyle,
                    height: "90px",
                    resize: "vertical",
                  }}
                />
              </label>

              <label style={labelStyle}>
                次にやること
                <textarea
                  value={form.nextAction ?? ""}
                  onChange={(event) =>
                    updateField(
                      "nextAction",
                      event.target.value || null,
                    )
                  }
                  style={{
                    ...inputStyle,
                    height: "90px",
                    resize: "vertical",
                  }}
                />
              </label>

              <label style={labelStyle}>
                学習時間（分）
                <input
                  type="number"
                  min={0}
                  value={form.studyMinutes ?? ""}
                  onChange={(event) =>
                    updateField(
                      "studyMinutes",
                      event.target.value === ""
                        ? null
                        : Number(event.target.value),
                    )
                  }
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                理解度（1〜5）
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.understandingLevel ?? ""}
                  onChange={(event) =>
                    updateField(
                      "understandingLevel",
                      event.target.value === ""
                        ? null
                        : Number(event.target.value),
                    )
                  }
                  style={inputStyle}
                />
              </label>

              <button
                type="button"
                onClick={handleSave}
                disabled={
                  isSaving ||
                  !form.title.trim() ||
                  !form.content.trim()
                }
                style={{
                  marginTop: "12px",
                  padding: "8px 16px",
                  backgroundColor: "#4a9e6b",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  opacity: isSaving ? 0.6 : 1,
                }}
              >
                {isSaving ? "保存中..." : "保存する"}
              </button>
            </>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}

const labelStyle = {
  display: "grid",
  gap: "6px",
  marginTop: "16px",
  fontWeight: "bold",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "2px solid #ccc",
  borderRadius: "8px",
  boxSizing: "border-box" as const,
  fontSize: "16px",
};

const backButtonStyle = {
  position: "fixed" as const,
  top: "16px",
  right: "16px",
  padding: "8px 16px",
  backgroundColor: "#4a9e6b",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};
