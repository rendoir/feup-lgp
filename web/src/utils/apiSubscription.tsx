import axiosInstance from './axiosInstance';

export async function apiSubscription(
  apiGroup: string,
  method: string,
  subjectId: number
) {
  const apiUrl = `/${apiGroup}/${subjectId}/subscription`;
  return method === 'post'
    ? axiosInstance.post(apiUrl)
    : axiosInstance.delete(apiUrl);
}
