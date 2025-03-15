import SuperAdminProtectedRoute from "../../components/SuperAdminProtectedRoute";

const AdminDashboardPage = () => (
  <SuperAdminProtectedRoute>
    <AdminDashboard />
  </SuperAdminProtectedRoute>
);

export default AdminDashboardPage;
