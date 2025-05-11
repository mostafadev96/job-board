import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protected-layout';
import LoginPage from '../pages/auth/login';
import RegisterPage from '../pages/auth/register';
import HomePage from '../pages/home';
import DashboardLayout from '../layouts/dashboard-layout';
import AppLayout from '../layouts/app-layout';
import RecruitersPage from '../pages/dashboard/recruiters';
import SeekerPage from '../pages/dashboard/seekers';
import CompanyPage from '../pages/dashboard/companies';
import AdminPage from '../pages/dashboard/admins';
import ApplicationPage from '../pages/dashboard/applications';
import WelcomePage from '../pages/dashboard/welcome';
import AgreementPage from '../pages/agreement';
import JobPage from '../pages/dashboard/jobs';

const ApplicationRouter = () => {
  return (
    <Routes>
      {/* Auth Layout */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/agreement" element={<AgreementPage />} />
      </Route>

      {/* Dashboard Layout */}
      <Route path='/dashboard' element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<WelcomePage />} />
        <Route path="/dashboard/recruiters" element={<RecruitersPage />} />
        <Route path="/dashboard/seekers" element={<SeekerPage />} />
        <Route path="/dashboard/jobs" element={<JobPage />} />
        <Route path="/dashboard/companies" element={<CompanyPage />} />
        <Route path="/dashboard/applications" element={<ApplicationPage />} />
        <Route path="/dashboard/admins" element={<AdminPage />} />
      </Route>
    </Routes>
  );
};

export default ApplicationRouter;
