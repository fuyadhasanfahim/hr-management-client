import React, { useMemo, useState } from 'react';
import { UserPlus, Download, Building2, EyeIcon } from 'lucide-react';

/* ✅ STATIC DEMO DATA */
const employees = [
    {
        _id: '1',
        email: 'tosmesomaiya@gmail.com',
        eid: 'WB000166',
        role: 'employee',
        branch: 'Dhaka',
        status: 'Active',
        fullName: 'Somiya Akter',
        phoneNumber: '01401761855',
        designation: 'Sales & Marketing Executive',
    },
    {
        _id: '2',
        email: 'aisha@gmail.com',
        eid: 'WB000167',
        role: 'employee',
        branch: 'Chattogram',
        status: 'Active',
        fullName: 'Aisha Rahman',
        phoneNumber: '01700000000',
        designation: 'Frontend Developer',
    },
    {
        _id: '3',
        email: 'tanvir@gmail.com',
        eid: 'WB000168',
        role: 'employee',
        branch: 'Dhaka',
        status: 'On Leave',
        fullName: 'Tanvir Hasan',
        phoneNumber: '01800000000',
        designation: 'Backend Developer',
    },
];

/* ✅ STATUS BADGE */
function getStatusBadgeClasses(status) {
    switch (status) {
        case 'Active':
            return 'bg-emerald-50 text-emerald-600';
        case 'On Leave':
            return 'bg-amber-50 text-amber-600';
        default:
            return 'bg-gray-50 text-gray-600';
    }
}

export default function Employees() {
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState('fullName');
    const [perPage, setPerPage] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);

    /* ✅ FILTER + SORT */
    const processedEmployees = useMemo(() => {
        let data = [...employees];

        if (search) {
            data = data.filter(
                (e) =>
                    e.fullName.toLowerCase().includes(search.toLowerCase()) ||
                    e.eid.toLowerCase().includes(search.toLowerCase())
            );
        }

        data.sort((a, b) => a[sortKey].localeCompare(b[sortKey]));

        return data;
    }, [search, sortKey]);

    /* ✅ PAGINATION */
    const totalPages = Math.ceil(processedEmployees.length / perPage);
    const startIndex = (currentPage - 1) * perPage;
    const paginatedData = processedEmployees.slice(
        startIndex,
        startIndex + perPage
    );

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
                    {/* <button className="btn btn-outline">
                        <Download className="w-4 h-4" />
                        Export
                    </button> */}

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
                        setCurrentPage(1);
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
                        <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
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
                            {paginatedData.map((emp) => (
                                <tr
                                    key={emp._id}
                                    className="hover:bg-purple-50 transition"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="avatar">
                                                <div className="w-8 rounded-full">
                                                    <img src="https://img.daisyui.com/images/profile/demo/wonderperson@192.webp" />
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

                                    <td className="px-4 py-3">
                                        {emp.designation}
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <Building2 className="w-4 h-4 text-gray-400" />
                                            {emp.branch}
                                        </div>
                                    </td>

                                    <td className="px-4 py-3">
                                        {emp.phoneNumber}
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-3 py-1 badge badge-soft badge-outline ${
                                                emp.status.toLowerCase() ===
                                                'active'
                                                    ? 'badge-success'
                                                    : 'badge-warning'
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

                            {paginatedData.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="text-center py-6 text-gray-400"
                                    >
                                        No employees found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ✅ PAGINATION */}
            <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-gray-500">
                    Showing {startIndex + 1} -{' '}
                    {Math.min(startIndex + perPage, processedEmployees.length)}{' '}
                    of {processedEmployees.length}
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
