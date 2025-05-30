import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { setSearchCompanyByText } from '@/redux/companySlice'
import { Building2, Plus, Search, Edit2, Briefcase } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'

// Import your background images
import JobImage1 from '@/assets/job1.jpg'
import JobImage2 from '@/assets/job2.jpg'
import JobImage3 from '@/assets/job3.jpg'

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { companies = [], searchCompanyByText } = useSelector(store => store.company);

    // Cycle through images every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input, dispatch]);

    const filteredCompanies = companies.filter(company => 
        company?.name?.toLowerCase()?.includes(searchCompanyByText.toLowerCase()) ||
        company?.location?.toLowerCase()?.includes(searchCompanyByText.toLowerCase())
    );

    const images = [JobImage1, JobImage2, JobImage3];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Background Images with Dark Overlay */}
            <div className="fixed inset-0 z-0">
                {images.map((image, index) => (
                    <motion.div
                        key={index}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${image})` }}
                        initial={{ opacity: 0 }}
                        animate={{ 
                            opacity: index === currentImageIndex ? 0.2 : 0,
                        }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                ))}
                <div className="absolute inset-0 bg-black/40 dark:bg-black/70"></div>
            </div>

            <Navbar />
            
            {/* Main Content */}
            <div className="flex-grow relative z-10">
                {/* Hero Section */}
                <div className="relative py-16 shadow-lg">
                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-4xl mx-auto text-center"
                        >
                            <Building2 className="h-12 w-12 text-white mx-auto mb-4" />
                            <h1 className="text-4xl font-bold text-white mb-4">Company Directory</h1>
                            <p className="text-xl text-white/90 max-w-2xl mx-auto">
                                Manage and explore all the companies in your network
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Companies Content */}
                <div className="container mx-auto px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="space-y-6"
                    >
                        {/* Search and Action Bar */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md p-6">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        className="pl-10 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Search companies by name or location..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                    />
                                </div>
                                <Button 
                                    onClick={() => navigate("/admin/companies/create")}
                                    className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add New Company
                                </Button>
                            </div>
                        </div>

                        {/* Companies Flash Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCompanies.length > 0 ? (
                                filteredCompanies.map((company) => (
                                    <CompanyCard 
                                        key={company._id}
                                        company={company}
                                        navigate={navigate}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md">
                                    <Building2 className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        {searchCompanyByText ? 'No matching companies found' : 'No companies available'}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                                        {searchCompanyByText ? 'Try a different search' : 'Create your first company'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
            
            {/* Footer */}
            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    )
}

const CompanyCard = ({ company, navigate }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
    >
        <div className="p-6">
            {/* Company Logo and Name */}
            <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16 border-2 border-blue-100 dark:border-blue-900">
                    <AvatarImage 
                        src={company.profile?.companyLogo || company.logo} 
                        alt={`${company.name} logo`}
                        className="object-cover"
                    />
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xl font-bold">
                        {company.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="font-bold text-lg text-gray-800 dark:text-white">{company.name}</h2>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">{company.location}</p>
                </div>
            </div>

            {/* Company Details */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="line-clamp-2">{company.description || 'No description available'}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <Button 
                        variant="outline"
                        onClick={() => navigate(`/admin/companies/${company._id}`)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-700 dark:to-blue-700 text-white"
                    >
                        <Edit2 className="h-4 w-4" />
                        Edit
                    </Button>
                    <Button 
                        variant="outline"
                        onClick={() => navigate('/admin/jobs')}
                        className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                        <Briefcase className="h-4 w-4" />
                        Jobs
                    </Button>
                </div>
            </div>
        </div>
    </motion.div>
)

export default Companies