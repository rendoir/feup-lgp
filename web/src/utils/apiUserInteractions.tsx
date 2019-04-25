import axios from "axios";

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

  let postUrl = `${location.protocol}//${location.hostname}`;
  postUrl +=
    !process.env.NODE_ENV || process.env.NODE_ENV === "development"
      ? `:${process.env.REACT_APP_API_PORT}`
      : "/api";
  postUrl += `/${apiGroup}`;
  axios
    .post(`${postUrl}/user_interactions`, body)
    .then(res => {
      console.log("apiUserInteraction recebeu: ", res.data);
      return res.data;
    })
    .catch(() => {
      console.log("Failed to get user interactions");
      return null;
    });
}
