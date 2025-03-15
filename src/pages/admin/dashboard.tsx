// pages/admin/dashboard.tsx
import { withAuth } from "../../middleware/auth";
import { supabase } from "../../lib/supabaseClient";

export const getServerSideProps = withAuth(async ({ req, res }) => {
  const { user } = req;
  if (user.role !== "admin") {
    return {
      notFound: true,
    };
  }

  // Fetch any data needed for the admin dashboard
  const { data, error } = await supabase.from("merchants").select("*");

  return {
    props: {
      merchants: data,
    },
  };
});

const AdminDashboard = ({ merchants }) => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Render merchants data */}
    </div>
  );
};

export default AdminDashboard;
