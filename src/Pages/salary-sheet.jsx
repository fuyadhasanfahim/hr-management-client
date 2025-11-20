import { useState } from 'react';
import { SearchIcon, Download, Loader } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import useSalarySheet from '../hooks/useSalarySheet';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export default function SalarySheetPage() {
    const [search, setSearch] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(20);
    const [exporting, setExporting] = useState(false);

    const debouncedSearch = useDebouncedCallback((value) => {
        if (!selectedMonth) {
            toast.warning('Please select a month before searching.');
            return;
        }
        // update immediate search state used by hook
        setSearch(value);
        setPage(1);
    }, 500);

    const {
        data = [],
        totalPages = 0,
        loading = false,
    } = useSalarySheet({
        search,
        month: selectedMonth,
        page,
        rows,
    });

    const format = (value) => {
        const num = Number(value || 0);
        return num.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const exportExcel = async () => {
        if (!selectedMonth) {
            toast.warning('Please select a month before exporting.');
            return;
        }

        try {
            setExporting(true);

            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/salary/get-salary-sheet`,
                {
                    params: {
                        search,
                        month: selectedMonth,
                        page: 1,
                        limit: 999999,
                    },
                }
            );

            const rowsData = Array.isArray(res.data.data) ? res.data.data : [];

            const exportData = rowsData.map((item) => ({
                Name: item.name || '',
                Email: item.email || '',
                'Account Number': item.accountNumber || '',
                Salary: Number(item.salary || 0).toFixed(2),
                'Per Day Salary': Number(item.perDaySalary || 0).toFixed(2),
                Present: item.present ?? 0,
                Absent: item.absent ?? 0,
                'Total Payable': Number(item.total || 0).toFixed(2),
            }));

            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Salary Sheet');

            // Filename with month and year
            const fileName = `salary_sheet_${selectedMonth
                .replace(/\s+/g, '_')
                .toLowerCase()}_${new Date().getFullYear()}.xlsx`;
            XLSX.writeFile(wb, fileName);

            toast.success('Excel exported successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Export failed.');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header with Filters */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-violet-700">
                    Salary Sheet
                </h2>

                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="flex items-center border border-violet-300 rounded-lg px-3 py-1 bg-white shadow-sm">
                        <SearchIcon size={16} className="text-violet-600" />
                        <input
                            type="search"
                            placeholder="Search by name or email..."
                            className="ml-2 outline-none"
                            onChange={(e) => debouncedSearch(e.target.value)}
                        />
                    </div>

                    {/* Month Select (REQUIRED) */}
                    <select
                        value={selectedMonth}
                        onChange={(e) => {
                            setSelectedMonth(e.target.value);
                            setPage(1);
                            // clear search state when month changes? keep search
                        }}
                        className="border border-violet-300 rounded-lg px-3 py-1 bg-white shadow-sm"
                    >
                        <option value="">Select Month (Required)</option>
                        {monthNames.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>

                    {/* Rows */}
                    <select
                        value={rows}
                        onChange={(e) => {
                            setRows(Number(e.target.value));
                            setPage(1);
                        }}
                        className="border border-violet-300 rounded-lg px-3 py-1 bg-white shadow-sm"
                    >
                        {[20, 50, 100].map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>

                    {/* Export Button */}
                    <button
                        onClick={exportExcel}
                        disabled={exporting || !selectedMonth}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg shadow
                            ${
                                !selectedMonth
                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                    : 'bg-violet-600 hover:bg-violet-700 text-white'
                            }
                        `}
                    >
                        {exporting ? (
                            <Loader size={16} className="animate-spin" />
                        ) : (
                            <Download size={16} />
                        )}
                        Export Excel
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="border border-gray-200 shadow overflow-x-auto">
                {selectedMonth === '' ? (
                    <div className="text-center text-gray-600 py-10">
                        Please select a month to view salary sheet.
                    </div>
                ) : (
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-violet-600 text-white">
                            <tr>
                                <th className="px-4 py-2">Serial</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Account No.</th>
                                <th className="px-4 py-2">Salary</th>
                                <th className="px-4 py-2">Per Day</th>
                                <th className="px-4 py-2">Present</th>
                                <th className="px-4 py-2">Absent</th>
                                <th className="px-4 py-2">Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="9"
                                        className="text-center py-6"
                                    >
                                        <Loader
                                            size={20}
                                            className="animate-spin mx-auto"
                                        />
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="9"
                                        className="text-center py-6 text-gray-600"
                                    >
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                data.map((row, idx) => (
                                    <tr
                                        key={row.email ?? idx}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                                    >
                                        <td className="px-4 py-2">
                                            {(page - 1) * rows + idx + 1}
                                        </td>
                                        <td className="px-4 py-2">
                                            {row.name}
                                        </td>
                                        <td className="px-4 py-2">
                                            {row.email}
                                        </td>
                                        <td className="px-4 py-2">
                                            {row.accountNumber || '-'}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {format(row.salary)}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {format(row.perDaySalary)}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {row.present ?? 0}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {row.absent ?? 0}
                                        </td>
                                        <td className="px-4 py-2 text-center font-semibold text-violet-700">
                                            {format(row.total)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {selectedMonth && totalPages > 0 && (
                <div className="flex items-center justify-center gap-3 pt-4 flex-wrap">
                    <button
                        onClick={() => page > 1 && setPage(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-1 border border-violet-300 rounded-lg hover:bg-violet-100 disabled:opacity-40"
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 border rounded-lg m-1 ${
                                page === i + 1
                                    ? 'bg-violet-600 text-white border-violet-600'
                                    : 'border-violet-300 hover:bg-violet-100'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => page < totalPages && setPage(page + 1)}
                        disabled={page === totalPages}
                        className="px-4 py-1 border border-violet-300 rounded-lg hover:bg-violet-100 disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
