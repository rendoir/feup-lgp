import axios from "axios";
import { getApiURL } from "./apiURL";

// - Verify if a given user has reported a given content (Returns true if user has already reported that content, false if he hasn't)

export async function apiCheckPostUserReport(
  postId: number,
  userId: number
): Promise<boolean> {
  const apiURL = getApiURL(`/post/${postId}/check_report`);
  return await apiCheckContentUserReport(apiURL, userId);
}

export async function apiCheckCommentUserReport(
  commentId: number,
  userId: number
): Promise<boolean> {
  const apiURL = getApiURL(`/post/0/comment/${commentId}/check_report`);
  return await apiCheckContentUserReport(apiURL, userId);
}

async function apiCheckContentUserReport(apiURL: string, reporter: number) {
  try {
    const res = await axios.post(apiURL, { reporter });
    return res.data.report;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// - Issue a content report

export async function apiReportPost(
  postId: number,
  reporterId: number,
  reason: string
) {
  const apiURL = getApiURL(`/post/${postId}/report`);
  const body = { reporter: reporterId, reason };
  axios.post(apiURL, body).catch(() => console.log("Failed to report post"));
}

export async function apiReportComment(
  commentId: number,
  reporterId: number,
  reason: string
) {
  const apiURL = getApiURL(`/post/0/comment/${commentId}/report`);
  const body = { reporter: reporterId, reason };
  axios.post(apiURL, body).catch(() => console.log("Failed to report comment"));
}
