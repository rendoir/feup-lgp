import axios from "axios";
import { getApiURL } from "./apiURL";

export async function apiInviteUser(
  inviteSubjectId: number,
  invitedUserId: number,
  inviteType: string // 'post' or 'conference'
): Promise<boolean> {
  //TODO: DAR PIN A CONVITES???? (PERGUNTAR AOS RESTANTES)
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
    console.log("invited subscribers successfuly");
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
  const apiURL = getApiURL(
    `/${inviteType}/${inviteSubjectId}/amount_uninvited_subscribers`
  );

  try {
    const res = await axios.get(apiURL);
    console.log("amount uninvited subscribers: ", res.data);
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
  const apiURL = getApiURL(
    `/${inviteType}/${inviteSubjectId}/uninvited_users_info`
  );

  try {
    const res = await axios.get(apiURL);
    console.log("uninvited users: ", res.data.uninvitedUsers);
    return res.data.uninvitedUsers;
  } catch (error) {
    console.log("Failed to invite subscribers");
    return null;
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

// this is just a test function for cookies (not working)
async function setCookies(): Promise<void> {
  console.log("a fazer set das cookies");
  const apiURL = getApiURL(`/conference/set_cookies`);

  try {
    const res = axios.post(
      apiURL,
      {},
      {
        headers: {
          /*'Authorization': "Bearer " + 'abcd'*/
        }
      }
    );
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
