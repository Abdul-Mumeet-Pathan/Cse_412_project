import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage } from './ui/avatar';

const featuredArticles = [
    {
        id: 1,
        title: "The Future of Frontend Development",
        excerpt: "Exploring the latest trends and technologies shaping the future of frontend development in 2023.",
        category: "Frontend",
        author: {
            name: "Sarah Johnson",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        date: "2023-05-15T10:00:00Z",
        readTime: "5 min read"
    },
    {
        id: 2,
        title: "Backend Architecture Best Practices",
        excerpt: "Learn how to design scalable and maintainable backend systems with these proven patterns.",
        category: "Backend",
        author: {
            name: "Michael Chen",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        date: "2023-05-10T14:30:00Z",
        readTime: "8 min read"
    },
    {
        id: 3,
        title: "Data Science in Healthcare",
        excerpt: "How machine learning is revolutionizing patient care and medical research.",
        category: "Data Science",
        author: {
            name: "Dr. Emily Park",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg"
        },
        date: "2023-05-05T09:15:00Z",
        readTime: "10 min read"
    },
    {
        id: 4,
        title: "Designing for Accessibility",
        excerpt: "Creating inclusive digital experiences that work for everyone.",
        category: "Design",
        author: {
            name: "Alex Rivera",
            avatar: "https://randomuser.me/api/portraits/men/75.jpg"
        },
        date: "2023-04-28T16:45:00Z",
        readTime: "6 min read"
    },
    {
        id: 5,
        title: "FullStack Development in 2023",
        excerpt: "The essential tools and skills every fullstack developer needs this year.",
        category: "FullStack",
        author: {
            name: "Taylor Smith",
            avatar: "https://randomuser.me/api/portraits/women/23.jpg"
        },
        date: "2023-04-20T11:20:00Z",
        readTime: "7 min read"
    }
]

const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference/(1000*24*60*60));
}

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleArticleClick = (articleId) => {
      navigate(`/articles/${articleId}`);
  }

    return (
      <div className="my-20">
          <h2 className="text-2xl font-bold text-center mb-8">Featured Articles</h2>
          <Carousel className="w-full max-w-5xl mx-auto"> {/* Adjusted to max-w-5xl */}
              <CarouselContent>
                  {featuredArticles.map((article) => (
                      <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/2 px-3"> {/* Changed to px-3 */}
                          <motion.div 
                              className='p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 hover:shadow-xl transition-shadow h-full flex flex-col min-h-[320px] w-full' 
                              whileHover={{ y: -5 }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                          >
                              <div className='flex-grow'>
                                  <div className='flex justify-between items-start mb-4'>
                                      <Badge className='bg-purple-100 text-purple-800'>
                                          {article.category}
                                      </Badge>
                                      <p className='text-sm text-gray-500'>
                                          {daysAgoFunction(article.date) === 0 ? "Today" : `${daysAgoFunction(article.date)} days ago`}
                                      </p>
                                  </div>
                                  
                                  <h3 className='font-bold text-xl mb-3 text-gray-800'>{article.title}</h3>
                                  <p className='text-gray-600 mb-4 line-clamp-3'>{article.excerpt}</p>
                                  
                                  <div className='flex items-center gap-3 mt-auto'>
                                      <Avatar className="h-10 w-10">
                                          <AvatarImage src={article.author.avatar} />
                                      </Avatar>
                                      <div>
                                          <p className='font-medium text-sm'>{article.author.name}</p>
                                          <p className='text-xs text-gray-500'>{article.readTime}</p>
                                      </div>
                                  </div>
                              </div>
                              
                              <Button 
                                  onClick={() => handleArticleClick(article.id)}
                                  className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                              >
                                  Read Article
                              </Button>
                          </motion.div>
                      </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
          </Carousel>
      </div>
  )
}

export default CategoryCarousel