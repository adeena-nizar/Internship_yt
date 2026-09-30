import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { v4 as uuid } from 'uuid';

export const useGoogleAuth = ({
  setError,
  setIsLoading,
  setChallengeId,
  setOtpRequired,
  login,
  router,
}) => {
  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const deviceId = localStorage.getItem('deviceId') || uuid();
      localStorage.setItem('deviceId', deviceId);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ googleIdToken: idToken, deviceId }),
      });

      if (response.status === 202) {
        const data = await response.json();
        setChallengeId(data.challengeId);
        setOtpRequired(true);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Google Sign-In failed');
      }

      const data = await response.json();
      login(data.token, data.user);
      router.push('/');

    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return handleGoogleSignIn;
};