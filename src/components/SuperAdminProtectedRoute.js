import { RedirectToSignIn, useAuth, useUser } from "@clerk/nextjs";

const SuperAdminProtectedRoute = ({ children }) => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isSignedIn || user.role !== 'super-admin') {
    return <RedirectToSignIn />;
  }

  return children;
};

export default SuperAdminProtectedRoute;
