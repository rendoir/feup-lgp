import axios from "axios";
import { getApiURL } from "./apiURL";

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

  const apiUrl = getApiURL(`/${apiGroup}/${subjectId}/${endpoint}`);
  return axios.post(apiUrl, body);
}
