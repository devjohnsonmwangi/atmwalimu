import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Video, Lightbulb, Users, TrendingUp, UserCheck, FileSearch, GraduationCap, ArrowRight, LucideProps
} from 'lucide-react';
import React from 'react';

// --- Service Item Interface ---
interface ServiceItem {
    id: string;
    icon: React.ComponentType<LucideProps>;
    title: string;
    description: string;
}

// --- Theme Definition ---
type Theme = 'light' | 'dark';

// --- Services Component Props ---
interface ServicesProps {
    theme?: Theme; // Theme prop for light/dark mode
}

/**
 * The Services component, refactored into a pure content block.
 * It is responsible ONLY for displaying the grid of services.
 * It no longer renders its own Navbar or contains any authorization logic.
 * It is designed to be placed inside a parent page (like Home.tsx)
 * which is then rendered by a Layout (like AppLayout.tsx).
 */
const Services: React.FC<ServicesProps> = ({ theme = 'light' }) => {
    const navigate = useNavigate();

    // --- @mwalimu Educational Service Data ---
    const initialServicesData: ServiceItem[] = [
        {
            id: 'revision-notes',
            icon: BookOpen,
            title: 'Revision Notes',
            description: 'Comprehensive and concise notes for all subjects, curated for effective revision.',
        },
        {
            id: 'video-lessons',
            icon: Video,
            title: 'Video Lessons',
            description: 'Engaging video tutorials and lectures from expert educators, explaining complex topics clearly.',
        },
        {
            id: 'articles-guides',
            icon: FileSearch,
            title: 'Articles & Guides',
            description: 'In-depth articles, study guides, and tips to enhance your learning journey.',
        },
        {
            id: 'exam-prep',
            icon: GraduationCap,
            title: 'Exam Preparation',
            description: 'Practice past papers, mock exams, and strategies to ace your assessments.',
        },
        {
            id: 'latest-news',
            icon: TrendingUp,
            title: 'Educational News',
            description: 'Stay updated with the latest in curriculum changes, exam news, and educational trends.',
        },
        {
            id: 'expert-advice',
            icon: Lightbulb,
            title: 'Expert Advice',
            description: 'Guidance from educators and professionals on career paths and academic success.',
        },
        {
            id: 'community-forum',
            icon: Users,
            title: 'Community Forum',
            description: 'Connect with peers, ask questions, and share knowledge in our vibrant learning community.',
        },
        {
            id: 'student-support',
            icon: UserCheck,
            title: 'Student Support',
            description: 'Get personalized help and support for your learning challenges.',
        },
    ];

    const [services, setServices] = useState(initialServicesData);
    const serviceRefs = useRef<(HTMLLIElement | null)[]>([]);

    // --- Shuffling logic for dynamic display ---
    const shuffle = (array: ServiceItem[]) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setServices((prevServices) => shuffle([...prevServices]));
        }, 30000); // Shuffle every 30 seconds
        return () => clearInterval(intervalId);
    }, []);

    // --- Intersection Observer for fade-in animation ---
    useEffect(() => {
        const currentRefs = serviceRefs.current;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove('opacity-0', 'translate-y-10');
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        currentRefs.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            currentRefs.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [services]);

    // --- Simplified navigation logic ---
    const handleServiceClick = () => {
        // This now navigates to a general page. If this route is protected,
        // the router or a wrapper component will handle redirecting to the login page.
        navigate('/documents');
    };

    // --- Color Palette for @mwalimu Theme (Light & Dark) ---
    const themeColors = {
        light: {
            background: 'bg-transparent', // Use transparent background to inherit from parent
            surfaceBg: 'bg-white/80',
            textPrimary: 'text-gray-900',
            textSecondary: 'text-gray-600',
            cardBorderHover: 'border-green-400',
            iconBg: 'bg-green-500/10',
            iconBgHover: 'group-hover:bg-green-500/20',
            iconColor: 'text-green-500',
            iconColorHover: 'group-hover:text-green-400',
            titleColor: 'text-gray-900',
            titleColorHover: 'group-hover:text-green-600',
            descriptionColor: 'text-gray-700',
        },
        dark: {
            background: 'bg-transparent', // Use transparent background
            surfaceBg: 'bg-gray-800/70',
            textPrimary: 'text-gray-200',
            textSecondary: 'text-gray-400',
            cardBorderHover: 'border-green-400',
            iconBg: 'bg-green-500/10',
            iconBgHover: 'group-hover:bg-green-500/20',
            iconColor: 'text-green-400',
            iconColorHover: 'group-hover:text-green-300',
            titleColor: 'text-gray-100',
            titleColorHover: 'group-hover:text-green-400',
            descriptionColor: 'text-gray-400',
        }
    };

    const currentThemeColors = theme === 'light' ? themeColors.light : themeColors.dark;

    return (
        // The component is now a self-contained section, not a full page.
        // It inherits the background color from its parent page (e.g., Home.tsx).
        <div className={`w-full max-w-7xl mx-auto p-6 md:p-12 ${currentThemeColors.textPrimary}`}>
            <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${currentThemeColors.titleColor} transition-colors duration-300`}>
                Discover Our Expertise
            </h2>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <li
                        key={service.id}
                        ref={el => { serviceRefs.current[index] = el; }}
                        className="opacity-0 translate-y-10 transform transition-all duration-700 ease-out group"
                    >
                        <div
                            onClick={handleServiceClick}
                            className={`
                                ${currentThemeColors.surfaceBg}
                                backdrop-blur-md p-6 rounded-xl shadow-xl hover:shadow-lg border
                                border-gray-300 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500
                                transition-all duration-400 ease-in-out transform hover:-translate-y-3 cursor-pointer h-full flex flex-col
                            `}
                        >
                            <div className="flex items-center mb-4">
                                <div className={`p-3 ${currentThemeColors.iconBg} rounded-full mr-4 ${currentThemeColors.iconBgHover} transition-colors duration-300`}>
                                    <service.icon size={28} className={`${currentThemeColors.iconColor} ${currentThemeColors.iconColorHover} transition-colors duration-300`} />
                                </div>
                                <h3 className={`font-semibold text-xl ${currentThemeColors.titleColor} ${currentThemeColors.titleColorHover} transition-colors duration-300`}>
                                    {service.title}
                                </h3>
                            </div>
                            <p className={`${currentThemeColors.descriptionColor} leading-relaxed text-sm mb-auto transition-colors duration-300`}>
                                {service.description}
                            </p>
                            <div className={`mt-6 flex justify-end items-center ${currentThemeColors.iconColor} ${currentThemeColors.iconColorHover} transition-colors duration-300`}>
                                <span className="text-sm font-medium mr-2">Learn More</span>
                                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Services;