import { useContext, useState } from 'react';
import { FaUsers, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import {
    FaClipboardUser,
    FaHandHoldingDollar,
    FaSackDollar,
} from 'react-icons/fa6';
import { MdOutlineDashboard, MdOutlineShuffle } from 'react-icons/md';
import { RiCurrencyLine, RiUser2Fill } from 'react-icons/ri';
import { IoAnalyticsSharp, IoCard } from 'react-icons/io5';
import { LuUsers } from 'react-icons/lu';
import { HiDocumentDuplicate } from 'react-icons/hi2';
import { FileCheck2Icon, FileSpreadsheet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ContextData } from '../../DataProvider';

const payrollRoutes = [
    '/employees',
    '/shifting',
    '/appliedLeave',
    '/salary-sheet',
];

// ✅ Auto open if any payroll sub route is active
const isPayrollRouteActive = payrollRoutes.some((path) =>
    location.pathname.startsWith(path)
);

const Navbar = () => {
    const { currentUser } = useContext(ContextData);
    const location = useLocation();

    const [isPayrollOpen, setIsPayrollOpen] = useState(false);

    const rolesAllowed =
        currentUser?.role === 'Developer' ||
        currentUser?.role === 'Admin' ||
        currentUser?.role === 'HR-ADMIN';

    const activeClass = 'bg-purple-600 text-white shadow-lg';
    const baseClass =
        'flex items-center gap-2 px-3 py-2 rounded-md font-medium transition hover:bg-purple-600 hover:text-white';

    return (
        <div className="flex flex-col gap-1 p-2 text-gray-700">
            {/* ✅ Dashboard */}
            <Link
                to="/"
                className={`${baseClass} ${
                    location.pathname === '/' && activeClass
                }`}
            >
                <MdOutlineDashboard />
                Dashboard
            </Link>

            {/* ✅✅✅ MODERN PAYROLL DROPDOWN WITH AUTO ACTIVE */}
            {/* {rolesAllowed && (
                <div className="mt-3">
                    <button
                        onClick={() => setIsPayrollOpen(!isPayrollOpen)}
                        className={`flex w-full items-center justify-between px-4 py-2.5 rounded-lg font-semibold transition-all
            ${
                isPayrollOpen || isPayrollRouteActive
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
            }`}
                    >
                        <span className="flex items-center gap-2">
                            <FaHandHoldingDollar className="text-lg" />
                            Payroll
                        </span>
                        <span className="text-sm opacity-80">
                            {isPayrollOpen || isPayrollRouteActive ? (
                                <FaAngleUp />
                            ) : (
                                <FaAngleDown />
                            )}
                        </span>
                    </button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isPayrollOpen || isPayrollRouteActive
                                ? 'max-h-60 opacity-100 my-3'
                                : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="grid grid-cols-1 gap-2 bg-white/80 backdrop-blur-md p-3 rounded-xl border-2 border-purple-200">
                            <Link
                                to="/employees"
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                    ${
                        location.pathname.startsWith('/employees')
                            ? 'bg-purple-600 text-white shadow'
                            : 'hover:bg-purple-600 hover:text-white'
                    }`}
                            >
                                <FaUsers
                                    className={`hover:text-white ${
                                        location.pathname.startsWith(
                                            '/employees'
                                        )
                                            ? 'text-white'
                                            : 'text-purple-600'
                                    }`}
                                />
                                <span>Employees</span>
                            </Link>

                            <Link
                                to="/shifting"
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                    ${
                        location.pathname.startsWith('/shifting')
                            ? 'bg-purple-600 text-white shadow'
                            : 'hover:bg-purple-600 hover:text-white'
                    }`}
                            >
                                <MdOutlineShuffle
                                    className={
                                        location.pathname.startsWith(
                                            '/shifting'
                                        )
                                            ? 'text-white'
                                            : 'text-purple-600'
                                    }
                                />
                                <span>Shifting</span>
                            </Link>

                            <Link
                                to="/appliedLeave"
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                    ${
                        location.pathname.startsWith('/appliedLeave')
                            ? 'bg-purple-600 text-white shadow'
                            : 'hover:bg-purple-600 hover:text-white'
                    }`}
                            >
                                <HiDocumentDuplicate
                                    className={
                                        location.pathname.startsWith(
                                            '/appliedLeave'
                                        )
                                            ? 'text-white'
                                            : 'text-purple-600'
                                    }
                                />
                                <span>Leave Applications</span>
                            </Link>

                            <Link
                                to="/salary-sheet"
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                    ${
                        location.pathname.startsWith('/salary-sheet')
                            ? 'bg-purple-600 text-white shadow'
                            : 'hover:bg-purple-600 hover:text-white'
                    }`}
                            >
                                <FileSpreadsheet
                                    size={18}
                                    className={
                                        location.pathname.startsWith(
                                            '/salary-sheet'
                                        )
                                            ? 'text-white'
                                            : 'text-purple-600'
                                    }
                                />
                                <span>Salary Sheet</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )} */}

            {/* ✅ Employee List */}
            {rolesAllowed && (
                <Link
                    to="/employeeList"
                    className={`${baseClass} ${
                        location.pathname.startsWith('/employeeList') &&
                        activeClass
                    }`}
                >
                    <LuUsers />
                    Employee List
                </Link>
            )}

            {/* ✅ Salary Sheet */}
            {rolesAllowed && (
                <Link
                    to="/salary-sheet"
                    className={`${baseClass} ${
                        location.pathname.startsWith('/salary-sheet') &&
                        activeClass
                    }`}
                >
                    <FileSpreadsheet size={18} />
                    Salary Sheet
                </Link>
            )}

            {/* ✅ Shifting */}
            {rolesAllowed && (
                <Link
                    to="/shifting"
                    className={`${baseClass} ${
                        location.pathname === '/shifting' && activeClass
                    }`}
                >
                    <MdOutlineShuffle />
                    Shifting
                </Link>
            )}

            {/* ✅ Employee Details */}
            {rolesAllowed && (
                <Link
                    to="/employeeDetails"
                    className={`${baseClass} ${
                        location.pathname === '/employeeDetails' && activeClass
                    }`}
                >
                    <FaUsers />
                    Employee Details
                </Link>
            )}

            {/* ✅ Leave Applications */}
            {rolesAllowed && (
                <Link
                    to="/appliedLeave"
                    className={`${baseClass} ${
                        location.pathname === '/appliedLeave' && activeClass
                    }`}
                >
                    <HiDocumentDuplicate />
                    Leave Applications
                </Link>
            )}

            {/* ✅ Expense */}
            {rolesAllowed && (
                <Link
                    to="/expense"
                    className={`${baseClass} ${
                        location.pathname === '/expense' && activeClass
                    }`}
                >
                    <RiCurrencyLine />
                    Expense
                </Link>
            )}

            {/* ✅ ORDER MANAGEMENT */}
            <Link
                to="/orders"
                className={`${baseClass} ${
                    location.pathname.startsWith('/orders') && activeClass
                }`}
            >
                <FileCheck2Icon size={18} />
                Order Management
            </Link>

            {/* ✅ EARNINGS */}
            {rolesAllowed && (
                <Link
                    to="/earnings"
                    className={`${baseClass} ${
                        location.pathname === '/earnings' && activeClass
                    }`}
                >
                    <FaHandHoldingDollar />
                    Earnings
                </Link>
            )}

            {/* ✅ CLIENTS */}
            {rolesAllowed && (
                <Link
                    to="/clients"
                    className={`${baseClass} ${
                        location.pathname.startsWith('/clients') && activeClass
                    }`}
                >
                    <RiUser2Fill />
                    Clients
                </Link>
            )}

            {/* ✅ PROFIT SHARE */}
            {(currentUser?.role === 'Developer' ||
                currentUser?.role === 'Admin') && (
                <Link
                    to="/profit-share"
                    className={`${baseClass} ${
                        location.pathname === '/profit-share' && activeClass
                    }`}
                >
                    <FaSackDollar />
                    Profit Share
                </Link>
            )}

            {/* ✅ ANALYTICS */}
            {(currentUser?.role === 'Developer' ||
                currentUser?.role === 'Admin') && (
                <Link
                    to="/analytics"
                    className={`${baseClass} ${
                        location.pathname === '/analytics' && activeClass
                    }`}
                >
                    <IoAnalyticsSharp />
                    Analytics
                </Link>
            )}

            {/* ✅ DEBIT */}
            {(currentUser?.role === 'Developer' ||
                currentUser?.role === 'Admin') && (
                <Link
                    to="/debit"
                    className={`${baseClass} ${
                        location.pathname === '/debit' && activeClass
                    }`}
                >
                    <IoCard />
                    Debit
                </Link>
            )}

            {/* ✅ NOTICE BOARD (ADMIN) */}
            {rolesAllowed && (
                <Link
                    to="/notice-board-admin"
                    className={`${baseClass} ${
                        location.pathname === '/notice-board-admin' &&
                        activeClass
                    }`}
                >
                    <FaClipboardUser />
                    Notice Board
                </Link>
            )}

            {/* ✅ NOTICE BOARD (EMPLOYEE) */}
            {currentUser?.role === 'employee' && (
                <Link
                    to="/notice-board-employee"
                    className={`${baseClass} ${
                        location.pathname === '/notice-board-employee' &&
                        activeClass
                    }`}
                >
                    <FaClipboardUser />
                    Notice Board
                </Link>
            )}
        </div>
    );
};

export default Navbar;
