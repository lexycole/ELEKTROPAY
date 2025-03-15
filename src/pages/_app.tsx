import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from '../contexts/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
};

export default MyApp;


// import "@/styles/globals.css";
// import type { AppProps } from "next/app";
// import { ClerkProvider } from '@clerk/nextjs'

// export default function App({ Component, pageProps }: AppProps) {
//   return (
//   <ClerkProvider {...pageProps}>
//     <Component {...pageProps} />
//   </ClerkProvider>
//   )
// }
