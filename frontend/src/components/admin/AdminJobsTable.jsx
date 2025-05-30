import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AdminJobsTable = () => { 
    const {allAdminJobs, searchJobByText} = useSelector(store=>store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(()=>{ 
        const filteredJobs = allAdminJobs.filter((job)=>{
            if(!searchJobByText){
                return true;
            };
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || 
                   job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());
        });
        setFilterJobs(filteredJobs);
    },[allAdminJobs,searchJobByText])

    return (
        <div className="rounded-lg border dark:border-gray-700 overflow-hidden">
            <Table className="bg-white dark:bg-gray-800">
                <TableCaption className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    A list of your recent posted jobs
                </TableCaption>
                <TableHeader className="bg-gray-100 dark:bg-gray-700">
                    <TableRow>
                        <TableHead className="text-gray-700 dark:text-white">Company Name</TableHead>
                        <TableHead className="text-gray-700 dark:text-white">Role</TableHead>
                        <TableHead className="text-gray-700 dark:text-white">Date</TableHead>
                        <TableHead className="text-right text-gray-700 dark:text-white">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs?.map((job) => (
                        <TableRow key={job._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <TableCell className="text-gray-600 dark:text-gray-300">{job?.company?.name}</TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-300">{job?.title}</TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-300">{job?.createdAt.split("T")[0]}</TableCell>
                            <TableCell className="text-right cursor-pointer">
                                <Popover>
                                    <PopoverTrigger>
                                        <MoreHorizontal className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-32 bg-white dark:bg-gray-800 border dark:border-gray-700">
                                        <div 
                                            onClick={()=> navigate(`/admin/companies/${job._id}`)} 
                                            className='flex items-center gap-2 w-fit cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                                        >
                                            <Edit2 className='w-4' />
                                            <span>Edit</span>
                                        </div>
                                        <div 
                                            onClick={()=> navigate(`/admin/jobs/${job._id}/applicants`)} 
                                            className='flex items-center w-fit gap-2 cursor-pointer mt-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                                        >
                                            <Eye className='w-4'/>
                                            <span>Applicants</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable