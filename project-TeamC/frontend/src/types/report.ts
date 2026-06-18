export type ReportType = "daily_report" | "progress_report";

export type Report = {
  id: number;
  userId: number;
  userName: string;
  type: ReportType;
  title: string;
  content: string;
  blockers: string | null;
  nextAction: string | null;
  studyMinutes: number | null;
  understandingLevel: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ReportInput = {
  type: ReportType;
  title: string;
  content: string;
  blockers: string | null;
  nextAction: string | null;
  studyMinutes: number | null;
  understandingLevel: number | null;
};
