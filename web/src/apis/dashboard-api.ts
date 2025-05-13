import axios from 'axios';
import { getStoredUser } from '../utils/auth-util';

const baseUrl = 'http://localhost:3000';
export const dashboardSummaryApi = async () => {
  const token = getStoredUser()?.access_token;
  const res = await axios.get(baseUrl + '/api/dashboard/summary', {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return res.data;
};
