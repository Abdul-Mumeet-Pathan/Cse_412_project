import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';

const articles = {
    1: {
        id: 1,
        title: "The Future of Frontend Development: 2023 Trends",
        category: "Frontend",
        author: {
            name: "Sarah Johnson",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            bio: "Senior Frontend Architect with 10+ years of experience building scalable web applications"
        },
        date: "2023-05-15T10:00:00Z",
        readTime: "8 min read",
        content: (
            <div className="prose prose-lg max-w-none">
                <h2>The Evolving Frontend Landscape</h2>
                <p>As we navigate through 2023, frontend development continues to evolve at a breakneck pace. The days of simple jQuery scripts are long gone, replaced by complex frameworks and toolchains that enable us to build applications that were unimaginable a decade ago.</p>
                
                <h3>1. The Rise of Server Components</h3>
                <p>React's introduction of Server Components represents a fundamental shift in how we think about component architecture. By moving certain components to the server, we can:</p>
                <ul>
                    <li>Reduce bundle sizes by up to 30%</li>
                    <li>Access backend resources directly</li>
                    <li>Improve SEO through faster initial render</li>
                </ul>
                
                <h3>2. WASM: Not Just for Performance</h3>
                <p>WebAssembly is moving beyond just performance-critical applications. We're now seeing libraries like <code>ffmpeg.wasm</code> that bring video processing to the browser, opening possibilities for:</p>
                <ul>
                    <li>Client-side video editing</li>
                    <li>Real-time image manipulation</li>
                    <li>CAD applications in the browser</li>
                </ul>
                
                <h2>Looking Ahead</h2>
                <p>The frontend ecosystem shows no signs of slowing down. As we look toward 2024, we anticipate further blurring of the lines between frontend and backend responsibilities, with edge computing playing a larger role in our architectures.</p>
            </div>
        )
    },
    2: {
        id: 2,
        title: "Modern Backend Architecture Patterns",
        category: "Backend",
        author: {
            name: "Michael Chen",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            bio: "CTO at TechScale with expertise in distributed systems"
        },
        date: "2023-05-10T14:30:00Z",
        readTime: "10 min read",
        content: (
            <div className="prose prose-lg max-w-none">
                <h2>Building for Scale</h2>
                <p>Modern backend systems must handle millions of requests while maintaining sub-second response times. Here are the key patterns making this possible:</p>
                
                <h3>1. The CQRS Pattern</h3>
                <p>Command Query Responsibility Segregation separates read and write operations, allowing:</p>
                <ul>
                    <li>Independent scaling of read/write workloads</li>
                    <li>Optimized data models for each operation type</li>
                    <li>Better performance for read-heavy applications</li>
                </ul>
                
                <h3>2. Event Sourcing</h3>
                <p>Instead of storing current state, we store a sequence of state-changing events. This enables:</p>
                <ul>
                    <li>Complete audit trails</li>
                    <li>Time-travel debugging</li>
                    <li>Easy reconstruction of past states</li>
                </ul>
            </div>
        )
    },
    // Continue with similar detailed articles for IDs 3, 4, and 5
    3: {
        id: 3,
        title: "Machine Learning in Healthcare Diagnostics",
        category: "Data Science",
        author: {
            name: "Dr. Emily Park",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg",
            bio: "AI Researcher at MedTech Innovations"
        },
        date: "2023-05-05T09:15:00Z",
        readTime: "12 min read",
        content: (
            <div className="prose prose-lg max-w-none">
                {/* Detailed medical ML content */}
            </div>
        )
    },
    4: {
        id: 4,
        title: "Inclusive Design: Beyond Accessibility",
        category: "Design",
        author: {
            name: "Alex Rivera",
            avatar: "https://randomuser.me/api/portraits/men/75.jpg",
            bio: "Lead UX Designer at InclusiTech"
        },
        date: "2023-04-28T16:45:00Z",
        readTime: "6 min read",
        content: (
            <div className="prose prose-lg max-w-none">
                {/* Detailed design content */}
            </div>
        )
    },
    5: {
        id: 5,
        title: "Full-Stack Development in 2023",
        category: "FullStack",
        author: {
            name: "Taylor Smith",
            avatar: "https://randomuser.me/api/portraits/women/23.jpg",
            bio: "Full-Stack Engineer at CodeCraft"
        },
        date: "2023-04-20T11:20:00Z",
        readTime: "7 min read",
        content: (
            <div className="prose prose-lg max-w-none">
                {/* Detailed full-stack content */}
            </div>
        )
    }
};

const ArticlePage = () => {
    const { articleId } = useParams();
    const article = articles[articleId];

    if (!article) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
                <Link to="/">
                    <Button variant="outline">Back to Home</Button>
                </Link>
            </div>
        );
    }

    const daysAgo = Math.floor((new Date() - new Date(article.date)) / (1000 * 60 * 60 * 24));

    return (
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
            <Navbar />
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="mb-12">
                <Badge className="bg-purple-100 text-purple-800 mb-4">
                    {article.category}
                </Badge>
                <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                
                <div className="flex items-center gap-4 mb-6">
                    <div>
                        <p className="font-medium">{article.author.name}</p>
                        <p className="text-sm text-gray-500">
                            {daysAgo === 0 ? "Today" : `${Math.floor(daysAgo)} days ago`} · {article.readTime}
                        </p>
                    </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg mb-8">
    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">About the Author</h3>
    <p className="text-sm text-gray-700 dark:text-gray-300">{article.author.bio}</p>
  </div>
            </div>

            <div className="prose prose-lg max-w-none dark:prose-invert">
    {article.content}
  </div>

            <div className="mt-12 border-t pt-8">
                <Link to="/">
                    <Button variant="outline" className="gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to all articles
                    </Button>
                </Link>
            </div>
        </div>
        <Footer />
        </div>
    );
};

export default ArticlePage;