import axiosInstance from "./axiosInstance";

export async function apiInviteUser(
  inviteSubjectId: number,
  invitedUserId: number,
  inviteType: string // 'post' or 'talk'
): Promise<boolean> {
  const apiURL = `/${inviteType}/${inviteSubjectId}/invite`;
  const body = { invited_user: invitedUserId };

  try {
    await axiosInstance.post(apiURL, body);
    return true;
  } catch (error) {
    console.log("Failed to invite user");
    return false;
  }
}

export async function apiInviteSubscribers(
  inviteSubjectId: number,
  inviteType: string // 'post' or 'talk'
): Promise<boolean> {
  const apiURL = `/${inviteType}/${inviteSubjectId}/invite_subscribers`;

  try {
    await axiosInstance.post(apiURL);
    return true;
  } catch (error) {
    console.log("Failed to invite subscribers");
    return false;
  }
}

export async function apiGetUninvitedSubscribersAmount(
  inviteSubjectId: number,
  inviteType: string // 'post' or 'talk'
): Promise<number> {
  const apiURL = `/${inviteType}/${inviteSubjectId}/amount_uninvited_subscribers`;

  try {
    const res =
      inviteType === "talk"
        ? await axiosInstance.get(apiURL)
        : await axiosInstance.post(apiURL);

    return res.data.amountUninvitedSubscribers;
  } catch (error) {
    console.log("Failed to fetch uninvited subscribers amount");
    return -1;
  }
}

export async function apiGetUninvitedUsersInfo(
  inviteSubjectId: number,
  inviteType: string // 'post' or 'talk'
) {
  const apiURL = `/${inviteType}/${inviteSubjectId}/uninvited_users_info`;

  try {
    const res =
      inviteType === "talk"
        ? await axiosInstance.get(apiURL)
        : await axiosInstance.post(apiURL);

    return res.data.uninvitedUsers;
  } catch (error) {
    console.log("Failed to fetch uninvited users info");
    return null;
  }
}

export async function apiInviteNotified(inviteId: number): Promise<boolean> {
  const apiURL = `/users/1/invite_notified`;

  try {
    await axiosInstance.put(apiURL, { inviteId });
    return true;
  } catch (error) {
    console.log("Failed to set invite as notified");
    return false;
  }
}

export async function apiGetNotifications() {
  const apiURL = `/users/1/notifications`;

  try {
    const res = await axiosInstance.get(apiURL);
    return res.data.notifications;
  } catch (error) {
    console.log("Failed to get notifications");
    return null;
  }
}

export async function apiGetNotificationsAmount() {
  const apiURL = `/users/1/amount_notifications`;
  console.log("FETCHING USER NOTIFS AMOUNT...");
  try {
    const res = await axiosInstance.get(apiURL);
    console.log("QUANT USER NOTIFS: ", res.data.amountNotifications);
    return res.data.amountNotifications;
  } catch (error) {
    console.log(error);
    return 0;
  }
}
