import { useState, useEffect, FC, memo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { ArrowRight, BookOpen, Users, Zap, Star, Sparkles, UserCheck, Briefcase, GraduationCap, BarChart3,  Edit3 } from 'lucide-react';

// --- Your hero images ---
import heroImage1 from '../../assets/imageses/communityimageatmwalilimu.png';
import heroImage2 from '../../assets/imageses/atmwalimuheroimage1.png';
import heroImage3 from '../../assets/imageses/docmentsimagelibrary.png';
import heroImage4 from '../../assets/imageses/subscriptionandpaymentstafssatmwalimu.png';

const imageSet = [heroImage1, heroImage2, heroImage3, heroImage4];
const themes = ['light', 'dark'] as const;
type Theme = typeof themes[number];

interface HeroProps {
    theme?: Theme;
}

// Added 'mode' prop to the button component
interface ButtonProps {
    to: string;
    children: React.ReactNode;
    mode?: 'light' | 'dark'; // Prop to indicate current mode, though not used for styling here
}

const Hero: FC<HeroProps> = ({ theme = 'light' }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [contentLoaded, setContentLoaded] = useState(false);

    const user = useSelector((state: RootState) => state.user);
    const name = user.user?.fullName || user.user?.email || null;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageSet.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setContentLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const AnimatedPanel: FC<{ delay: string; children: React.ReactNode; className?: string }> = ({ delay, children, className = '' }) => (
        <div
            style={{ perspective: '1000px', transitionDelay: delay }}
            className={`transition-all duration-700 ease-out ${contentLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
        >
            <div className={`group h-full w-full rounded-2xl bg-[rgb(var(--bg-panel))] backdrop-blur-2xl shadow-lg transition-transform duration-300 [transform-style:preserve-3d] hover:[transform:rotateX(4deg)_rotateY(-4deg)]`}>
                <div className="[transform:translateZ(40px)] h-full p-6 sm:p-8 flex flex-col justify-center">
                    {children}
                </div>
            </div>
        </div>
    );

    const ImagePanel: FC<{ images: string[]; className?: string; delay: string; }> = ({ images, className, delay }) => (
         <div
            style={{ perspective: '1000px', transitionDelay: delay }}
            className={`transition-all duration-700 ease-out ${contentLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
        >
            <div className={`group relative h-full w-full rounded-2xl bg-black overflow-hidden backdrop-blur-2xl shadow-lg transition-transform duration-300 [transform-style:preserve-3d] hover:[transform:rotateX(4deg)_rotateY(-4deg)]`}>
                {images.map((image, index) => (
                    <div key={index} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div
                            className="w-full h-full bg-contain bg-center kenburns-active"
                            style={{ backgroundImage: `url(${image})` }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    // Modified button to be wider and have a more pronounced hover effect
    const FixedBlueButton = ({ to, children, }: ButtonProps) => (
        <Link
            to={to}
            className={`group relative inline-flex items-center justify-center overflow-hidden rounded-lg px-12 py-5 text-xl font-bold shadow-xl transition-all duration-1000 ease-in-out [transform-style:preserve-3d] /* Increased duration */
             bg-blue-500
             hover:scale-[1.12] hover:shadow-3xl /* Increased scale and shadow */
             hover:[transform:rotateX(10deg)_rotateY(10deg)_translateZ(20px)] /* Increased tilt and depth */
             active:[transform:rotateX(0deg)_rotateY(0deg)_translateZ(0px)]
             text-white
             items-center /* Explicitly align items vertically center */
             `}
        >
            {/* Added inline-flex and items-center to this span */}
            <span className="relative z-10 inline-flex items-center">
                {children}
            </span>
            {/* Stronger overlay */}
            <span className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 transition-opacity duration-1000 group-hover:opacity-100"></span>
        </Link>
    );

    return (
        <div className={`min-h-screen w-full bg-[rgb(var(--bg-primary))] text-[rgb(var(--text-primary))] p-4 sm:p-6 lg:p-8 transition-colors duration-500 ${theme}`}>
            <FontStyle />
            <ThemeStyle />
            <style>
                {`
                @keyframes kenburns-subtle { 0% { transform: scale(1.0); } 100% { transform: scale(1.15); } }
                .kenburns-active { animation: kenburns-subtle 12s ease-out forwards; }

                /* Header Hover Effects */
                .header-hover-effect {
                    position: relative;
                    transition: color 0.3s ease-in-out;
                }

                .header-hover-effect::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: -5px;
                    width: 0;
                    height: 3px;
                    background-color: rgb(34 197 94); /* Emerald 500 green */
                    transition: width 0.3s ease-in-out;
                }

                .header-hover-effect:hover {
                    color: rgb(34 197 94);
                }

                .header-hover-effect:hover::after {
                    width: 100%;
                }

                .main-header-hover::after {
                    bottom: -8px;
                    height: 4px;
                }
                `}
            </style>

            <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6 [grid-auto-rows:minmax(180px,auto)]">

                {/* --- Panel 1: Main Pitch & CTA (Largest Panel) --- */}
                <AnimatedPanel delay="100ms" className="lg:col-span-2 lg:row-span-2">
                    <div>
                        <h1 className="font-heading text-xl xs:text-1xl sm:text-4xl md:text-4xl font-bold text-[rgb(var(--accent-primary))] tracking-tight leading-tight whitespace-nowrap overflow-hidden text-ellipsis header-hover-effect main-header-hover">
                            A Universe of Knowledge, for Everyone.
                        </h1>
                        <p className="mt-6 font-body text-lg text-[rgb(var(--text-secondary))] leading-relaxed max-w-2xl">
                            Welcome to <span className="font-semibold text-[rgb(var(--text-primary))]">@mwalimu</span>. Our mission is to democratize education in Kenya by providing a single, powerful platform for learners at every stage of life, built by the community, for the community.
                        </p>
                        <div className="mt-10">
                            <FixedBlueButton to={name ? "/dashboard" : "/register"} mode={theme}>
                                <span>{name ? "Continue Learning" : "Start Your Journey"}</span>
                                <ArrowRight className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
                            </FixedBlueButton>
                        </div>
                    </div>
                </AnimatedPanel>

                {/* --- Panel 2: Image Slider --- */}
                <ImagePanel images={imageSet} delay="200ms" className="lg:col-span-2 lg:row-span-2 min-h-[400px]" />

                {/* --- Panel 3: Core Features --- */}
                <AnimatedPanel delay="300ms" className="lg:col-span-2 lg:row-span-2">
                     <h2 className="font-heading text-2xl font-bold text-[rgb(var(--text-primary))] header-hover-effect">Our Core Features</h2>
                     <ul className="mt-4 space-y-4 font-body">
                        {[
                            { icon: BookOpen, title: "Vast Digital Library", text: "Access thousands of notes, KICD-approved materials, and past papers." },
                            { icon: Zap, title: "Interactive Learning", text: "Boost retention with quizzes, flashcards, and multimedia content." },
                            { icon: BarChart3, title: "Performance Tracking", text: "Monitor your progress with detailed analytics and personalized feedback." },
                        ].map((item) => (
                            <li key={item.title} className="flex items-start space-x-4">
                                <div className="flex-shrink-0 bg-[rgb(var(--accent-secondary))] p-3 rounded-full mt-1"><item.icon className="h-5 w-5 text-[rgb(var(--accent-primary))]" /></div>
                                <div>
                                    <h3 className="font-semibold text-[rgb(var(--text-primary))] header-hover-effect">{item.title}</h3>
                                    <p className="text-[rgb(var(--text-secondary))] text-sm">{item.text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </AnimatedPanel>

                {/* --- Panel 4: NEW - Share Your Knowledge --- */}
                <AnimatedPanel delay="400ms" className="text-center">
                    <Edit3 className="h-8 w-8 mx-auto text-[rgb(var(--accent-primary))]" />
                    <h2 className="font-heading text-xl font-bold text-[rgb(var(--text-primary))] mt-3 header-hover-effect">Share Your Knowledge</h2>
                    <p className="mt-2 font-body text-sm text-[rgb(var(--text-secondary))]">
                        Become a creator. Write blog posts, share your notes, and contribute to our growing community library. Your insights can help thousands of other learners.
                    </p>
                </AnimatedPanel>

                {/* --- Panel 5: Social Proof & Community --- */}
                <AnimatedPanel delay="500ms" className="text-center">
                    <Users className="h-8 w-8 mx-auto text-[rgb(var(--text-secondary))]" />
                    <h2 className="font-heading text-xl font-bold text-[rgb(var(--text-primary))] mt-3 header-hover-effect">Thriving Community</h2>
                     <div className="flex items-center justify-center gap-8 my-4">
                        <div><p className="text-3xl font-bold text-[rgb(var(--text-primary))]">10k+</p><p className="text-sm text-[rgb(var(--text-secondary))] font-body">Members</p></div>
                        <div><p className="text-3xl font-bold text-[rgb(var(--text-primary))] flex items-center">4.8<Star className="inline-block h-5 w-5 text-yellow-400 ml-1" /></p><p className="text-sm text-[rgb(var(--text-secondary))] font-body">Rating</p></div>
                    </div>
                </AnimatedPanel>

                {/* --- Panel 6: CBC Aligned --- */}
                <AnimatedPanel delay="600ms" className="lg:col-span-2 text-center">
                    <Sparkles className="h-8 w-8 mx-auto text-[rgb(var(--accent-primary))]" />
                    <h2 className="mt-4 font-heading text-xl font-bold text-[rgb(var(--text-primary))] header-hover-effect">CBC Ready & Future-Proof</h2>
                    <p className="mt-2 font-body text-sm text-[rgb(var(--text-secondary))] max-w-xs mx-auto">
                        Embrace modern learning with content meticulously crafted and aligned with Kenya's Competency-Based Curriculum.
                    </p>
                </AnimatedPanel>
                
                 {/* --- Panel 7: For Everyone --- */}
                 <AnimatedPanel delay="700ms" className="lg:col-span-2">
                     <h2 className="font-heading text-xl font-bold text-[rgb(var(--text-primary))] text-center header-hover-effect">Learning for Every Stage</h2>
                     <ul className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 font-body text-center">
                        {[
                            { icon: GraduationCap, title: "Students" },
                            { icon: UserCheck, title: "Parents" },
                            { icon: Briefcase, title: "Professionals" },
                        ].map((item) => (
                            <li key={item.title} className="flex flex-col items-center p-4 bg-[rgb(var(--bg-primary))] rounded-lg">
                                <item.icon className="h-7 w-7 text-[rgb(var(--accent-primary))]" />
                                <h3 className="font-semibold text-[rgb(var(--text-primary))] mt-2 text-base header-hover-effect">{item.title}</h3>
                            </li>
                        ))}
                    </ul>
                </AnimatedPanel>
            </div>
        </div>
    );
};

const FontStyle = memo(() => {
    const css = `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap');
        .font-heading { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Inter', sans-serif; }
    `;
    return <style>{css}</style>;
});

const ThemeStyle = memo(() => {
    const css = `
    :root {
        --accent-primary-faded: var(--accent-primary) / 0.2;
        --accent-primary-darker: 0 0 0; /* Placeholder, not used for button */
    }

    .light {
        --bg-primary: 244 244 245; /* Zinc 100 */
        --bg-panel: 255 255 255;
        --text-primary: 24 24 27; /* Zinc 900 */
        --text-secondary: 82 82 91; /* Zinc 600 */
        --accent-secondary: 59 130 246 / 0.1;
        --accent-text-light: 255 255 255;
        --accent-text-dark: 24 24 27;
    }
    .dark {
        --bg-primary: 24 24 27; /* Zinc 900 */
        --bg-panel: 39 39 42; /* Zinc 800 */
        --text-primary: 248 250 252; /* Slate 50 */
        --text-secondary: 161 161 170; /* Zinc 400 */
        --accent-secondary: 96 165 250 / 0.1;
        --accent-text-light: 255 255 255;
        --accent-text-dark: 24 24 27;
    }
    `;
    return <style>{css}</style>
})

export default Hero;