import React, { FC, memo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

// --- Icons ---
import {
    ShieldCheck, Users, Lightbulb,
} from 'lucide-react';

// ===================================================================
// --- 1. FONT IMPORTER COMPONENT ---
// ===================================================================
// This self-contained component injects the 'Lora' font into the page head.
const FontImporter: FC = memo(() => {
    React.useEffect(() => {
        if (typeof document === 'undefined') return;
        const linkId = 'font-lora-stylesheet';
        const styleId = 'font-lora-global-styles';
        if (!document.getElementById(linkId)) {
            const link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Lora:wght@700&display=swap';
            document.head.appendChild(link);
        }
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `.font-serif::after { background-color: var(--underline-color); }`;
            document.head.appendChild(style);
        }
    }, []);
    return null;
});

// ===================================================================
// --- 2. REUSABLE HOVER TITLE COMPONENT ---
// ===================================================================
interface HoverTitleProps {
    as?: 'h2' | 'h3';
    children: React.ReactNode;
    className?: string;
    color: string;
}

const HoverTitle: FC<HoverTitleProps> = ({ as: Tag = 'h2', children, className = '', color }) => {
    // styling handled globally
    const underlineColor = color; // use the provided color for the underline

    const styleVars: React.CSSProperties & Record<string, string> = {
        color,
        fontFamily: "'Lora', serif", // Apply the cool font here
        ['--underline-color']: underlineColor
    };

    return (
        <Tag
            className={`relative inline-block cursor-pointer font-serif font-bold 
                       after:content-[''] after:absolute after:w-full after:h-[3px] 
                       after:bottom-[-4px] after:left-0 after:scale-x-0 after:origin-left 
                       after:transition-transform after:duration-300 after:ease-out
                       group-hover:after:scale-x-100 hover:after:scale-x-100 
                       ${className}`}
            style={styleVars}
        >
            {children}
        </Tag>
    );
};

// ===================================================================
// --- 3. REUSABLE CARD COMPONENT ---
// ===================================================================
interface CardColors {
    surfaceBg: string;
    iconBg: string;
    cardGlow: string;
    iconColor: string;
    cardTitleGreen: string;
    softTextColor: string;
}

interface CardProps {
    icon: FC<React.SVGProps<SVGSVGElement>>;
    title: string;
    text: string;
    colors: CardColors;
}

const Card: FC<CardProps> = ({ icon: Icon, title, text, colors }) => (
    // The "group" class here is essential. It allows hovering anywhere on the card
    // to trigger the hover effect on the HoverTitle component inside.
    <div className="group relative flex flex-col items-center text-center p-8 rounded-xl transition-all duration-500 ease-out transform hover:scale-105 hover:-translate-y-3 shadow-lg hover:shadow-2xl overflow-hidden" style={{ backgroundColor: colors.surfaceBg }}>
        <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100 group-hover:scale-110 -z-10" style={{ backgroundImage: `radial-gradient(circle, ${colors.cardGlow})` }} />
        <div className="p-3 rounded-full transition-colors duration-300" style={{ backgroundColor: colors.iconBg }}>
            <Icon className="w-12 h-12 transition-colors duration-300" style={{ color: colors.iconColor }} />
        </div>
        <HoverTitle as="h3" className="text-xl mt-5 mb-3" color={colors.cardTitleGreen}>
            {title}
        </HoverTitle>
        <p className="leading-relaxed text-base" style={{ color: colors.softTextColor }}>
            {text}
        </p>
    </div>
);

// ===================================================================
// --- 4. MAIN ABOUT COMPONENT ---
// ===================================================================
const About: FC = () => {
    const { theme } = useTheme();

    const palette = {
        light: {
            pageBg: 'transparent',
            mainTitle: 'rgb(30, 50, 70)',
            cardTitleGreen: 'rgb(50, 150, 60)',
            softTextColor: 'rgb(80, 90, 110)',
            surfaceBg: 'rgba(255, 255, 255, 0.9)',
            iconBg: 'rgba(76, 175, 80, 0.1)',
            cardGlow: 'rgba(76, 175, 80, 0.2)',
            iconColor: 'rgb(76, 175, 80)',
        },
        dark: {
            pageBg: 'transparent',
            mainTitle: 'rgb(220, 225, 230)',
            cardTitleGreen: 'rgb(102, 187, 106)',
            softTextColor: 'rgb(168, 178, 193)',
            surfaceBg: 'rgba(30, 41, 59, 0.7)',
            iconBg: 'rgba(102, 187, 106, 0.1)',
            cardGlow: 'rgba(102, 187, 106, 0.25)',
            iconColor: 'rgb(102, 187, 106)',
        }
    };

    const colors = theme === 'light' ? palette.light : palette.dark;

    const coreValues = [
        { icon: ShieldCheck, title: "Integrity", text: "Unyielding ethical standards ensuring honesty and fairness in all actions." },
        { icon: Lightbulb, title: "Innovation", text: "Creative solutions to make learning engaging, modern, and accessible for everyone." },
        { icon: Users, title: "Community", text: "A collaborative ecosystem where knowledge is shared and ideas can flourish." },
    ];

    return (
        <section id="about" className="py-20 md:py-28" style={{ backgroundColor: colors.pageBg }}>
            <FontImporter /> {/* This ensures the 'Lora' font is available */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* --- Section Header --- */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    {/* The main title now uses the HoverTitle component */}
                    <HoverTitle as="h2" className="text-4xl md:text-5xl" color={colors.mainTitle}>
                        About @mwalimu
                    </HoverTitle>
                    {/* The content below is styled for readability */}
                    <p className="mt-6 text-lg leading-relaxed" style={{ color: colors.softTextColor }}>
                        @mwalimu is a dynamic learning ecosystem founded to bridge educational gaps in Kenya. We provide a single, powerful platform for learners and educators to access high-quality resources, share knowledge, and foster a passion for lifelong learning.
                    </p>
                </div>
                
                {/* --- Core Values Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {coreValues.map((value, index) => (
                        <Card key={index} icon={value.icon} title={value.title} text={value.text} colors={colors} />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default About;