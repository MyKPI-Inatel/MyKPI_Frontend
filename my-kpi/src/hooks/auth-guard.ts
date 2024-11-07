import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface CustomJwtPayload {
  id?: number;
  email?: string;
  exp?: number;
  name?: string;
  usertype?: string;
  orgid?: number;
  depid?: number;
  sub?: string;
}

export const useAuthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      return navigate('/login');
    }

    try {
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      console.log(decodedToken);
      const isTokenExpired = decodedToken.exp ? decodedToken.exp * 1000 < Date.now() : true;
      if (isTokenExpired) {
        localStorage.clear();
        return navigate('/login');
      }
    } catch (error) {
      console.error('Invalid token', error);
      localStorage.clear();
      return navigate('/login');
    }
  }, [navigate]);
};

export const useOrgAdminGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      return navigate('/login');
    }

    try {
      const decodedToken = jwtDecode<CustomJwtPayload>(token);

      const isTokenExpired = decodedToken.exp ? decodedToken.exp * 1000 < Date.now() : true;
      if (isTokenExpired) {
        localStorage.clear();
        return navigate('/login');
      }
      console.log(decodedToken);
      if (decodedToken.usertype !== 'orgadmin' && decodedToken.usertype !== 'superadmin') {
        return navigate('/');
      }
    } catch (error) {
      console.error('Invalid token', error);
      localStorage.clear();
      return navigate('/login');
    }
  }, [navigate]);
};

export const useSuperAdminGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      return navigate('/login');
    }

    try {
      const decodedToken = jwtDecode<CustomJwtPayload>(token);

      const isTokenExpired = decodedToken.exp ? decodedToken.exp * 1000 < Date.now() : true;
      if (isTokenExpired) {
        localStorage.clear();
        return navigate('/login');
      }
      console.log(decodedToken);
      if (decodedToken.usertype !== 'superadmin') {
        return navigate('/');
      }
    } catch (error) {
      console.error('Invalid token', error);
      localStorage.clear();
      return navigate('/login');
    }
  }, [navigate]);
};
