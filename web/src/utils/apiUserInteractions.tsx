import axiosInstance from "./axiosInstance";

export async function apiGetUserInteractions(
  apiGroup: string,
  subjectId: number
) {
  const apiUrl = `/${apiGroup}/${subjectId}/user_interactions`;
  return axiosInstance.post(apiUrl);
}
