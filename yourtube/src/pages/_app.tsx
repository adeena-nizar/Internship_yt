
import { AppProps } from 'next/app';
import '../styles/globals.css';
import { UserProvider } from '../lib/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;