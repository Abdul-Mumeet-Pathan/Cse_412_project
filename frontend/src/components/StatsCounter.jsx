import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const StatsCounter = () => {
    // Add safe default values in case the Redux state isn't loaded yet
    const { allJobs = [], allCompanies = [] } = useSelector(store => store.job || {});
    const [stats, setStats] = useState({
        jobs: 0,
        companies: 0,
        seekers: 0
    });

    // Mock user count (replace with actual data from your backend)
    const mockUserCount = 8000000;

    useEffect(() => {
        // Ensure we have valid arrays before proceeding
        const jobsCount = Array.isArray(allJobs) ? allJobs.length : 0;
        const companiesCount = Array.isArray(allCompanies) ? allCompanies.length : 0;
        
        const calculatedStats = {
            jobs: jobsCount,
            companies: companiesCount,
            seekers: mockUserCount
        };

        // Only animate if we have positive numbers
        if (calculatedStats.jobs > 0 || calculatedStats.companies > 0) {
            const duration = 2;
            let startTime = null;

            const animateCount = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

                setStats({
                    jobs: Math.floor(progress * calculatedStats.jobs),
                    companies: Math.floor(progress * calculatedStats.companies),
                    seekers: Math.floor(progress * calculatedStats.seekers)
                });

                if (progress < 1) {
                    requestAnimationFrame(animateCount);
                }
            };

            requestAnimationFrame(animateCount);
        } else {
            // Set directly if no animation needed
            setStats(calculatedStats);
        }
    }, [allJobs, allCompanies]);

    return (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-12 px-4 rounded-xl shadow-sm">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {/* Jobs Counter */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-6"
                >
                    <h3 className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                        {stats.jobs.toLocaleString()}+
                    </h3>
                    <p className="text-gray-600 text-lg">Job Opportunities</p>
                </motion.div>

                {/* Companies Counter */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="p-6"
                >
                    <h3 className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                        {stats.companies.toLocaleString()}+
                    </h3>
                    <p className="text-gray-600 text-lg">Companies Hiring</p>
                </motion.div>

                {/* Seekers Counter */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="p-6"
                >
                    <h3 className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">
                        {stats.seekers.toLocaleString()}+
                    </h3>
                    <p className="text-gray-600 text-lg">Active Job Seekers</p>
                </motion.div>
            </div>
        </div>
    );
};

export default StatsCounter;