import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import Footer from './shared/Footer';
import { setFilteredJobs } from '@/redux/jobSlice';

const Jobs = () => {
    const { allJobs, filters, searchedQuery } = useSelector(store => store.job);
    const dispatch = useDispatch();

    const filterJobList = () => {
        let filtered = [...allJobs];

        if (filters.locations.length > 0) {
            filtered = filtered.filter(job =>
                filters.locations.includes(job.location)
            );
        }

        if (filters.industries.length > 0) {
            filtered = filtered.filter(job => {
                return job.industry && filters.industries.some(selectedIndustry => 
                    job.industry.toLowerCase().includes(selectedIndustry.toLowerCase())
                );
            });
        }

        if (filters.salaryRange) {
            filtered = filtered.filter(job => {
                const jobSalary = Number(job.salary);
                return !isNaN(jobSalary) && 
                       jobSalary >= filters.salaryRange.min && 
                       jobSalary <= filters.salaryRange.max;
            });
        }

        if (searchedQuery) {
            const query = searchedQuery.toLowerCase();
            filtered = filtered.filter(job => {
                return (
                    (job.title && job.title.toLowerCase().includes(query)) ||
                    (job.description && job.description.toLowerCase().includes(query)) ||
                    (job.location && job.location.toLowerCase().includes(query))
                );
            });
        }

        dispatch(setFilteredJobs(filtered));
    };

    useEffect(() => {
        filterJobList();
    }, [filters, searchedQuery, allJobs]);

    const { filteredJobs } = useSelector(store => store.job);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <div className="max-w-7xl mx-auto mt-5 w-full px-4">
                <div className="flex gap-5">
                    <div className="w-64 flex-shrink-0">
                        <FilterCard />
                    </div>

                    {filteredJobs.length <= 0 ? (
                        <div className="flex-1 flex items-center justify-center dark:text-gray-300">
                            <span className="text-gray-500">No jobs found</span>
                        </div>
                    ) : (
                        <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
                            <div className="grid grid-cols-2 gap-4">
                                {filteredJobs.map((job) => (
                                    <motion.div
                                        key={job?._id}
                                        className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border dark:border-gray-700"
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Jobs;