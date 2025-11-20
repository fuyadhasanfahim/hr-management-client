import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { ContextData } from '../../DataProvider';
import { useDispatch } from 'react-redux';
import { setRefetch } from '../../redux/refetchSlice';

export default function NewShiftModal({ refetch }) {
    const { user } = useContext(ContextData);

    const [form, setForm] = useState({
        shiftName: '',
        branch: 'dhaka',
        startTime: '',
        endTime: '',
        lateAfterMinutes: 0,
        absentAfterMinutes: 5,
        allowOT: true,
        weekends: [], // NEW FIELD
    });

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const weekendOptions = [
        'Friday',
        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
    ];

    const toggleWeekend = (day) => {
        setForm((prev) => ({
            ...prev,
            weekends: prev.weekends.includes(day)
                ? prev.weekends.filter((d) => d !== day)
                : [...prev.weekends, day],
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            setLoading(true);

            const res = await fetch(
                `${import.meta.env.VITE_BASE_URL}/shifts/new-shift`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...form,
                        userEmail: user?.email,
                    }),
                }
            );

            const data = await res.json();

            if (res.ok && data.success) {
                toast.success(data?.message || 'Shift created successfully');

                setForm({
                    shiftName: '',
                    branch: 'dhaka',
                    startTime: '',
                    endTime: '',
                    lateAfterMinutes: 0,
                    absentAfterMinutes: 5,
                    allowOT: true,
                    weekends: [],
                });

                const modal = document.getElementById('new-shift-modal');
                if (modal && typeof modal.close === 'function') modal.close();

                dispatch(setRefetch(!refetch));
            } else {
                toast.error(data?.message || 'Failed to create shift');
            }
        } catch (err) {
            console.error('Error creating shift:', err);
            toast.error('Something went wrong while creating the shift');
        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog id="new-shift-modal" className="modal">
            <div className="modal-box max-w-md">
                <h3 className="font-bold text-lg mb-4">Create New Shift</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Shift Name */}
                    <div>
                        <label className="label">
                            <span className="label-text">Shift Name</span>
                        </label>
                        <input
                            type="text"
                            name="shiftName"
                            value={form.shiftName}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Morning Shift"
                            className="input border! w-full"
                        />
                    </div>

                    {/* Branch */}
                    <div>
                        <label className="label">
                            <span className="label-text">Branch</span>
                        </label>
                        <select
                            name="branch"
                            value={form.branch}
                            onChange={handleChange}
                            className="select border! w-full capitalize"
                        >
                            {['dhaka', 'gaibandha'].map((branch) => (
                                <option key={branch} value={branch}>
                                    {branch}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Start / End Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">
                                <span className="label-text">Start Time</span>
                            </label>
                            <input
                                type="time"
                                name="startTime"
                                value={form.startTime}
                                onChange={handleChange}
                                required
                                className="input border! w-full"
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">End Time</span>
                            </label>
                            <input
                                type="time"
                                name="endTime"
                                value={form.endTime}
                                onChange={handleChange}
                                required
                                className="input border! w-full"
                            />
                        </div>
                    </div>

                    {/* Late & Absent */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Late After (min)
                                </span>
                            </label>
                            <input
                                type="number"
                                name="lateAfterMinutes"
                                value={form.lateAfterMinutes}
                                onChange={handleChange}
                                min="0"
                                className="input border! w-full"
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Absent After (min)
                                </span>
                            </label>
                            <input
                                type="number"
                                name="absentAfterMinutes"
                                value={form.absentAfterMinutes}
                                onChange={handleChange}
                                min="1"
                                className="input border! w-full"
                            />
                        </div>
                    </div>

                    {/* Allow OT */}
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            name="allowOT"
                            checked={form.allowOT}
                            onChange={handleChange}
                            className="checkbox checkbox-primary"
                        />
                        <span className="label-text">Allow Overtime</span>
                    </div>

                    {/* Weekends */}
                    <div>
                        <label className="label">
                            <span className="label-text">Weekend Days</span>
                        </label>

                        <div className="flex flex-wrap gap-3">
                            {weekendOptions.map((day) => {
                                const selected = form.weekends.includes(day);

                                return (
                                    <button
                                        type="button"
                                        key={day}
                                        onClick={() => toggleWeekend(day)}
                                        className={`
                                            px-3 py-1 rounded-lg border text-sm transition-all
                                            ${
                                                selected
                                                    ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-[1.05]'
                                                    : 'bg-white text-gray-800 border-gray-400 hover:bg-gray-100'
                                            }
                                        `}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="modal-action">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {loading ? 'Creating...' : 'Create Shift'}
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                document
                                    .getElementById('new-shift-modal')
                                    .close()
                            }
                            className="btn btn-outline"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}
