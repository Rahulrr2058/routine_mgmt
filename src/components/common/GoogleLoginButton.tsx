import React, { useState, useEffect } from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { setCookie } from 'cookies-next';
import showNotify from '@/utils/notify';
import axios from '@/config/axios';
import { useRouter } from 'next/router';

const GoogleLoginButton = ({ handleModal }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // Ensure Firebase logic only runs client-side
  const isClient = typeof window !== 'undefined';

  const handleGoogleSignIn = async () => {
    if (!isClient) return; // Prevent execution on server
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const data = await axios.post(
          '/auth/verify/google',
          { id_token: idToken },
      );

        setCookie('token', data.token || '');
        setCookie('role', data.role || '');
        showNotify('success', data.message || 'Logged in successfully');
        handleModal();
        router.reload()
        
    } catch (error: any) {
     showNotify('error', error.message || 'Failed to sign in with Google');
      console.error('Google sign-in error:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
      });
      setError(
          error.code?.includes('auth/')
              ? `Firebase error: ${error.message}`
              : error.response?.data?.message || 'Failed to sign in with Google'
      )

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isClient) return; // Prevent execution on server
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const idToken = await result.user.getIdToken();
          const { data } = await axios.post(
              '/auth/verify/google',
              { id_token: idToken },
              { headers: { 'Content-Type': 'application/json' } }
          );
          if (data.status !== 'INACTIVE') {
            setCookie('token', data.token || '');
            setCookie('role', data.role || '');
            showNotify('success', data.message || 'Logged in successfully');
            handleModal();
          } else {
            showNotify('error', 'Your account is not authorized to login');
          }
        }
      } catch (error: any) {
        console.error('Redirect error:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
        });
        const errorMessage =
            error.code?.includes('auth/')
                ? `Firebase error: ${error.message}`
                : error.response?.data?.message || 'Failed to sign in with Google';
        setError(errorMessage);
        showNotify('error', errorMessage);
      }
    };
    handleRedirect();
  }, [handleModal]);

  return (
      <div className="flex flex-col items-center justify-center gap-2">
        <button
            onClick={handleGoogleSignIn}
            disabled={loading || !isClient}
            className="flex items-center gap-2 bg-blue-600 text-white font-medium py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Sign in with Google"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path
                d="M12.24 10.4V14.8H17.24C16.9 16.9 15.71 18.6 14.1 19.6L18.6 23.1C21.2 20.7 22.9 17.3 22.9 13.5C22.9 12.4 22.8 11.4 22.6 10.4H12.24Z"
                fill="#4285F4"
            />
            <path
                d="M12 24C15.2 24 17.9 22.9 19.6 21L15.1 17.5C14.1 18.3 13 18.7 12 18.7C8.91 18.7 6.3 16.3 5.3 13.5H0.7V17.1C2.4 20.5 6.1 24 12 24Z"
                fill="#34A853"
            />
            <path
                d="M5.3 10.5C5.1 9.7 5 8.9 5 8C5 7.1 5.1 6.3 5.3 5.5V1.9H0.7C-0.2 3.7 0 6.3 0 8C0 9.7 0.2 12.3 0.7 13.5L5.3 10.5Z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.3C13.3 5.3 14.5 5.7 15.5 6.7L19.5 2.7C17.8 1.1 15.2 0 12 0C6.1 0 2.4 3.4 0.7 6.9L5.3 10.4C6.3 7.7 8.9 5.3 12 5.3Z"
                fill="#EA4335"
            />
          </svg>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
  );
};

export default GoogleLoginButton;