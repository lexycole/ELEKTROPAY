import ResellerProtectedRoute from "../../components/ResellerProtectedRoute";

const ResellerDashboardPage = () => (
  <ResellerProtectedRoute>
    <ResellerDashboard />
  </ResellerProtectedRoute>
);

export default ResellerDashboardPage;
