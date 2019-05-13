import axiosInstance from "./axiosInstance";

// - Verify if a given user has reported a given content (Returns true if user has already reported that content, false if he hasn't)

export async function apiCheckPostUserReport(postId: number): Promise<boolean> {
  const apiURL = `/post/${postId}/report`;
  return await apiCheckContentUserReport(apiURL);
}

export async function apiCheckCommentUserReport(
  commentId: number
): Promise<boolean> {
  const apiURL = `/post/0/comment/${commentId}/report`;
  return await apiCheckContentUserReport(apiURL);
}

async function apiCheckContentUserReport(apiURL: string) {
  try {
    const res = await axiosInstance.get(apiURL);
    return res.data.report;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// - Issue a content report

export async function apiReportPost(postId: number, reason: string) {
  const apiURL = `/post/${postId}/report`;
  const body = { reason };
  axiosInstance
    .post(apiURL, body)
    .catch(() => console.log("Failed to report post"));
}

export async function apiReportComment(commentId: number, reason: string) {
  const apiURL = `/post/0/comment/${commentId}/report`;
  const body = { reason };
  axiosInstance
    .post(apiURL, body)
    .catch(() => console.log("Failed to report comment"));
}
