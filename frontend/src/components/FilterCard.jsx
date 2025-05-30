import React, { useEffect, useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useDispatch } from 'react-redux';
import { setFilters } from '@/redux/jobSlice';

const locationOptions = ["Dhaka", "Sylhet", "Khulna", "Rajshahi", "Remote"];
const industryOptions = ["Frontend Developer", "Backend Developer", "FullStack Developer"];
const salaryRanges = [
    { label: "Under 40k BDT", min: 0, max: 40000 },
    { label: "40k-1L BDT", min: 40000, max: 100000 },
    { label: "1L-5L BDT", min: 100000, max: 500000 }
];

const FilterCard = () => {
    const dispatch = useDispatch();
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const [selectedSalary, setSelectedSalary] = useState(null);
    const [showAllJobs, setShowAllJobs] = useState(true);

    useEffect(() => {
        if (showAllJobs) {
            dispatch(setFilters({
                locations: [],
                industries: [],
                salaryRange: null
            }));
        } else {
            dispatch(setFilters({
                locations: selectedLocations,
                industries: selectedIndustries,
                salaryRange: selectedSalary
            }));
        }
    }, [selectedLocations, selectedIndustries, selectedSalary, showAllJobs, dispatch]);

    const toggleLocation = (location) => {
        setSelectedLocations(prev =>
            prev.includes(location)
                ? prev.filter(l => l !== location)
                : [...prev, location]
        );
        setShowAllJobs(false);
    };

    const toggleIndustry = (industry) => {
        setSelectedIndustries(prev =>
            prev.includes(industry)
                ? prev.filter(i => i !== industry)
                : [...prev, industry]
        );
        setShowAllJobs(false);
    };

    const handleSalaryChange = (range) => {
        setSelectedSalary(prev => 
            prev?.min === range.min && prev?.max === range.max ? null : range
        );
        setShowAllJobs(false);
    };

    const handleShowAllJobs = () => {
        setShowAllJobs(true);
        setSelectedLocations([]);
        setSelectedIndustries([]);
        setSelectedSalary(null);
    };

    return (
        <div className='w-full bg-white p-6 rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700'>
            <div className='mb-6'>
                <h1 className='text-xl font-semibold text-gray-900 dark:text-white'>Filter Options</h1>
                <div className='mt-2 w-8 h-0.5 bg-blue-600'></div>
            </div>

            <div className='mb-6'>
                <RadioGroup defaultValue="all" className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                            value="all" 
                            id="all" 
                            checked={showAllJobs}
                            onClick={handleShowAllJobs}
                            className="dark:border-gray-600 dark:checked:bg-blue-600"
                        />
                        <Label htmlFor="all" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                            Show All Jobs
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            <div className='mb-8'>
                <h2 className='text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3'>
                    Location
                </h2>
                <div className='space-y-2 pl-1'>
                    {locationOptions.map((location) => (
                        <div key={location} className='flex items-start'>
                            <Checkbox
                                id={`location-${location}`}
                                checked={selectedLocations.includes(location)}
                                onCheckedChange={() => toggleLocation(location)}
                                className='h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:checked:bg-blue-600'
                            />
                            <Label htmlFor={`location-${location}`} className='ml-3 text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-200 cursor-pointer'>
                                {location}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className='mb-8'>
                <h2 className='text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3'>
                    Industry
                </h2>
                <div className='space-y-2 pl-1'>
                    {industryOptions.map((industry) => (
                        <div key={industry} className='flex items-start'>
                            <Checkbox
                                id={`industry-${industry}`}
                                checked={selectedIndustries.includes(industry)}
                                onCheckedChange={() => toggleIndustry(industry)}
                                className='h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:checked:bg-blue-600'
                            />
                            <Label htmlFor={`industry-${industry}`} className='ml-3 text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-200 cursor-pointer'>
                                {industry}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className='mb-4'>
                <h2 className='text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3'>
                    Salary Range (BDT)
                </h2>
                <div className='space-y-2 pl-1'>
                    {salaryRanges.map((range) => (
                        <div key={range.label} className='flex items-start'>
                            <Checkbox
                                id={`salary-${range.label}`}
                                checked={selectedSalary?.min === range.min && selectedSalary?.max === range.max}
                                onCheckedChange={() => handleSalaryChange(range)}
                                className='h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:checked:bg-blue-600'
                            />
                            <Label htmlFor={`salary-${range.label}`} className='ml-3 text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-200 cursor-pointer'>
                                {range.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {(selectedLocations.length > 0 || selectedIndustries.length > 0 || selectedSalary) && (
                <button
                    onClick={() => {
                        setSelectedLocations([]);
                        setSelectedIndustries([]);
                        setSelectedSalary(null);
                        setShowAllJobs(true);
                    }}
                    className='mt-4 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                >
                    Clear all filters
                </button>
            )}
        </div>
    );
};

export default FilterCard;