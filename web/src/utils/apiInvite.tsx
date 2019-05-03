import axios from "axios";
import { getApiURL } from "./apiURL";

export async function apiInviteUser(
  inviteSubjectId: number,
  invitedUserId: number,
  inviteType: string // 'post' or 'conference'
): Promise<boolean> {
  const apiURL = getApiURL(`/${inviteType}/${inviteSubjectId}/invite`);
  const body = { invited_user: invitedUserId };

  try {
    await axios.post(apiURL, body);
    return true;
  } catch (error) {
    console.log("Failed to invite user");
    return false;
  }
}

export async function apiInviteSubscribers(
  inviteSubjectId: number,
  inviteType: string // 'post' or 'conference'
): Promise<boolean> {
  const apiURL = getApiURL(
    `/${inviteType}/${inviteSubjectId}/invite_subscribers`
  );

  try {
    await axios.post(apiURL, {});
    return true;
  } catch (error) {
    console.log("Failed to invite subscribers");
    return false;
  }
}

export async function apiInviteNotified(
  inviteSubjectId: number,
  inviteType: string // 'post' or 'conference'
): Promise<boolean> {
  const apiURL = getApiURL(`/conference/${inviteSubjectId}/invite_notified`);

  try {
    await axios.put(apiURL, {});
    return true;
  } catch (error) {
    console.log("Failed to set invite as notified");
    return false;
  }
}

export async function apiCheckUserConferenceParticipation(
  conferenceId: number
): Promise<boolean> {
  const apiURL = getApiURL(`/conference/${conferenceId}/invite_notified`);

  try {
    const res = await axios.put(apiURL, {});
    console.log("é participante ? ", res.data.participant);
    return res.data.participant;
  } catch (error) {
    console.log("Failed to check participation");
    return false;
  }
}
