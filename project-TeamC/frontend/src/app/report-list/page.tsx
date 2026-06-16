"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WoodenTitle } from "@/components/reports/WoodenTitle";
import { deleteReport, getReports } from "@/lib/reportsApi";
import type { Report } from "@/types/report";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./style.module.css";

export default function ReportListPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await getReports();
        setReports(data);
      } catch {
        setErrorMessage("投稿一覧の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    void loadReports();
  }, []);

  const dailyReports = useMemo(
    () => reports.filter((report) => report.type === "daily_report"),
    [reports],
  );

  const progressReports = useMemo(
    () => reports.filter((report) => report.type === "progress_report"),
    [reports],
  );

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("この投稿を削除しますか？");
    if (!confirmed) return;

    try {
      await deleteReport(id);
      setReports((current) =>
        current.filter((report) => report.id !== id),
      );
    } catch {
      setErrorMessage("投稿の削除に失敗しました。");
    }
  };

  return (
    <ProtectedRoute>
      <main className={styles.page}>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className={styles.backButton}
        >
          Dashboardへ戻る
        </button>

        <WoodenTitle>日報／進捗リスト</WoodenTitle>

        {errorMessage && (
          <p role="alert" className={styles.error}>
            {errorMessage}
          </p>
        )}

        {isLoading ? (
          <p>読み込み中...</p>
        ) : (
          <div className={styles.columns}>
            <ReportColumn
              title="📝 日報"
              reports={dailyReports}
              onDetail={(id) => router.push(`/detail/${id}`)}
              onEdit={(id) => router.push(`/edit/${id}`)}
              onDelete={handleDelete}
            />

            <ReportColumn
              title="📊 進捗報告"
              reports={progressReports}
              onDetail={(id) => router.push(`/detail/${id}`)}
              onEdit={(id) => router.push(`/edit/${id}`)}
              onDelete={handleDelete}
            />
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}

type ReportColumnProps = {
  title: string;
  reports: Report[];
  onDetail: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

function ReportColumn({
  title,
  reports,
  onDetail,
  onEdit,
  onDelete,
}: ReportColumnProps) {
  const grouped = useMemo(() => {
    return reports.reduce<Record<string, Report[]>>((result, report) => {
      const date = new Date(report.createdAt);
      const key = Number.isNaN(date.getTime())
        ? "日時不明"
        : `${date.getFullYear()}年${date.getMonth() + 1}月`;

      result[key] ??= [];
      result[key].push(report);
      return result;
    }, {});
  }, [reports]);

  const months = Object.keys(grouped);
  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>({});

  return (
    <section className={styles.column}>
      <div className={styles.columnHeader}>{title}</div>

      <div className={styles.columnBody}>
        {reports.length === 0 ? (
          <div className={styles.empty}>まだありません</div>
        ) : (
          months.map((month, monthIndex) => {
            const isOpen = openMonths[month] ?? monthIndex === 0;

            return (
              <div key={month} style={{ marginBottom: "12px" }}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenMonths((current) => ({
                      ...current,
                      [month]: !isOpen,
                    }))
                  }
                  className={styles.monthHeader}
                >
                  <span>
                    📅 {month}（{grouped[month].length}件）
                  </span>
                  <span>{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen && (
                  <div style={{ marginTop: "4px" }}>
                    {grouped[month].map((report, index) => (
                      <article
                        key={report.id}
                        className={[
                          styles.reportCard,
                          index % 2 === 0
                            ? styles.cardEven
                            : styles.cardOdd,
                        ].join(" ")}
                      >
                        <div className={styles.cardHeader}>
                          <button
                            type="button"
                            onClick={() => onDetail(report.id)}
                            style={{
                              border: "none",
                              background: "transparent",
                              padding: 0,
                              fontWeight: 700,
                              cursor: "pointer",
                              textAlign: "left",
                            }}
                          >
                            {report.title}
                          </button>

                          <div className={styles.actionArea}>
                            <button
                              type="button"
                              aria-label={`${report.title}を編集`}
                              onClick={() => onEdit(report.id)}
                              className={styles.iconButton}
                            >
                              ✏️
                            </button>

                            <button
                              type="button"
                              aria-label={`${report.title}を削除`}
                              onClick={() => onDelete(report.id)}
                              className={styles.iconButton}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        <div style={{ fontSize: "13px", color: "#666" }}>
                          {new Date(report.createdAt).toLocaleString("ja-JP")}
                        </div>

                        <p
                          style={{
                            marginTop: "6px",
                            fontSize: "15px",
                            color: "#333",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {report.content}
                        </p>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
