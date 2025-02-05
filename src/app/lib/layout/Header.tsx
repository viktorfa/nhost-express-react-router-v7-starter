import { Link } from "react-router";

export const Header = () => {
  return (
    <header>
      <nav className="w-full px-4 py-4 border-b">
        <div className="flex gap-4">
          <div>
            <Link to="/">Home</Link>
          </div>
          <div>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div>
            <Link to="/auth/sign-in">Sign In</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
