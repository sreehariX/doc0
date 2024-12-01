import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuthStore } from '../store/auth';
import { authService } from '../services/auth';

export const Login = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const user = await authService.googleLogin(credentialResponse);
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleError = () => {
    console.error('Login Failed');
  };

  return (
    <div className="flex min-h-[300px] items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Welcome to doc0
          </h2>
          <p className="mt-2 text-center text-gray-400">
            Please sign in to continue so that we can avoid getting hammered on backend
          </p>
          <p className="mt-1 text-center text-sm text-gray-500">
            Free users get 10 requests per day
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap={false}
            theme="filled_black"
            shape="circle"
            locale="en"
          />
        </div>
      </div>
    </div>
  );
};