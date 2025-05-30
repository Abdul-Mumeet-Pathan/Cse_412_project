import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock } from 'lucide-react'
import useGetJobById from '@/hooks/useGetJobById'

const UpdateJob = () => {
    const params = useParams();
    useGetJobById(params.id);
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { companies } = useSelector(store => store.company);
    const { singleJob } = useSelector(store => store.job);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company)=> company.name.toLowerCase() === value);
        setInput({...input, companyId:selectedCompany._id});
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.put(`${JOB_API_END_POINT}/update/${params.id}`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (singleJob) {
            setInput({
                title: singleJob.title || "",
                description: singleJob.description || "",
                requirements: singleJob.requirements || "",
                salary: singleJob.salary || "",
                location: singleJob.location || "",
                jobType: singleJob.jobType || "",
                experience: singleJob.experience || "",
                position: singleJob.position || 0,
                companyId: singleJob.companyId || ""
            });
        }
    }, [singleJob]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-gray-600 dark:to-gray-700">
            <Navbar />
            <div className='flex items-center justify-center py-10'>
                <div className='w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-10 transform transition duration-500 hover:scale-[1.01] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] dark:bg-gray-800 dark:border dark:border-gray-700'>
                    <div className="flex items-center gap-4 mb-8">
                        <Button 
                            onClick={() => navigate("/admin/jobs")} 
                            variant="outline" 
                            size="icon"
                            className="rounded-full dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                            <Briefcase className="h-6 w-6" />
                            Update Job Information
                        </h1>
                    </div>

                    <form onSubmit={submitHandler}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <Briefcase className="h-4 w-4" />
                                        Job Title
                                    </Label>
                                    <Input
                                        type="text"
                                        name="title"
                                        value={input.title}
                                        onChange={changeEventHandler}
                                        className="bg-white border-gray-300 focus:border-blue-500 p-3 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <MapPin className="h-4 w-4" />
                                        Location
                                    </Label>
                                    <Input
                                        type="text"
                                        name="location"
                                        value={input.location}
                                        onChange={changeEventHandler}
                                        className="bg-white border-gray-300 focus:border-blue-500 p-3 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <DollarSign className="h-4 w-4" />
                                        Salary
                                    </Label>
                                    <Input
                                        type="text"
                                        name="salary"
                                        value={input.salary}
                                        onChange={changeEventHandler}
                                        className="bg-white border-gray-300 focus:border-blue-500 p-3 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <Clock className="h-4 w-4" />
                                        Job Type
                                    </Label>
                                    <Input
                                        type="text"
                                        name="jobType"
                                        value={input.jobType}
                                        onChange={changeEventHandler}
                                        className="bg-white border-gray-300 focus:border-blue-500 p-3 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <Briefcase className="h-4 w-4" />
                                        Requirements
                                    </Label>
                                    <Input
                                        type="text"
                                        name="requirements"
                                        value={input.requirements}
                                        onChange={changeEventHandler}
                                        className="bg-white border-gray-300 focus:border-blue-500 p-3 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <Briefcase className="h-4 w-4" />
                                        Experience Level
                                    </Label>
                                    <Input
                                        type="text"
                                        name="experience"
                                        value={input.experience}
                                        onChange={changeEventHandler}
                                        className="bg-white border-gray-300 focus:border-blue-500 p-3 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <Briefcase className="h-4 w-4" />
                                        Number of Positions
                                    </Label>
                                    <Input
                                        type="number"
                                        name="position"
                                        value={input.position}
                                        onChange={changeEventHandler}
                                        className="bg-white border-gray-300 focus:border-blue-500 p-3 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>

                                {companies.length > 0 && (
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                            <Briefcase className="h-4 w-4" />
                                            Company
                                        </Label>
                                        <Select 
                                            onValueChange={selectChangeHandler} 
                                            defaultValue={singleJob?.company?.name?.toLowerCase()}
                                        >
                                            <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <SelectValue placeholder="Select a Company" />
                                            </SelectTrigger>
                                            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                                <SelectGroup>
                                                    {companies.map((company) => (
                                                        <SelectItem 
                                                            key={company._id} 
                                                            value={company?.name?.toLowerCase()}
                                                            className="dark:hover:bg-gray-600"
                                                        >
                                                            {company.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 space-y-2">
                            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <Briefcase className="h-4 w-4" />
                                Description
                            </Label>
                            <textarea
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                rows="4"
                                className="flex w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>

                        <div className="mt-8 flex justify-end">
                            <Button 
                                type="submit" 
                                className="w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : "Update Job"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default UpdateJob