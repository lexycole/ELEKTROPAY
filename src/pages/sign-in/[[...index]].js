import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <SignIn
        onSignIn={(auth) => {
          // Redirect to the protected route after successful login
          if (auth) {
            const redirectUrl = '/';
            return <Redirect to={redirectUrl} />;
          }
        }}
      />
    </div>
  );
}