import axiosInstance from "./axiosInstance";

export async function apiInviteUser(
  inviteSubjectId: number,
  invitedUserId: number,
  inviteType: string // 'post' or 'conference'
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
  inviteType: string // 'post' or 'conference'
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
  inviteType: string // 'post' or 'conference'
): Promise<number> {
  const apiURL = `/${inviteType}/${inviteSubjectId}/amount_uninvited_subscribers`;

  try {
    const res = await axiosInstance.get(apiURL);
    return res.data.amountUninvitedSubscribers;
  } catch (error) {
    console.log("Failed to invite subscribers");
    return -1;
  }
}

export async function apiGetUninvitedUsersInfo(
  inviteSubjectId: number,
  inviteType: string // 'post' or 'conference'
) {
  const apiURL = `/${inviteType}/${inviteSubjectId}/uninvited_users_info`;

  try {
    const res = await axiosInstance.get(apiURL);
    return res.data.uninvitedUsers;
  } catch (error) {
    console.log("Failed to invite subscribers");
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

// this is just a test function for cookies (not working)
async function setCookies(): Promise<void> {
  console.log("a fazer set das cookies");

  try {
    const res = axiosInstance.post(`/conference/set_cookies`);
    console.log("acabou de por cookies");
    // console.log("cookies set msg: ", res.data);
  } catch (error) {
    console.log("Failed to set cookies");
  }
  // const cookies = new Cookies();

  /*console.log("openExample", cookies.get("openExample"));
    cookies.set("openExample", 'openExampleChangedByXSS', { path: "/" });
    console.log("signedOpenExample", cookies.get("signedOpenExample"));
    cookies.set("signedOpenExample", 'signedOpenExampleChangedByXSS', { path: "/" });
    console.log("serverExample", cookies.get("serverExample"));
    cookies.set("serverExample", 'serverExampleChangedByXSS', { path: "/" });
    console.log("signedServerExample", cookies.get("signedServerExample"));
    cookies.set("signedServerExample", 'signedServerExampleChangedByXSS', { path: "/" });
  
    console.log("DEPOIS DA MUDANÇA");
    console.log("openExample", cookies.get("openExample"));
  
    console.log("signedOpenExample", cookies.get("signedOpenExample"));
  
    console.log("serverExample", cookies.get("serverExample"));
  
    console.log("signedServerExample", cookies.get("signedServerExample"));*/
}
