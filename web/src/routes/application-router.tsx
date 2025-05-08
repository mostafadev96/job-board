import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protected-layout';
import LoginPage from '../pages/auth/login';
import RegisterPage from '../pages/auth/register';
import HomePage from '../pages/home';
import AgreementComponent from '../pages/agreement';
import DashboardLayout from '../layouts/dashboard-layout';
import AppLayout from '../layouts/app-layout';
import RecruitersPage from '../pages/dashboard/recruiters';
import SeekerPage from '../pages/dashboard/seekers';
import CompanyPage from '../pages/dashboard/companies';
import AdminPage from '../pages/dashboard/admins';
import ApplicationPage from '../pages/dashboard/applications';

const ApplicationRouter = () => {
  return (
    <Routes>
      {/* Auth Layout */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/agreement" element={<AgreementComponent />} />
      </Route>

      {/* Dashboard Layout */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/recruiters" element={<RecruitersPage />} />
        <Route path="/seekers" element={<SeekerPage />} />
        <Route path="/companies" element={<CompanyPage />} />
        <Route path="/applications" element={<ApplicationPage />} />
        <Route path="/admins" element={<AdminPage />} />
      </Route>
    </Routes>
  );
};

export default ApplicationRouter;
