import { CredentialResponse } from '@react-oauth/google';

interface User {
  email: string;
  name: string;
  picture?: string;
}

export const authService = {
  async googleLogin(response: CredentialResponse): Promise<User> {
    if (!response.credential) {
      throw new Error('No credentials received');
    }

    // Decode the JWT token
    const decoded = JSON.parse(atob(response.credential.split('.')[1]));
    
    return {
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    };
  }
};