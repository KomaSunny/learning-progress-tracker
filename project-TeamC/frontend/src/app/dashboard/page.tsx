"use client";

import { LogoutButton } from "@/components/LogoutButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WoodenTitle } from "@/components/reports/WoodenTitle";
import { createReport } from "@/lib/reportsApi";
import type { ReportType } from "@/types/report";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function DashboardPage() {
  const router = useRouter();
  const [time, setTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [reportType, setReportType] = useState<ReportType>("daily_report");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString("ja-JP"));
      setTime(
        now.toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };

    updateDateTime();
    const timer = window.setInterval(updateDateTime, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await createReport({
        type: reportType,
        title:
          title.trim() || (reportType === "daily_report" ? "日報" : "進捗報告"),
        content: content.trim(),
        blockers: null,
        nextAction: nextAction.trim() || null,
        studyMinutes: null,
        understandingLevel: null,
      });

      setTitle("");
      setContent("");
      setNextAction("");
      router.push("/report-list");
    } catch {
      setErrorMessage("投稿に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <main
        style={{
          backgroundColor: "#f0f4f8",
          minHeight: "100vh",
          padding: "20px",
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
          fontWeight: 800,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 100,
          }}
        >
          <LogoutButton />
        </div>

        <WoodenTitle fontSize="36px">Dashboard</WoodenTitle>

        <button
          type="button"
          onClick={() => setShowCalendar((current) => !current)}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            backgroundColor: "white",
            padding: "10px 16px",
            borderRadius: "12px",
            border: "none",
            fontSize: "22px",
            fontWeight: 800,
            boxShadow: "2px 2px 6px rgba(0,0,0,0.3)",
            cursor: "pointer",
            zIndex: 100,
          }}
        >
          📅 {currentDate || "読み込み中"}
        </button>

        {showCalendar && (
          <div
            style={{
              position: "absolute",
              top: "70px",
              left: "20px",
              zIndex: 200,
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "4px 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <Calendar locale="ja-JP" />
          </div>
        )}

        <section
          style={{
            position: "relative",
            backgroundColor: "#4a9e6b",
            border: "16px solid #c8a165",
            borderRadius: "12px",
            padding: "30px",
            marginTop: "60px",
            minHeight: "350px",
            boxShadow: "8px 8px 0 #8b6233, 12px 12px 20px rgba(0,0,0,0.4)",
            outline: "4px solid #a07840",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "34px",
              fontWeight: 800,
              marginBottom: "16px",
              textShadow: "2px 2px 0 rgba(0,0,0,0.3)",
            }}
          >
            【学習報告】
          </h1>

          <fieldset
            style={{
              border: "none",
              padding: 0,
              margin: "0 0 20px",
              display: "flex",
              gap: "32px",
              flexWrap: "wrap",
            }}
          >
            <legend style={{ position: "absolute", left: "-9999px" }}>
              投稿種別
            </legend>

            {[
              {
                value: "daily_report" as const,
                label: "📝 日報",
                description: "今日やったこと・学んだことの報告",
              },
              {
                value: "progress_report" as const,
                label: "📊 進捗報告",
                description: "課題・プロジェクトの進み具合の報告",
              },
            ].map((option) => (
              <label
                key={option.value}
                style={{
                  color: "white",
                  fontSize: "26px",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <input
                  type="radio"
                  name="reportType"
                  value={option.value}
                  checked={reportType === option.value}
                  onChange={() => setReportType(option.value)}
                  style={{
                    width: "22px",
                    height: "22px",
                    cursor: "pointer",
                    marginTop: "6px",
                  }}
                />
                <span>
                  <span style={{ display: "block" }}>{option.label}</span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "17px",
                      fontWeight: 400,
                      opacity: 0.9,
                      marginTop: "4px",
                    }}
                  >
                    {option.description}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>

          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="タイトル（未入力の場合は自動設定）"
            maxLength={255}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "8px",
              border: "4px solid rgba(255,255,255,0.8)",
              backgroundColor: "transparent",
              color: "white",
              fontSize: "20px",
              boxSizing: "border-box",
              fontWeight: 700,
            }}
          />

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="ここに学習内容を書こう…"
            style={{
              width: "100%",
              height: "180px",
              padding: "12px",
              borderRadius: "8px",
              border: "4px solid rgba(255,255,255,0.8)",
              backgroundColor: "transparent",
              color: "white",
              resize: "none",
              fontSize: "22px",
              boxSizing: "border-box",
              fontWeight: 700,
            }}
          />

          <input
            value={nextAction}
            onChange={(event) => setNextAction(event.target.value)}
            placeholder="次にやること（任意）"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "12px",
              borderRadius: "8px",
              border: "4px solid rgba(255,255,255,0.8)",
              backgroundColor: "transparent",
              color: "white",
              fontSize: "20px",
              boxSizing: "border-box",
              fontWeight: 700,
            }}
          />

          {errorMessage && (
            <p
              role="alert"
              style={{
                marginTop: "12px",
                color: "#fff",
                backgroundColor: "rgba(180, 30, 30, 0.75)",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              {errorMessage}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
              style={{
                backgroundColor: "white",
                color: "#4a3b2a",
                padding: "10px 24px",
                borderRadius: "20px",
                border: "none",
                fontSize: "20px",
                cursor:
                  isSubmitting || !content.trim() ? "not-allowed" : "pointer",
                fontWeight: 800,
                opacity: isSubmitting || !content.trim() ? 0.6 : 1,
                boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
              }}
            >
              {isSubmitting ? "送信中…" : "🚀 提出する"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/report-list")}
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                padding: "10px 24px",
                borderRadius: "20px",
                border: "2px solid rgba(255,255,255,0.8)",
                fontSize: "20px",
                cursor: "pointer",
                fontWeight: 800,
                boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
              }}
            >
              📋 一覧を見る
            </button>
          </div>

          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "20px",
              backgroundColor: "white",
              padding: "8px 12px",
              borderRadius: "10px",
              fontSize: "22px",
              fontWeight: 800,
              boxShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            🕐 {time || "--:--"}
          </div>

          <button
            type="button"
            aria-label="入力内容を消す"
            onClick={() => {
              setTitle("");
              setContent("");
              setNextAction("");
            }}
            style={{
              position: "absolute",
              bottom: "10px",
              right: "20px",
              width: "120px",
              height: "40px",
              backgroundColor: "#d9d9d9",
              borderRadius: "6px",
              border: "4px solid #8b6f47",
              boxShadow: "2px 2px 6px rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: "20px",
                height: "100%",
                backgroundColor: "#333",
                borderRadius: "2px",
              }}
            />
          </button>
        </section>
      </main>
    </ProtectedRoute>
  );
}
