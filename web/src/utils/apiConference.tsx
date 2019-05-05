import axios from "axios";
import { getApiURL } from "./apiURL";

export async function apiUserJoinConference(
  conferenceId: number
): Promise<boolean> {
  const apiURL = getApiURL(`/conference/${conferenceId}/add_participant`);
  try {
    await axios.post(apiURL);
    return true;
  } catch (error) {
    console.log("Failed to join conference");
    return false;
  }
}

export async function apiUserLeaveConference(
  conferenceId: number
): Promise<boolean> {
  const apiURL = getApiURL(`/conference/${conferenceId}/remove_participant`);
  try {
    await axios.delete(apiURL);
    return true;
  } catch (error) {
    console.log("Failed to leave conference");
    return false;
  }
}

export async function apiCheckUserConferenceParticipation(
  conferenceId: number
): Promise<boolean> {
  console.log("api verificar participação na conf ", conferenceId);
  const apiURL = getApiURL(`/conference/${conferenceId}/check_participation`);
  try {
    const res = await axios.get(apiURL);
    console.log("é participante ? ", res.data);
    return res.data.participant;
  } catch (error) {
    console.log("Failed to check participation");
    return false;
  }
}

export async function apiCheckUserCanJoinConference(
  conferenceId: number
): Promise<boolean> {
  console.log("api verificar participação na conf ", conferenceId);
  const apiURL = getApiURL(`/conference/${conferenceId}/check_user_access`);
  try {
    const res = await axios.get(apiURL);
    console.log("pode entrar ? ", res.data);
    return res.data.canJoin;
  } catch (error) {
    console.log("Failed to check participation");
    return false;
  }
}
