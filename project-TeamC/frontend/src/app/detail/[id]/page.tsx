"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WoodenTitle } from "@/components/reports/WoodenTitle";
import { getReport } from "@/lib/reportsApi";
import type { Report } from "@/types/report";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const reportId = Number(params.id);
  const isValidReportId = Number.isInteger(reportId) && reportId > 0;

  const [report, setReport] = useState<Report | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isValidReportId) {
      return;
    }

    const loadReport = async () => {
      try {
        const data = await getReport(reportId);
        setReport(data);
      } catch {
        setErrorMessage("投稿の取得に失敗しました。");
      }
    };

    void loadReport();
  }, [isValidReportId, reportId]);

  return (
    <ProtectedRoute>
      <main
        style={{
          backgroundColor: "#f0f4f8",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <button
          type="button"
          onClick={() => router.push("/report-list")}
          style={backButtonStyle}
        >
          一覧へ戻る
        </button>

        <WoodenTitle fontSize="28px">日報詳細</WoodenTitle>

        {!isValidReportId && (
          <p role="alert">投稿IDが正しくありません。</p>
        )}

        {isValidReportId && errorMessage && (
          <p role="alert">{errorMessage}</p>
        )}

        {isValidReportId && !errorMessage && !report && (
          <p>読み込み中...</p>
        )}

        {isValidReportId && report && (
          <article
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #ddd",
              padding: "24px",
              boxShadow: "2px 4px 8px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
                flexWrap: "wrap",
              }}
            >
              <h1 style={{ margin: 0, fontSize: "22px" }}>
                {report.title}
              </h1>

              <span
                style={{
                  backgroundColor:
                    report.type === "progress_report"
                      ? "#8e44ad"
                      : "#2980b9",
                  color: "white",
                  padding: "2px 10px",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                {report.type === "progress_report"
                  ? "📊 進捗報告"
                  : "📝 日報"}
              </span>
            </div>

            <p style={{ color: "#666" }}>
              {new Date(report.createdAt).toLocaleString("ja-JP")}
            </p>

            {report.userName && (
              <p>
                <strong>投稿者：</strong>
                {report.userName}
              </p>
            )}

            <Section title="内容" value={report.content} />
            <Section title="困りごと" value={report.blockers} />
            <Section title="次にやること" value={report.nextAction} />

            {report.studyMinutes !== null && (
              <p>
                <strong>学習時間：</strong>
                {report.studyMinutes}分
              </p>
            )}

            {report.understandingLevel !== null && (
              <p>
                <strong>理解度：</strong>
                {report.understandingLevel} / 5
              </p>
            )}

            <button
              type="button"
              onClick={() => router.push(`/edit/${report.id}`)}
              style={{
                marginTop: "16px",
                padding: "8px 16px",
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              編集する
            </button>
          </article>
        )}
      </main>
    </ProtectedRoute>
  );
}

function Section({
  title,
  value,
}: {
  title: string;
  value: string | null;
}) {
  if (!value) {
    return null;
  }

  return (
    <section style={{ marginTop: "18px" }}>
      <h2 style={{ fontSize: "17px", marginBottom: "6px" }}>
        {title}
      </h2>
      <p style={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
        {value}
      </p>
    </section>
  );
}

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
