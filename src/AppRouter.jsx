import { createBrowserRouter } from 'react-router-dom';
import Root from './Root';
import NotFound from './components/NotFound/NotFound';
import Protected from './components/Protected/Protected';
import Home from './Pages/Home';
import Login from './components/Login/Login';
import RecentOrders from './components/Admin/RecentOrders';
import Settings from './Pages/Settings';
import CreateLocalOrder from './components/Admin/CreateLocalOrder';
import MyExpense from './Pages/MyExpense';
import OrderManagement from './Pages/OrderManagement';
import ViewLocalOrder from './components/Admin/ViewLocalOrder';
import Clients from './components/ClientList/Clients';
import EmployeeSignUp from './components/EmployeeList/EmployeeSignUp';
import Earnings from './components/Earnings/Earnings';
import ProtectedRole from './components/Protected/ProtectedRole';
import ResetPassword from './components/Login/ResetPassword';
import EmployeeList from './components/EmployeeList/EmployeeList';
import Profile from './components/Common/Profile';
import Analytics from './components/Analytics/Analytics';
import EditEarnings from './components/Earnings/EditEarnings';
import ProtectHr from './components/Protected/ProtectHr';
import ProfitShare from './components/ProfitShare/ProfitShare';
import ProtectedEmployee from './components/Protected/ProtectedEmployee';
import ShareholderDetails from './components/ProfitShare/ShareholderDetails';
import Payroll from './components/Payroll/Payroll';
import LeaveApplication from './components/Leave/LeaveApplication';
import AppliedLeave from './components/Leave/AppliedLeave';
import EmployeeDetails from './components/Payroll/EmployeeDetails';
import Shifting from './components/EmployeeList/Shifting';
import EmployeeProfile from './components/EmployeeList/EmployeeProfile';
import NoticeBoardAdmin from './components/NoticeBoard/NoticeBoardAdmin';
import NoticeBoard from './components/NoticeBoard/NoticeBoard';
import DebitPage from './Pages/Debit';
import ClientDetails from './components/ClientDetails/ClientDetails';
import ExportInvoice from './Pages/ExportInvoice';
import CreatePassword from './Pages/CreatePassword';
import CompleteProfile from './Pages/CompleteProfile';
import SalarySheetPage from './Pages/salary-sheet';

export const router = createBrowserRouter([
    { path: '/login', element: <Login /> },
    { path: '/resetPassword', element: <ResetPassword /> },
    { path: '/create-account', element: <CreatePassword /> },
    {
        path: '/complete-profile',
        element: <CompleteProfile />,
    },
    {
        path: '/',
        element: (
            <Protected>
                <Root />
            </Protected>
        ),
        errorElement: <NotFound />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/notice-board-admin', element: <NoticeBoardAdmin /> },
            { path: '/notice-board-employee', element: <NoticeBoard /> },
            {
                path: '/expense',
                element: (
                    <ProtectedRole>
                        <MyExpense />
                    </ProtectedRole>
                ),
            },
            {
                path: '/complete-profile',
                element: (
                    <ProtectedRole>
                        <CompleteProfile />
                    </ProtectedRole>
                ),
            },
            {
                path: '/employee-registration',
                element: (
                    <ProtectedRole>
                        <EmployeeSignUp />
                    </ProtectedRole>
                ),
            },
            { path: '/earnings/editEarnings/:id', element: <EditEarnings /> },
            {
                path: '/analytics',
                element: (
                    <ProtectHr>
                        <Analytics />
                    </ProtectHr>
                ),
            },
            { path: '/recentOrders', element: <RecentOrders /> },
            { path: '/profile', element: <Profile /> },
            { path: '/recentOrders/:orderId', element: <ViewLocalOrder /> },
            {
                path: '/createLocalOrder',
                element: (
                    <ProtectedRole>
                        <CreateLocalOrder />
                    </ProtectedRole>
                ),
            },
            { path: '/settings', element: <Settings /> },
            { path: '/orders', element: <OrderManagement /> },
            { path: '/orders/export-invoice', element: <ExportInvoice /> },
            {
                path: '/employeeList',
                element: (
                    <ProtectedRole>
                        <EmployeeList />
                    </ProtectedRole>
                ),
            },
            {
                path: '/salary-sheet',
                element: (
                    <ProtectedRole>
                        <SalarySheetPage />
                    </ProtectedRole>
                ),
            },
            {
                path: '/clients',
                element: (
                    <ProtectedRole>
                        <Clients />
                    </ProtectedRole>
                ),
            },
            {
                path: '/clients/:id',
                element: (
                    <ProtectedRole>
                        <ClientDetails />
                    </ProtectedRole>
                ),
            },
            { path: '/leaveApplication', element: <LeaveApplication /> },
            {
                path: '/earnings',
                element: (
                    <ProtectedRole>
                        <Earnings />
                    </ProtectedRole>
                ),
            },
            {
                path: '/payroll',
                element: (
                    <ProtectedRole>
                        <Payroll />
                    </ProtectedRole>
                ),
            },
            {
                path: '/appliedLeave',
                element: (
                    <ProtectedRole>
                        <AppliedLeave />
                    </ProtectedRole>
                ),
            },
            {
                path: '/employeeDetails',
                element: (
                    <ProtectedRole>
                        <EmployeeDetails />
                    </ProtectedRole>
                ),
            },
            {
                path: '/shifting',
                element: (
                    <ProtectedEmployee>
                        <Shifting />
                    </ProtectedEmployee>
                ),
            },
            {
                path: '/employees/:id',
                element: (
                    <ProtectedRole>
                        <EmployeeProfile />
                    </ProtectedRole>
                ),
            },
            {
                path: '/profit-share',
                element: (
                    <ProtectHr>
                        <ProfitShare />
                    </ProtectHr>
                ),
            },
            {
                path: '/shareholder-details/:id',
                element: (
                    <ProtectHr>
                        <ShareholderDetails />
                    </ProtectHr>
                ),
            },

            // fuyad's pages
            {
                path: '/debit',
                element: (
                    <ProtectHr>
                        <DebitPage />
                    </ProtectHr>
                ),
            },
        ],
    },
]);
