import axios from "axios";
import { getApiURL } from "./apiURL";

export async function apiUserJoinTalk(talkId: number): Promise<boolean> {
  const apiURL = getApiURL(`/talk/${talkId}/add_participant`);
  try {
    await axios.post(apiURL);
    return true;
  } catch (error) {
    console.log("Failed to join talk");
    return false;
  }
}

export async function apiUserLeaveTalk(talkId: number): Promise<boolean> {
  const apiURL = getApiURL(`/talk/${talkId}/remove_participant`);
  try {
    await axios.delete(apiURL);
    return true;
  } catch (error) {
    console.log("Failed to leave talk");
    return false;
  }
}

export async function apiCheckUserTalkParticipation(
  talkId: number
): Promise<boolean> {
  const apiURL = getApiURL(`/talk/${talkId}/check_participation`);
  try {
    const res = await axios.get(apiURL);
    return res.data.participant;
  } catch (error) {
    console.log("Failed to check participation");
    return false;
  }
}

export async function apiCheckUserCanJoinTalk(
  talkId: number
): Promise<boolean> {
  const apiURL = getApiURL(`/talk/${talkId}/check_user_access`);
  try {
    const res = await axios.get(apiURL);
    return res.data.canJoin;
  } catch (error) {
    console.log("Failed to check participation");
    return false;
  }
}
