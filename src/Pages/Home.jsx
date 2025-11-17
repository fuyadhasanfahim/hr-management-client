import { useContext, useEffect } from 'react';
import { ContextData } from '../DataProvider';
import AdminDashboard from '../components/Admin/AdminDashboard';
import ClientDashboard from '../components/ClientDashboard/ClientDashboard';
import HrDashboard from '../components/HrAdmin/HrDashboard';
import EmployeeDashboard from '../components/EmployeeDashboard/EmployeeDashboard';
import { useNavigate } from 'react-router-dom';

const roleComponentMap = {
    Admin: AdminDashboard,
    Developer: AdminDashboard,
    'HR-ADMIN': HrDashboard,
    client: ClientDashboard,
};

const Home = () => {
    const { user, currentUser } = useContext(ContextData);
    const navigate = useNavigate();

    useEffect(() => {
        const originalPath = localStorage.getItem('originalPath');
        if (user && currentUser?.role && originalPath && originalPath !== '/') {
            localStorage.removeItem('originalPath');
            navigate(originalPath, { replace: true });
        }
    }, [user, currentUser, navigate]);

    if (!user || !currentUser?.role) {
        return <div className="skeleton h-32 w-32"></div>;
    }

    const ComponentToRender =
        roleComponentMap[currentUser?.role] || EmployeeDashboard;

    return <ComponentToRender />;
};

export default Home;
