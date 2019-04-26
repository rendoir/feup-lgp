import axios from "axios";
import { getApiURL } from "./apiURL";

export async function apiGetUserInteractions(
  apiGroup: string,
  userId: number,
  subjectId: number
) {
  let body = {};
  switch (apiGroup) {
    case "users":
      body = {
        observer: userId,
        target: subjectId
      };
      break;

    case "post":
      body = {
        postId: subjectId,
        userId
      };
      break;
  }

  console.log("user interactions body", body);

  const apiUrl = getApiURL(`/${apiGroup}/user_interactions`);
  return axios.post(apiUrl, body);
}
