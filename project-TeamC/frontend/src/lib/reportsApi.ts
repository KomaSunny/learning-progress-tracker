import { apiClient } from "@/lib/api";
import type { Report, ReportInput } from "@/types/report";

export async function getReports(): Promise<Report[]> {
  const response = await apiClient.get<Report[]>("/reports");
  return response.data;
}

export async function getReport(id: number): Promise<Report> {
  const response = await apiClient.get<Report>(`/reports/${id}`);
  return response.data;
}

export async function createReport(input: ReportInput): Promise<Report> {
  const response = await apiClient.post<Report>("/reports", input);
  return response.data;
}

export async function updateReport(
  id: number,
  input: ReportInput,
): Promise<Report> {
  const response = await apiClient.put<Report>(`/reports/${id}`, input);
  return response.data;
}

export async function deleteReport(id: number): Promise<void> {
  await apiClient.delete(`/reports/${id}`);
}
