// components/Navbar.tsx
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, role } = useAuth();

  return (
    <nav>
      <ul>
        <li>Home</li>
        <li>{role === "admin" && <a href="/admin/dashboard">Admin</a>}</li>
        <li>{role === "reseller" && <a href="/reseller/dashboard">Reseller</a>}</li>
        <li>{role === "merchant" && <a href="/merchant/dashboard">Merchant</a>}</li>
      </ul>
    </nav>
  );
};

export default Navbar;
