import React from 'react';
import { Badge } from './ui/badge';
import { useSelector } from 'react-redux';
import { Briefcase, CalendarDays, Building2, Clock, CheckCircle2, XCircle } from 'lucide-react';

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);
    
    const statusIcons = {
        pending: <Clock className="h-4 w-4" />,
        rejected: <XCircle className="h-4 w-4" />,
        accepted: <CheckCircle2 className="h-4 w-4" />
    };

    const statusColors = {
        pending: 'bg-gray-400 dark:bg-gray-500',
        rejected: 'bg-red-400 dark:bg-red-500',
        accepted: 'bg-green-400 dark:bg-green-500'
    };

    return (
        <div className="space-y-4 p-4 dark:bg-gray-900 dark:text-gray-100">
            <h2 className="text-2xl font-bold tracking-tight">Your Job Applications</h2>
            
            {allAppliedJobs.length > 0 ? (
                <div className="grid gap-4">
                    {allAppliedJobs.map((appliedJob) => (
                        <div key={appliedJob._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold dark:text-white">{appliedJob.job?.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                        <Building2 className="h-4 w-4 mr-1" />
                                        {appliedJob.job?.company?.name}
                                    </p>
                                </div>
                                <Badge className={`${statusColors[appliedJob.status]} hover:${statusColors[appliedJob.status]} flex items-center gap-1`}>
                                    {statusIcons[appliedJob.status]}
                                    {appliedJob.status.toUpperCase()}
                                </Badge>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                                <CalendarDays className="h-4 w-4 mr-1" />
                                Applied on {appliedJob?.createdAt?.split("T")[0]}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="border rounded-lg text-center py-12 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex flex-col items-center justify-center">
                        <Briefcase className="h-12 w-12 text-gray-300 dark:text-gray-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No applications yet</h3>
                        <p className="text-gray-500 dark:text-gray-400">You haven't applied to any jobs yet.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppliedJobTable;