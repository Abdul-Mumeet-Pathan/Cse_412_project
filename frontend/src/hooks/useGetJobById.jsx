import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { setSingleJob } from '@/redux/jobSlice'

const useGetJobById = (id) => {
    const dispatch = useDispatch();
    const { singleJob } = useSelector(store => store.job);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/job-details/${id}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (id) fetchJobDetails();
    }, [id, dispatch]);

    return singleJob;
}

export default useGetJobById