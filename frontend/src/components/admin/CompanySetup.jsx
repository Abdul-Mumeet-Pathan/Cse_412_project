import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2, Globe, MapPin, Building2, FileImage } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const {singleCompany} = useSelector(store=>store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [preview, setPreview] = useState("");

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, file });
            setPreview(URL.createObjectURL(file));
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany.name || "",
                description: singleCompany.description || "",
                website: singleCompany.website || "",
                location: singleCompany.location || "",
                file: singleCompany.file || null
            });
            if (singleCompany.profile?.companyLogo) {
                setPreview(singleCompany.profile.companyLogo);
            }
        }
    }, [singleCompany]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex flex-col">
            <Navbar />
            
            <div className="flex-grow">
                <div className='flex items-center justify-center py-10'>
                    <div className='w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-10 transform transition duration-500 hover:scale-[1.01] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] dark:bg-gray-800 dark:border dark:border-gray-700'>
                        <div className="flex items-center gap-4 mb-8">
                            <Button 
                                onClick={() => navigate("/admin/companies")} 
                                variant="outline" 
                                size="icon"
                                className="rounded-full dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                                <Building2 className="h-6 w-6" />
                                Company Profile Setup
                            </h1>
                        </div>

                        <form onSubmit={submitHandler}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                            <Building2 className="h-4 w-4" />
                                            Company Name
                                        </Label>
                                        <Input
                                            type="text"
                                            name="name"
                                            value={input.name}
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
                                            <Globe className="h-4 w-4" />
                                            Website
                                        </Label>
                                        <Input
                                            type="text"
                                            name="website"
                                            value={input.website}
                                            onChange={changeEventHandler}
                                            className="bg-white border-gray-300 focus:border-blue-500 p-3 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                            <FileImage className="h-4 w-4" />
                                            Company Logo
                                        </Label>
                                        <div className="flex items-center gap-4">
                                            {preview && (
                                                <img 
                                                    src={preview} 
                                                    alt="Company logo preview" 
                                                    className="h-16 w-16 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                                                />
                                            )}
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={changeFileHandler}
                                                className="bg-white border-gray-300 focus:border-blue-500 p-3 rounded-xl dark:bg-gray-700 dark:border-gray-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                            <Building2 className="h-4 w-4" />
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
                                </div>
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
                                    ) : "Update Company Profile"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    )
}

export default CompanySetup