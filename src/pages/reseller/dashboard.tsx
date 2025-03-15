// pages/reseller/dashboard.tsx
import { useAuth } from "../../contexts/AuthContext";

const ResellerDashboard = () => {
  const { user, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (role !== "reseller") {
    return <div>You are not authorized to view this page</div>;
  }

  return (
    <div>
      <h1>Reseller Dashboard</h1>
      <p>Welcome, {user?.email}</p>
    </div>
  );
};

export default ResellerDashboard;
