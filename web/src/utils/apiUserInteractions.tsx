import axiosInstance from "./axiosInstance";

export async function apiGetUserInteractions(
  apiGroup: string,
  userId: number,
  subjectId: number
) {
  let body = {};
  switch (apiGroup) {
    case "users":
      body = { observer: userId };
      break;

    case "post":
      body = { userId };
      break;
  }

  const apiUrl = `/${apiGroup}/${subjectId}/user_interactions`;
  return axiosInstance.post(apiUrl, body);
}
