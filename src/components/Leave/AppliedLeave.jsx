import React, { useContext, useEffect, useState, useRef } from 'react';
import { ContextData } from '../../DataProvider';
import useAxiosProtect from '../../utils/useAxiosProtect';
import useAxiosSecure from '../../utils/useAxiosSecure';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setRefetch } from '../../redux/refetchSlice';
import Swal from 'sweetalert2';

import { FiCheck, FiEye, FiX } from 'react-icons/fi';

const AppliedLeave = () => {
    const { user } = useContext(ContextData);
    const axiosProtect = useAxiosProtect();
    const axiosSecure = useAxiosSecure();

    const [appliedLeaveApplication, setAppliedLeaveApplication] = useState([]);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [selectedGrantDates, setSelectedGrantDates] = useState(new Set());
    const dialogRef = useRef(null);

    const dispatch = useDispatch();
    const refetch = useSelector((state) => state.refetch.refetch);

    // ---------------- Fetch leave list ----------------
    useEffect(() => {
        const fetchAppliedLeaveApplication = async () => {
            try {
                const response = await axiosProtect.get('/getAppliedLeave', {
                    params: { userEmail: user?.email },
                });
                setAppliedLeaveApplication(response.data || []);
            } catch (error) {
                toast.error(
                    `Error fetching data: ${error?.message || 'Unknown error'}`
                );
            }
        };
        if (user?.email) fetchAppliedLeaveApplication();
    }, [user?.email, refetch, axiosProtect]);

    // ---------------- View modal actions ----------------
    const openViewModal = (leave) => {
        setSelectedLeave(leave);

        const pre = new Set(
            Array.isArray(leave.grantedDates) ? leave.grantedDates : []
        );
        setSelectedGrantDates(pre);

        const dlg = dialogRef.current;
        if (dlg && dlg.showModal) dlg.showModal();
    };

    const closeViewModal = () => {
        const dlg = dialogRef.current;
        if (dlg && dlg.close) dlg.close();
        setSelectedLeave(null);
        setSelectedGrantDates(new Set());
    };

    const toggleDate = (date) => {
        setSelectedGrantDates((prev) => {
            const copy = new Set(prev);
            if (copy.has(date)) copy.delete(date);
            else copy.add(date);
            return copy;
        });
    };

    // ---------------- Grant selected dates ----------------
    const grantSelectedDates = async () => {
        if (!selectedLeave) return;

        const grantedDates = Array.from(selectedGrantDates).sort();
        const originalDates = Array.isArray(selectedLeave.leaveDates)
            ? selectedLeave.leaveDates
            : [];
        const declinedDates = originalDates.filter(
            (d) => !grantedDates.includes(d)
        );

        try {
            const res = await axiosSecure.put(
                `/grantLeave/${selectedLeave._id}`,
                {
                    grantedDates,
                    declinedDates,
                    grantedBy: user?.email,
                }
            );

            if (res.data && (res.data.modifiedCount > 0 || res.data.message)) {
                toast.success('Leave granted successfully');
                dispatch(setRefetch(!refetch));
                closeViewModal();
            } else {
                toast.error('Failed to grant selected dates');
            }
        } catch (err) {
            toast.error(`Grant error: ${err?.message || 'Unknown'}`);
        }
    };

    // ---------------- Accept handler (SweetAlert) ----------------
    const handleAccept = async (leave) => {
        const result = await Swal.fire({
            title: 'Grant leave',
            text: 'Do you want to grant full leave or partially grant selected dates?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Full Grant',
            showDenyButton: true,
            denyButtonText: 'Partial Grant',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            // FULL GRANT
            const grantedDates = Array.isArray(leave.leaveDates)
                ? leave.leaveDates
                : [];
            try {
                const res = await axiosSecure.put(`/grantLeave/${leave._id}`, {
                    grantedDates,
                    declinedDates: [],
                    grantedBy: user?.email,
                });

                if (
                    res.data &&
                    (res.data.modifiedCount > 0 || res.data.message)
                ) {
                    toast.success('Full leave granted');
                    dispatch(setRefetch(!refetch));
                } else {
                    toast.error('Failed to grant full leave');
                }
            } catch (err) {
                toast.error(`Grant error: ${err?.message || 'Unknown'}`);
            }
            return;
        }

        if (result.isDenied) {
            openViewModal(leave);
        }
    };

    // ---------------- Decline handler ----------------
    const handleDecline = async (leaveId) => {
        try {
            const res = await axiosSecure.put(`/declineLeave/${leaveId}`);
            if (res.data?.modifiedCount > 0 || res.data?.message) {
                toast.success('Leave application declined');
                dispatch(setRefetch(!refetch));
            } else {
                toast.error('Failed to decline leave');
            }
        } catch (error) {
            toast.error(`Decline error: ${error?.message || 'Unknown error'}`);
        }
    };

    // ---------------- Revoke grant handler ----------------
    const handleRevokeGrant = async (leave) => {
        if (!Array.isArray(leave.grantedDates) || !leave.grantedDates.length) {
            toast.info('No granted dates to revoke');
            return;
        }

        const confirm = await Swal.fire({
            title: 'Revoke granted leave?',
            text: `This will cancel ${leave.grantedDates.length} granted day(s) and restore leave balance.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Revoke',
        });
        if (!confirm.isConfirmed) return;

        try {
            const res = await axiosSecure.put(`/revokeGrant/${leave._id}`, {
                revokedDates: leave.grantedDates,
                revokedBy: user?.email,
                setStatusTo: 'Cancelled',
            });
            if (res.data && (res.data.modifiedCount > 0 || res.data.message)) {
                toast.success('Grant revoked');
                dispatch(setRefetch(!refetch));
            } else {
                toast.error('Failed to revoke leave');
            }
        } catch (err) {
            toast.error(`Revoke error: ${err?.message || 'Unknown'}`);
        }
    };

    return (
        <div className="p-4">
            {/* ---------------- COUNTERS ---------------- */}
            <section className="flex gap-4 justify-end text-xl">
                <div className="border p-3 rounded font-semibold">
                    Total: {appliedLeaveApplication?.length || 0}
                </div>
                <div className="border p-3 rounded font-semibold">
                    Approved:{' '}
                    {
                        appliedLeaveApplication.filter(
                            (l) => l.status === 'Approved'
                        ).length
                    }
                </div>
                <div className="border p-3 rounded font-semibold">
                    Pending:{' '}
                    {
                        appliedLeaveApplication.filter(
                            (l) => l.status === 'Pending'
                        ).length
                    }
                </div>
            </section>

            {/* ---------------- TABLE ---------------- */}
            <section className="mt-5">
                <div className="overflow-x-auto mt-5">
                    <table className="table table-zebra text-[14px]">
                        <thead className="bg-[#6E3FF3] text-white">
                            <tr>
                                <th>Employee ID</th>
                                <th>Name</th>
                                <th>Position</th>
                                <th>Leave type</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Day's</th>
                                <th>Action</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {appliedLeaveApplication.length ? (
                                appliedLeaveApplication.map((leave) => {
                                    const disabled = leave.status !== 'Pending';
                                    const btn =
                                        'p-2 rounded hover:scale-105 transition active:scale-95';
                                    const disabledClass = disabled
                                        ? 'opacity-40 pointer-events-none'
                                        : '';

                                    return (
                                        <tr key={leave._id}>
                                            <td>{leave.employeeId}</td>
                                            <td>{leave.employeeName}</td>
                                            <td>{leave.position}</td>
                                            <td>{leave.leaveType}</td>
                                            <td>{leave.startDate}</td>
                                            <td>{leave.endDate}</td>
                                            <td>{leave.totalDays}</td>

                                            <td>
                                                <div className="flex items-center gap-3">
                                                    {/* Accept */}
                                                    <button
                                                        className={`${btn} bg-green-100 ${disabledClass}`}
                                                        onClick={() =>
                                                            handleAccept(leave)
                                                        }
                                                    >
                                                        <FiCheck size={18} />
                                                    </button>

                                                    {/* View */}
                                                    <button
                                                        className={`${btn} bg-blue-100`}
                                                        onClick={() =>
                                                            openViewModal(leave)
                                                        }
                                                    >
                                                        <FiEye size={18} />
                                                    </button>

                                                    {/* Decline */}
                                                    <button
                                                        className={`${btn} bg-red-100 ${disabledClass}`}
                                                        onClick={() =>
                                                            handleDecline(
                                                                leave._id
                                                            )
                                                        }
                                                    >
                                                        <FiX size={18} />
                                                    </button>

                                                    {/* Revoke */}
                                                    {leave.status ===
                                                        'Approved' && (
                                                        <button
                                                            className="p-2 rounded bg-yellow-100 hover:scale-105 transition"
                                                            onClick={() =>
                                                                handleRevokeGrant(
                                                                    leave
                                                                )
                                                            }
                                                        >
                                                            Revoke
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                            <td>{leave.status}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={9} className="text-center">
                                        No leave requests found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ---------------- MODAL ---------------- */}
            <dialog className="modal" ref={dialogRef}>
                <form method="dialog" className="modal-box w-11/12 max-w-3xl">
                    <h3 className="font-bold text-lg mb-2">
                        Leave Application
                    </h3>

                    {selectedLeave ? (
                        <div className="space-y-3">
                            <div>
                                <strong>{selectedLeave.employeeName}</strong> —{' '}
                                {selectedLeave.employeeId}
                                <div className="text-sm text-slate-600">
                                    {selectedLeave.position} •{' '}
                                    {selectedLeave.leaveType}
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-slate-500">
                                        From
                                    </div>
                                    {selectedLeave.startDate}
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500">
                                        To
                                    </div>
                                    {selectedLeave.endDate}
                                </div>
                            </div>

                            {/* Reason */}
                            <div>
                                <div className="text-xs text-slate-500">
                                    Reason
                                </div>
                                <div className="whitespace-pre-wrap">
                                    {selectedLeave.reason}
                                </div>
                            </div>

                            {/* Select dates */}
                            <div>
                                <div className="text-xs text-slate-500">
                                    Leave Dates (Click to Select)
                                </div>
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {(selectedLeave.leaveDates || []).map(
                                        (d) => {
                                            const isSelected =
                                                selectedGrantDates.has(d);
                                            return (
                                                <button
                                                    key={d}
                                                    type="button"
                                                    onClick={() =>
                                                        toggleDate(d)
                                                    }
                                                    className={`
                                                    px-3 py-1 rounded-lg border text-sm transition-all
                                                    ${
                                                        isSelected
                                                            ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-[1.05]'
                                                            : 'bg-white text-gray-800 border-gray-400 hover:bg-gray-100'
                                                    }
                                                `}
                                                >
                                                    {d}
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end mt-4">
                                <button
                                    type="button"
                                    className="btn btn-info"
                                    onClick={() => {
                                        const all = new Set(
                                            selectedLeave.leaveDates || []
                                        );
                                        setSelectedGrantDates(all);
                                    }}
                                >
                                    Select All
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={() =>
                                        setSelectedGrantDates(new Set())
                                    }
                                >
                                    Clear
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={grantSelectedDates}
                                >
                                    Grant Selected
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={closeViewModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>Loading...</div>
                    )}
                </form>
            </dialog>
        </div>
    );
};

export default AppliedLeave;
