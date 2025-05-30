import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import { Briefcase, Plus, Search, Edit2, Eye, MapPin, DollarSign, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allAdminJobs = [], searchJobByText } = useSelector(store => store.job);

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  const filteredJobs = allAdminJobs.filter(job => {
    if (!searchJobByText) return true;
    return (
      job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
      job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 flex flex-col transition-colors duration-200">
      <Navbar />
      
      {/* Main Content */}
      <div className="flex-grow">
        <div className='max-w-6xl mx-auto my-10 px-4'>
          <div className='flex flex-col md:flex-row items-center justify-between my-5 gap-4'>
            <Input
              className="w-full md:w-fit dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="Filter by name, role"
              onChange={(e) => setInput(e.target.value)}
            />
            <Button 
              onClick={() => navigate("/admin/jobs/create")}
              className="w-full md:w-auto dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Jobs
            </Button>
          </div>

          {/* Flash Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard 
                  key={job._id}
                  job={job}
                  navigate={navigate}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <Briefcase className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {searchJobByText ? 'No matching jobs found' : 'No jobs available'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {searchJobByText ? 'Try a different search' : 'Create your first job'}
                </p>
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

const JobCard = ({ job, navigate }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all p-6"
  >
    {/* Company Info with Avatar */}
    <div className="flex items-center gap-3 mb-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={job?.company?.logo} />
        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
          {job?.company?.name?.charAt(0)?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="font-medium text-gray-800 dark:text-white">{job?.company?.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{job?.location}</p>
      </div>
    </div>

    {/* Job Title */}
    <h1 className="font-bold text-xl text-gray-800 dark:text-white mb-3">
      {job?.title}
    </h1>

    {/* Job Details Grid */}
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm text-gray-600 dark:text-gray-300">{job?.location || 'Not specified'}</span>
      </div>
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {job?.salary ? `BDT ${job.salary}` : 'Not specified'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm text-gray-600 dark:text-gray-300">{job?.jobType || 'Not specified'}</span>
      </div>
      <div className="flex items-center gap-2">
        <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {job?.createdAt.split("T")[0]}
        </span>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline"
        onClick={() => navigate(`/admin/jobs/update/${job._id}`)}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-700 dark:to-blue-700 text-white"
      >
        <Edit2 className="h-4 w-4" />
        Edit
      </Button>
      <Button 
        variant="outline"
        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
        className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center gap-2"
      >
        <Eye className="h-4 w-4" />
        Applicants
      </Button>
    </div>
  </motion.div>
)

export default AdminJobs