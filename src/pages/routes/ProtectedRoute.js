import { RedirectToSignIn, useAuth } from "@clerk/nextjs";

const ProtectedRoute = ({ children }) => {
  const { isSignedIn } = useAuth();

  return isSignedIn ? children : <RedirectToSignIn />;
};

export default ProtectedRoute;
