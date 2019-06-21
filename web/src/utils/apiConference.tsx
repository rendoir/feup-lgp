import axiosInstance from './axiosInstance';

export async function apiUserJoinConference(
  conferenceId: number
): Promise<boolean> {
  const apiURL = `/conferences/${conferenceId}/add_participant`;
  try {
    await axiosInstance.post(apiURL);
    return true;
  } catch (error) {
    console.log('Failed to join conference');
    return false;
  }
}

export async function apiUserLeaveConference(
  conferenceId: number
): Promise<boolean> {
  const apiURL = `/conferences/${conferenceId}/remove_participant`;
  try {
    await axiosInstance.delete(apiURL);
    return true;
  } catch (error) {
    console.log('Failed to leave conference');
    return false;
  }
}

export async function apiCheckUserConferenceParticipation(
  conferenceId: number
): Promise<boolean> {
  const apiURL = `/conferences/${conferenceId}/check_participation`;
  try {
    const res = await axiosInstance.get(apiURL);
    return res.data.participant;
  } catch (error) {
    console.log('Failed to check participation');
    return false;
  }
}

export async function apiCheckUserCanJoinConference(
  conferenceId: number
): Promise<boolean> {
  const apiURL = `/conferences/${conferenceId}/check_user_access`;
  try {
    const res = await axiosInstance.get(apiURL);
    return res.data.canJoin;
  } catch (error) {
    console.log('Failed to check participation');
    return false;
  }
}
