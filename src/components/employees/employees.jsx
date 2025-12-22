import { useEffect, useState, useCallback } from 'react';
import { UserPlus, Building2, EyeIcon, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../lib/axios';
import debounce from 'lodash.debounce';

const statusColorMap = {
    active: 'badge-success',
    'on leave': 'badge-warning',
    pending: 'badge-info',
    absent: 'badge-error',
    suspended: 'badge-neutral',
};

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sortKey, setSortKey] = useState('fullName');
    const [sortOrder] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const debouncedSearchHandler = useCallback(
        debounce((value) => {
            setDebouncedSearch(value);
            setCurrentPage(1);
        }, 500),
        []
    );

    useEffect(() => {
        return () => {
            debouncedSearchHandler.cancel();
        };
    }, [debouncedSearchHandler]);

    const fetchEmployees = async () => {
        try {
            setLoading(true);

            const res = await axiosInstance.get('/employees/get-employees', {
                params: {
                    search: debouncedSearch,
                    page: currentPage,
                    perPage,
                    sortKey,
                    sortOrder,
                },
            });

            setEmployees(res.data.data);
            setTotal(res.data.total);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            toast.error(
                error?.response?.data?.message || 'Internal server error'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [debouncedSearch, currentPage, perPage, sortKey, sortOrder]);

    const startIndex = (currentPage - 1) * perPage;

    return (
        <section className="flex-1 space-y-6">
            {/* ✅ HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Employees
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage all employee records in one place
                    </p>
                </div>

                <div className="flex gap-2">
                    <button className="btn btn-primary btn-soft">
                        <UserPlus className="w-4 h-4" />
                        Add Employee
                    </button>
                </div>
            </div>

            {/* ✅ CONTROLS */}
            <div className="flex flex-wrap items-center justify-between gap-6">
                <input
                    type="text"
                    placeholder="Search name or ID..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                    className="w-full max-w-sm border! border-gray-200! px-3 py-2 text-sm rounded-md"
                />

                <div className="grid grid-cols-2 items-center justify-between gap-6 w-auto">
                    <select
                        value={sortKey}
                        onChange={(e) => setSortKey(e.target.value)}
                        className="select!"
                    >
                        <option value="fullName">Sort by Name</option>
                        <option value="status">Sort by Status</option>
                        <option value="branch">Sort by Branch</option>
                    </select>

                    <select
                        value={perPage}
                        onChange={(e) => {
                            setPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="select!"
                    >
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            {/* ✅ BORDERLESS FLAT TABLE */}
            <div className="bg-white shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600 text-xs capitalize tracking-wider">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    Employee
                                </th>
                                <th className="px-4 py-3 text-left">
                                    Designation
                                </th>
                                <th className="px-4 py-3 text-left">Branch</th>
                                <th className="px-4 py-3 text-left">Phone</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {!loading &&
                                employees.map((emp) => (
                                    <tr
                                        key={emp._id}
                                        className="hover:bg-purple-50 transition"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="avatar">
                                                    <div className="w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                        {emp.photo ? (
                                                            <img
                                                                src={emp.photo}
                                                                alt={`${emp.fullName}'s profile image`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="font-semibold">
                                                                {emp.fullName
                                                                    ? emp.fullName
                                                                          .charAt(
                                                                              0
                                                                          )
                                                                          .tocapitalize()
                                                                    : 'U'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {emp.fullName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {emp.eid}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 capitalize">
                                            {emp.designation}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5 capitalize">
                                                <Building2 className="w-4 h-4 text-gray-400" />
                                                {emp.branch}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            {emp.phoneNumber}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-3 py-1 badge badge-soft badge-outline capitalize ${
                                                    statusColorMap[
                                                        emp.status?.toLowerCase()
                                                    ] || 'badge-secondary'
                                                }`}
                                            >
                                                {emp.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 flex items-center justify-center border-none!">
                                            <button className="btn btn-link mx-auto">
                                                <EyeIcon size={18} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                            {!loading && employees.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="text-center py-6 text-gray-400"
                                    >
                                        No employees found
                                    </td>
                                </tr>
                            )}

                            {loading && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="text-center py-6 text-gray-400"
                                    >
                                        <Loader
                                            size={20}
                                            className="animate-spin"
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ✅ PAGINATION (FIXED TOTAL COUNT) */}
            <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-gray-500">
                    Showing {startIndex + 1} -{' '}
                    {Math.min(startIndex + perPage, total)} of {total}
                </p>

                <div className="flex gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage((p) => Math.max(p - 1, 1))
                        }
                        className="btn btn-primary btn-soft btn-outline"
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className="btn btn-primary btn-soft btn-outline"
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() =>
                            setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                        className="btn btn-primary btn-soft btn-outline"
                    >
                        Next
                    </button>
                </div>
            </div>
        </section>
    );
}
