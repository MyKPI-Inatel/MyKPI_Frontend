import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { env } from '../lib/env';
import { Loader2 } from 'lucide-react';
import swal from 'sweetalert';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${env.VITE_API_URL}/v1/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.user;

        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('usertype', user.usertype);
        localStorage.setItem('username', user.name);
        localStorage.setItem('userEmail', user.email);

        return navigate('/');
      } else {
        swal('Erro', 'Email ou senha inválidos!', 'error');
        setIsLoading(false);
      }
    } catch (error) {
      swal('Erro', 'Erro interno! Tente novamente mais tarde', 'error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <form
        className="flex flex-col border p-10 rounded-lg border-blue-100 shadow-md w-96"
        onSubmit={handleLogin}
      >
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            name="email"
            id="email"
            className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label
            htmlFor="email"
            className="peer-focus:font-medium absolute text-md text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            name="password"
            id="password"
            className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label
            htmlFor="password"
            className="peer-focus:font-medium absolute text-md text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Senha
          </label>
        </div>
        <button className="bg-blue-400 p-3 mb-2 rounded-md text-white" type="submit" disabled={isLoading}>
          <div className="flex justify-center">
            {isLoading ? <Loader2 className="animate-spin h-6 w-6 text-white" /> : 'Entrar'}
          </div>
        </button>
      </form>
    </div>
  );
}
