import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LatestJobCards from './LatestJobCards';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);
    
    const latestJobs = [...allJobs]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);

    return (
        <div className='max-w-7xl mx-auto px-4 py-16'>
            <div className='text-center mb-12'>
                <h1 className='text-4xl md:text-5xl font-bold mb-3'>
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600'>
                        Latest & Top
                    </span> Job Openings
                </h1>
                <p className='text-gray-500 dark:text-gray-400 max-w-2xl mx-auto'>
                    Discover the most exciting career opportunities from leading companies
                </p>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {
                    latestJobs.length <= 0 ? (
                        <div className='col-span-3 text-center py-10'>
                            <p className='text-gray-500 dark:text-gray-400 text-lg'>No job openings available at the moment</p>
                        </div>
                    ) : (
                        latestJobs.map((job) => (
                            <LatestJobCards key={job._id} job={job} />
                        ))
                    )
                }
            </div>
            
            {latestJobs.length > 0 && (
                <div className='text-center mt-10'>
                    <Link 
                        to="/jobs"
                        className='inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all'
                    >
                        View All Jobs
                    </Link>
                </div>
            )}
        </div>
    );
};

export default LatestJobs;