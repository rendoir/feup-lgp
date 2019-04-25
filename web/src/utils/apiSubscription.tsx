import axios from "axios";

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

  let postUrl = `${location.protocol}//${location.hostname}`;
  postUrl +=
    !process.env.NODE_ENV || process.env.NODE_ENV === "development"
      ? `:${process.env.REACT_APP_API_PORT}`
      : "/api";
  postUrl += `/${apiGroup}`;
  axios
    .post(`${postUrl}/${endpoint}`, body)
    .then(() => {
      return "boas";
    })
    .catch(() => {
      console.log("Subscription system failed");
      return false;
    });
}
