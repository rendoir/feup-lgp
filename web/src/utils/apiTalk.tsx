import axiosInstance from './axiosInstance';

export async function apiUserJoinTalk(talkId: number): Promise<boolean> {
  const apiURL = `/talk/${talkId}/add_participant`;
  try {
    await axiosInstance.post(apiURL);
    return true;
  } catch (error) {
    console.log('Failed to join talk');
    return false;
  }
}

export async function apiUserLeaveTalk(talkId: number): Promise<boolean> {
  const apiURL = `/talk/${talkId}/remove_participant`;
  try {
    await axiosInstance.delete(apiURL);
    return true;
  } catch (error) {
    console.log('Failed to leave talk');
    return false;
  }
}

export async function apiCheckUserTalkParticipation(
  talkId: number
): Promise<boolean> {
  const apiURL = `/talk/${talkId}/check_participation`;
  try {
    const res = await axiosInstance.get(apiURL);
    return res.data.participant;
  } catch (error) {
    console.log('Failed to check participation');
    return false;
  }
}

export async function apiCheckUserCanJoinTalk(
  talkId: number
): Promise<boolean> {
  const apiURL = `/talk/${talkId}/check_user_access`;
  try {
    const res = await axiosInstance.get(apiURL);
    return res.data.canJoin;
  } catch (error) {
    console.log('Failed to check participation');
    return false;
  }
}
