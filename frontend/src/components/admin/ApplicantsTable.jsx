import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

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
        <div className="rounded-lg border dark:border-gray-700 overflow-hidden">
            <Table className="bg-white dark:bg-gray-800">
                <TableCaption className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    A list of your recent applied users
                </TableCaption>
                <TableHeader className="bg-gray-100 dark:bg-gray-700">
                    <TableRow>
                        <TableHead className="text-gray-700 dark:text-white">FullName</TableHead>
                        <TableHead className="text-gray-700 dark:text-white">Email</TableHead>
                        <TableHead className="text-gray-700 dark:text-white">Contact</TableHead>
                        <TableHead className="text-gray-700 dark:text-white">Resume</TableHead>
                        <TableHead className="text-gray-700 dark:text-white">Date</TableHead>
                        <TableHead className="text-right text-gray-700 dark:text-white">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicants && applicants?.applications?.map((item) => (
                        <TableRow key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <TableCell className="text-gray-600 dark:text-gray-300">{item?.applicant?.fullname}</TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-300">{item?.applicant?.email}</TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-300">{item?.applicant?.phoneNumber}</TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-300">
                                {item.applicant?.profile?.resume ? (
                                    <a 
                                        className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline" 
                                        href={item?.applicant?.profile?.resume} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        {item?.applicant?.profile?.resumeOriginalName}
                                    </a>
                                ) : <span>NA</span>}
                            </TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-300">{item?.applicant.createdAt.split("T")[0]}</TableCell>
                            <TableCell className="float-right cursor-pointer">
                                <Popover>
                                    <PopoverTrigger>
                                        <MoreHorizontal className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-32 bg-white dark:bg-gray-800 border dark:border-gray-700">
                                        {shortlistingStatus.map((status, index) => (
                                            <div 
                                                onClick={() => statusHandler(status, item?._id)} 
                                                key={index} 
                                                className='flex w-fit items-center my-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                                            >
                                                <span>{status}</span>
                                            </div>
                                        ))}
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

export default ApplicantsTable