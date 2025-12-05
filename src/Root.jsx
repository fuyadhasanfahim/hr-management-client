import { Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Header from './components/Header/Header';
import { ToastContainer } from 'react-toastify';

const Root = () => {
    return (
        <div className="h-screen flex flex-col">
            {/* Fixed Header */}
            <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
                <Header />
            </header>

            {/* Main Content */}
            <div className="flex grow overflow-hidden">
                {/* Scrollable Sidebar */}
                <div className="w-[20%] h-[calc(100vh-56px)] overflow-y-auto px-4 custom-scrollbar border-r border-gray-200">
                    <Navbar />
                </div>

                {/* Scrollable Outlet Container */}
                <div className="w-[80%] h-[calc(100vh-64px)]">
                    <div className="h-full overflow-y-auto p-4">
                        <Outlet />
                    </div>
                </div>
            </div>

            <ToastContainer position="bottom-right" autoClose={2000} />
        </div>
    );
};

export default Root;
