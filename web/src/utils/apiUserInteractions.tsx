import axios from "axios";
import { getApiURL } from "../utils/apiURL";

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

  const apiUrl = getApiURL(`/${apiGroup}/${subjectId}/user_interactions`);
  return axios.post(apiUrl, body);
}
