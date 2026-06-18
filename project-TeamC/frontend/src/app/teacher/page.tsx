"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WoodenTitle } from "@/components/reports/WoodenTitle";
import { getReports } from "@/lib/reportsApi";
import type { Report } from "@/types/report";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TeacherPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        setReports(await getReports());
      } catch {
        setErrorMessage("投稿一覧の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    void loadReports();
  }, []);

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
          onClick={() => router.push("/dashboard")}
          style={backButtonStyle}
        >
          ダッシュボードへ戻る
        </button>

        <WoodenTitle fontSize="28px">先生用ページ</WoodenTitle>

        {errorMessage && <p role="alert">{errorMessage}</p>}
        {isLoading && <p>読み込み中...</p>}

        {!isLoading &&
          reports.map((report, index) => (
            <button
              type="button"
              key={report.id}
              onClick={() => router.push(`/detail/${report.id}`)}
              style={{
                display: "block",
                width: "100%",
                cursor: "pointer",
                padding: "16px",
                marginBottom: "12px",
                backgroundColor:
                  index % 2 === 0 ? "#ffe8d6" : "#ffffff",
                borderRadius: "8px",
                border: "1px solid #ddd",
                boxShadow: "2px 4px 8px rgba(0,0,0,0.15)",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                  flexWrap: "wrap",
                }}
              >
                <strong>{report.userName || "投稿者不明"}</strong>
                <span>
                  {new Date(report.createdAt).toLocaleString("ja-JP")}
                </span>
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

              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                {report.title}
              </div>
              <div style={{ whiteSpace: "pre-wrap" }}>{report.content}</div>
            </button>
          ))}
      </main>
    </ProtectedRoute>
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
