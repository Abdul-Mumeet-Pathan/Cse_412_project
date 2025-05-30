import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAllApplicants } from '@/redux/applicationSlice'
import { motion } from 'framer-motion'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { toast } from 'sonner'

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { 
                    withCredentials: true 
                });
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllApplicants();
    }, [params.id, dispatch]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 flex flex-col transition-colors duration-200">
            <Navbar />
            
            {/* Main Content */}
            <div className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            Applicants <span className="text-blue-600 dark:text-blue-400">({applicants?.applications?.length || 0})</span>
                        </h1>
                    </div>

                    {/* Flash Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applicants?.applications?.length > 0 ? (
                            applicants.applications.map((item) => (
                                <ApplicantCard key={item._id} applicant={item} />
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                <p className="text-gray-500 dark:text-gray-400 text-lg">No applicants found for this position</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    )
}

const ApplicantCard = ({ applicant }) => {
    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all p-6 transform hover:scale-[1.02]"
        >
            {/* Applicant Header with Larger Avatar */}
            <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-20 w-20 border-2 border-indigo-100 dark:border-indigo-900">
                    <AvatarImage 
                        src={applicant.applicant?.profile?.profilePicture} 
                        alt={`${applicant.applicant?.fullname}'s profile`}
                        className="object-cover"
                    />
                    <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-2xl font-bold">
                        {applicant.applicant?.fullname?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="font-bold text-lg text-gray-800 dark:text-white">{applicant.applicant?.fullname}</h2>
                    <p className="text-indigo-600 dark:text-indigo-400 text-sm">{applicant.applicant?.email}</p>
                </div>
            </div>

            {/* Applicant Details */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Contact:</span>
                    <span>{applicant.applicant?.phoneNumber || 'Not provided'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Applied:</span>
                    <span>{new Date(applicant.applicant?.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Resume:</span>
                    {applicant.applicant?.profile?.resume ? (
                        <a 
                            href={applicant.applicant?.profile?.resume} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 hover:underline hover:text-indigo-800 dark:hover:text-indigo-300"
                        >
                            {applicant.applicant?.profile?.resumeOriginalName || 'View Resume'}
                        </a>
                    ) : (
                        <span className="text-gray-500 dark:text-gray-400">Not provided</span>
                    )}
                </div>
            </div>

            {/* Status Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex gap-3">
                    <button
                        onClick={() => statusHandler("Accepted", applicant._id)}
                        className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Accept
                    </button>
                    <button
                        onClick={() => statusHandler("Rejected", applicant._id)}
                        className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Reject
                    </button>
                </div>
                
                <Badge variant="outline" className="text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                    {applicant.status || 'Pending'}
                </Badge>
            </div>
        </motion.div>
    )
}

export default Applicants