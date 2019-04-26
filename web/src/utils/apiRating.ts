import axios from "axios";
import { getApiURL } from "./apiURL";

export async function apiRating(
  apiGroup: string,
  endpoint: string,
  userId: number,
  subjectId: number
) {
  let body = {};
  switch (apiGroup) {
    case "users":
      body = {
        evaluator: subjectId,
        target: userId
      };
      break;

    case "post":
      body = {
        postId: subjectId,
        userId
      };
      break;
  }

  console.log("rating body", body);

  const apiUrl = getApiURL(`/${apiGroup}/${endpoint}`);
  return axios.post(apiUrl, body);
}
