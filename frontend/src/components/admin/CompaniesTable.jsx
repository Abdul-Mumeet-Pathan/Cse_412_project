import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();
    
    useEffect(()=>{
        const filteredCompany = companies.length >= 0 && companies.filter((company)=>{
            if(!searchCompanyByText){
                return true
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany);
    },[companies,searchCompanyByText])

    return (
        <div className="dark:bg-gray-900 dark:text-gray-100">
            <Table className="dark:bg-gray-800">
                <TableCaption className="dark:text-gray-300">A list of your recent registered companies</TableCaption>
                <TableHeader className="dark:bg-gray-700">
                    <TableRow className="dark:hover:bg-gray-700">
                        <TableHead className="dark:text-gray-200">Logo</TableHead>
                        <TableHead className="dark:text-gray-200">Name</TableHead>
                        <TableHead className="dark:text-gray-200">Date</TableHead>
                        <TableHead className="text-right dark:text-gray-200">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="dark:bg-gray-800">
                    {
                        filterCompany?.map((company) => (
                            <TableRow key={company._id} className="dark:hover:bg-gray-700">
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={company.logo}/>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="dark:text-gray-200">{company.name}</TableCell>
                                <TableCell className="dark:text-gray-200">{company.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal className="dark:text-gray-200" />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32 dark:bg-gray-800 dark:border-gray-700">
                                            <div 
                                                onClick={()=> navigate(`/admin/companies/${company._id}`)} 
                                                className='flex items-center gap-2 w-fit cursor-pointer dark:text-gray-200 dark:hover:bg-gray-700 p-2 rounded'
                                            >
                                                <Edit2 className='w-4' />
                                                <span>Edit</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable