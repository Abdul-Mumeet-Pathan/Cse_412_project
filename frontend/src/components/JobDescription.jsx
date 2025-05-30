import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import { setSingleJob } from '@/redux/jobSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, User, Calendar } from 'lucide-react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import JobApplicationForm from './JobApplicationForm'

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job)
    const { user } = useSelector(store => store.auth)
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false
    const [isApplied, setIsApplied] = useState(isIntiallyApplied)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const navigate = useNavigate()

    const params = useParams()
    const jobId = params.id
    const dispatch = useDispatch()

    const handleApplicationSuccess = () => {
        setIsApplied(true)
        const updatedSingleJob = {
            ...singleJob, 
            applications: [...singleJob.applications, { applicant: user?._id }]
        }
        dispatch(setSingleJob(updatedSingleJob))
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true })
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job))
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchSingleJob()
    }, [jobId, dispatch, user?._id])

   const formatRequirements = (requirements) => {
    if (!requirements || requirements.length === 0) return null;
    
    // If requirements is already an array (from backend)
    if (Array.isArray(requirements)) {
        return requirements.map((req, i) => (
            <li key={i} className="mb-2 text-gray-600 dark:text-gray-300">
                {req}
            </li>
        ));
    }
    
    // If requirements is a string (fallback)
    const reqs = requirements.includes('\n') 
        ? requirements.split('\n') 
        : requirements.split(',');
    
    return reqs.map((req, i) => (
        <li key={i} className="mb-2 text-gray-600 dark:text-gray-300">
            {req.trim()}
        </li>
    ));
};

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            <Navbar />

            <div className="flex-1">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 mb-6 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft size={18} />
                        Back to Jobs
                    </Button>

                    {/* Main Job Card with gradient background */}
                    <div className='bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700'>
                        {/* Job Header */}
                        <div className='p-6 border-b border-gray-100 dark:border-gray-700'>
                            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                <div className='flex items-start gap-4'>
                                    <div className="flex-shrink-0">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-yellow-200 dark:border-yellow-600">
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                viewBox="0 0 24 24" 
                                                fill="currentColor" 
                                                className="w-8 h-8 text-white"
                                            >
                                                <path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className='font-bold text-2xl text-gray-900 dark:text-white'>{singleJob?.title}</h1>
                                        <p className='text-lg text-gray-600 dark:text-gray-300'>{singleJob?.company?.name}</p>
                                        <div className='flex flex-wrap gap-2 mt-3'>
                                            <Badge variant="outline" className="flex items-center gap-1 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                                                <MapPin className="h-4 w-4" />
                                                {singleJob?.location}
                                            </Badge>
                                            <Badge variant="outline" className="flex items-center gap-1 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                                                <Briefcase className="h-4 w-4" />
                                                {singleJob?.jobType}
                                            </Badge>
                                            <Badge variant="outline" className="flex items-center gap-1 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                                                <Clock className="h-4 w-4" />
                                                Posted {singleJob?.createdAt?.split("T")[0]}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={isApplied ? null : () => setIsFormOpen(true)}
                                    disabled={isApplied || new Date() > new Date(singleJob?.deadline)}
                                    className={`h-12 text-lg ${
                                        isApplied ? 
                                            'bg-gray-600 dark:bg-gray-700 cursor-not-allowed' :
                                            new Date() > new Date(singleJob?.deadline) ?
                                                'bg-red-600 dark:bg-red-700 cursor-not-allowed' :
                                                'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-700 dark:to-blue-700 dark:hover:from-purple-800 dark:hover:to-blue-800'
                                    } text-white`}
                                >
                                    {isApplied ? 'Already Applied' : 
                                     new Date() > new Date(singleJob?.deadline) ? 'Application Closed' : 'Apply Now'}
                                </Button>
                            </div>
                        </div>

                        {/* Job Details */}
                        <div className='grid md:grid-cols-3 gap-8 p-6'>
                            {/* Main Description */}
                            <div className='md:col-span-2 space-y-6'>
                                <section>
                                    <h2 className='text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700'>Job Description</h2>
                                    <div className='prose max-w-none text-gray-600 dark:text-gray-300'>
                                        {singleJob?.description?.split('\n').map((para, i) => (
                                            <p key={i} className='mb-4'>{para}</p>
                                        ))}
                                    </div>
                                </section>

                                {/* Requirements Section */}
                                {singleJob?.requirements && (
                                    <section>
                                        <h2 className='text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700'>Requirements</h2>
                                        <ul className='list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300'>
                                            {formatRequirements(singleJob.requirements)}
                                        </ul>
                                    </section>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className='space-y-6'>
                                <div className='bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm'>
                                    <h3 className='font-medium mb-4 text-gray-800 dark:text-white text-lg'>Job Overview</h3>
                                    <div className='space-y-4'>
                                        <div className='flex items-center gap-3'>
                                            <DollarSign className='h-5 w-5 text-blue-500 dark:text-blue-400' />
                                            <div>
                                                <p className='text-sm text-gray-500 dark:text-gray-400'>Salary</p>
                                                <p className='font-medium text-gray-700 dark:text-gray-300'>BDT{singleJob?.salary}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <Briefcase className='h-5 w-5 text-blue-500 dark:text-blue-400' />
                                            <div>
                                                <p className='text-sm text-gray-500 dark:text-gray-400'>Job Type</p>
                                                <p className='font-medium text-gray-700 dark:text-gray-300'>{singleJob?.jobType}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <User className='h-5 w-5 text-blue-500 dark:text-blue-400' />
                                            <div>
                                                <p className='text-sm text-gray-500 dark:text-gray-400'>Experience</p>
                                                <p className='font-medium text-gray-700 dark:text-gray-300'>{singleJob?.experience} yrs</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <Calendar className='h-5 w-5 text-blue-500 dark:text-blue-400' />
                                            <div>
                                                <p className='text-sm text-gray-500 dark:text-gray-400'>Posted Date</p>
                                                <p className='font-medium text-gray-700 dark:text-gray-300'>{singleJob?.createdAt?.split("T")[0]}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <User className='h-5 w-5 text-blue-500 dark:text-blue-400' />
                                            <div>
                                                <p className='text-sm text-gray-500 dark:text-gray-400'>Applicants</p>
                                                <p className='font-medium text-gray-700 dark:text-gray-300'>{singleJob?.applications?.length}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className='h-5 w-5 text-blue-500 dark:text-blue-400' />
                                            <div>
                                                <p className='text-sm text-gray-500 dark:text-gray-400'>Deadline</p>
                                                <p className='font-medium text-gray-700 dark:text-gray-300'>
                                                    {new Date(singleJob?.deadline).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Company Info */}
                                {singleJob?.company?.about && (
                                    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5'>
                                        <h3 className='font-medium mb-3 text-gray-800 dark:text-white'>About {singleJob?.company?.name}</h3>
                                        <p className='text-sm text-gray-600 dark:text-gray-300'>{singleJob?.company?.about}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Form Dialog */}
            <JobApplicationForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                jobId={jobId}
                onSuccess={handleApplicationSuccess}
            />

            <Footer />
        </div>
    )
}

export default JobDescription