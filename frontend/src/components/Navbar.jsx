import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/">Sweet Shop</Link>
            </div>
            <ul className="nav-links">
                {user ? (
                    <>
                        <li><Link to="/">Dashboard</Link></li>
                        {user.isAdmin && <li><Link to="/admin">Admin</Link></li>}
                        <li><button onClick={logout} className="btn-logout">Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
