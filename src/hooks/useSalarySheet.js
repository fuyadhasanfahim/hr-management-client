import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useSalarySheet({ search, month, page, rows }) {
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        axios
            .get(`${import.meta.env.VITE_BASE_URL}/salary/get-salary-sheet`, {
                params: {
                    search,
                    month,
                    page,
                    limit: rows,
                },
            })
            .then((res) => {
                if (isMounted) {
                    setData(res.data.data);
                    setTotalPages(res.data.totalPages);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [search, month, page, rows]);

    return { data, totalPages, loading };
}
