import axios from 'axios';

interface LoginProps {
  email: string;
  password: string;
  role: 'recruiter' | 'seeker' | 'admin'
}

interface RegisterProps {
  email: string;
  name: string;
  gender: string;
  password: string;
}
const baseUrl = 'http://localhost:3000';
export const loginApi = async (loginProps: LoginProps) => {
  const res = await axios.post(baseUrl + '/api/auth/login', loginProps);
  return res.data;
};

export const registerApi = async (registerProps: RegisterProps) => {
  const res = await axios.post(baseUrl + '/api/auth/signup', registerProps);
  return res.data;
};
