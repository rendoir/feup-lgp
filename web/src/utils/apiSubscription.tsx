import axiosInstance from "./axiosInstance";

export async function apiSubscription(
  apiGroup: string,
  endpoint: string,
  userId: number,
  subjectId: number
) {
  let body = {};
  switch (apiGroup) {
    case "users":
      body = { follower: userId };
      break;

    case "post":
      body = { userId };
      break;
  }

  const apiUrl = `/${apiGroup}/${subjectId}/${endpoint}`;
  return axiosInstance.post(apiUrl, body);
}
