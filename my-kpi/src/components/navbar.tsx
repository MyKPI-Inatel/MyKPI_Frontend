import {
  Bell,
  CircleHelp,
  CircleUser,
  HeartHandshake,
  LogOut,
  Megaphone,
} from "lucide-react";

export function Navbar() {
  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("userEmail")
    localStorage.removeItem("username")
    localStorage.removeItem("usertype")
    localStorage.removeItem("userId")
  }
  
  return (
    <div className="flex w-full col-span-10 justify-between px-10 py-5 items-center border-b shadow-sm shadow-white">
      <div className="flex w-14">
        <img src="/src/assets/logo.png" alt="Logo" />
      </div>
      <div className="flex space-x-5 items-center">
        <CircleHelp />
        <Megaphone />
        <HeartHandshake />
        <Bell />
        <a href="/login" onClick={logout}>
          <LogOut />
        </a>
        <div className="flex items-center justify-center space-x-2">
          <CircleUser size={40} strokeWidth={1} />
          <div className="flex flex-col">
            <span>Usuário</span>
            <span>Empresa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
