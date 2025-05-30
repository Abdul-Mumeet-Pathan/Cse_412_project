import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();
    
    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }
    
    return (
        <motion.div 
            className='p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 hover:shadow-xl transition-shadow'
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className='flex h-full'>
                {/* Left Side - Main Content */}
                <div className='flex-1 pr-4'>
                    <p className='text-sm text-gray-500 mb-2'>
                        {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
                    </p>

                    <div className='flex items-center gap-3 mb-3'>
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={job?.company?.logo} />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-lg text-gray-800'>{job?.company?.name}</h1>
                            <p className='text-sm text-gray-500'>{job?.location || 'India'}</p>
                        </div>
                    </div>

                    <h1 className='font-bold text-xl mb-2 text-gray-800'>{job?.title}</h1>
                    <p className='text-gray-600 mb-4 line-clamp-2'>{job?.description}</p>
                    
                    <Button 
                        onClick={() => navigate(`/description/${job._id}`)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                        Details
                    </Button>
                </div>

                {/* Right Side - Position/Salary Info */}
                <div className='w-1/4 flex flex-col justify-center items-end'>
                    <div className='flex flex-col gap-3'>
                        {job?.position && (
                            <Badge className='bg-blue-100 text-blue-800 px-4 py-2 text-sm w-full text-center'>
                                {job.position} Position{job.position > 1 ? 's' : ''}
                            </Badge>
                        )}
                        {job?.jobType && (
                            <Badge className='bg-purple-100 text-purple-800 px-4 py-2 text-sm w-full text-center'>
                                {job.jobType}
                            </Badge>
                        )}
                        {job?.salary && (
                            <Badge className='bg-indigo-100 text-indigo-800 px-4 py-2 text-sm w-full text-center'>
                                BDT {job.salary}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default LatestJobCards