import { RedirectToSignIn, useAuth, useUser } from "@clerk/nextjs";

const ResellerProtectedRoute = ({ children }) => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isSignedIn || user.role !== 'reseller') {
    return <RedirectToSignIn />;
  }

  return children;
};

export default ResellerProtectedRoute;
