import axios from "axios";
import { getApiURL } from "../utils/apiURL";

export async function apiSubscription(
  apiGroup: string,
  endpoint: string,
  userId: number,
  subjectId: number
) {
  let body = {};
  switch (apiGroup) {
    case "users":
      body = {
        followed: subjectId,
        follower: userId
      };
      break;

    case "post":
      body = {
        postId: subjectId,
        userId
      };
      break;
  }

  console.log("subscription body", body);

  const apiUrl = getApiURL(`/${apiGroup}/${endpoint}`);
  return axios.post(apiUrl, body);
}
