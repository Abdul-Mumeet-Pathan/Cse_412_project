import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

// Job images
import JobImage1 from '@/assets/job1.jpg';
import JobImage2 from '@/assets/job2.jpg';
import JobImage3 from '@/assets/job3.jpg';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Cycle through images every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const searchJobHandler = (e) => {
        e.preventDefault();
        if (query.trim()) {
            dispatch(setSearchedQuery(query));
            navigate("/browse");
        }
    };

    const images = [JobImage1, JobImage2, JobImage3];
    const popularSearches = ["Developer", "Designer", "Remote", "Marketing"];

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Images with Dark Overlay */}
            <div className="absolute inset-0 z-0">
                {images.map((image, index) => (
                    <motion.div
                        key={index}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${image})` }}
                        initial={{ opacity: 0 }}
                        animate={{ 
                            opacity: index === currentImageIndex ? 1 : 0,
                        }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                ))}
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-6xl px-4 py-20">
                {/* Text Content */}
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6"
                    >
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Dream Job</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-xl text-white/90 max-w-2xl mx-auto"
                    >
                        Discover your next career opportunity with our curated job listings
                    </motion.p>
                </div>

                {/* Search Container */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="w-full max-w-2xl mx-auto"
                >
                    {/* Solid container for search */}
                    <div className="bg-white rounded-xl shadow-2xl p-1">
                        <form onSubmit={searchJobHandler} className="w-full">
                            <div className="flex items-center">
                                <div className="pl-5 pr-3">
                                    <Search className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Job title, keywords, or company"
                                    className="flex-1 py-5 px-2 outline-none text-gray-800 placeholder-gray-500 text-lg"
                                />
                                <Button
                                    type="submit"
                                    className="h-full px-8 py-5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium text-lg"
                                >
                                    Search
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Popular Searches */}
                    <motion.div 
                        className="mt-6 flex flex-wrap justify-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                    >
                        {popularSearches.map((job) => (
                            <button
                                key={job}
                                onClick={() => setQuery(job)}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-all border border-white/20 hover:border-white/40"
                            >
                                {job}
                            </button>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;