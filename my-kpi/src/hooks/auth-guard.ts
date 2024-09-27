import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const useAuthGuard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            return navigate("/login");
        }

        let decodedToken = jwtDecode(token);
        const email = localStorage.getItem("userEmail");

        console.log(token, email);

        if (decodedToken.sub !== email || !email) {
            return navigate("/login");
        }
    }, []);
};