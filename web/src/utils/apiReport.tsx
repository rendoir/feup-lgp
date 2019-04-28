import axios from "axios";
import { getApiURL } from "./apiURL";

// - Verify if a given user has reported a given content (Returns true if user has already reported that content, false if he hasn't)

export async function apiCheckPostUserReport(
  postId: number,
  userId: number
): Promise<boolean> {
  const apiURL = getApiURL(`/post/${postId}/check_report`);
  return await apiGetResult(apiURL, userId);
}

export async function apiCheckCommentUserReport(
  commentId: number,
  userId: number
): Promise<boolean> {
  const apiURL = getApiURL(`/post/0/comment/${commentId}/check_report`);
  return await apiGetResult(apiURL, userId);
}

// - Issue a content report (Returns true if report was issued successfully, false if it wasn't)

export async function apiReportPost(
  postId: number,
  reporterId: number
): Promise<boolean> {
  const apiURL = getApiURL(`/post/${postId}/report`);
  return await apiGetResult(apiURL, reporterId);
}

export async function apiReportComment(
  commentId: number,
  reporterId: number
): Promise<boolean> {
  const apiURL = getApiURL(`/post/0/comment/${commentId}/report`);
  return await apiGetResult(apiURL, reporterId);
}

async function apiGetResult(apiURL: string, userId: number) {
  try {
    const res = await axios.post(apiURL, { reporter: userId });
    return res.data.report;
  } catch (error) {
    console.log(error);
    return false;
  }
}
