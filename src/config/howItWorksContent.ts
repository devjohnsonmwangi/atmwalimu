import React from 'react';
import { FaUserCheck, FaListAlt, FaCalendarAlt, FaComments, FaSmile, FaBook } from 'react-icons/fa';
import { Zap, ShieldCheck, Users } from 'lucide-react';

export const stepsData = [
  {
    step: 1,
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
    title: 'Create your @mwalimu profile',
    icon: React.createElement(FaUserCheck, { className: "w-6 h-6" }),
    description: "Sign up quickly and build a learner or educator profile so we can personalize your experience.",
  },
  {
    step: 2,
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    title: 'Discover courses & tutors',
    icon: React.createElement(FaListAlt, { className: "w-6 h-6" }),
    description: "Browse curated courses, tutorials, and educators matched to your goals and level.",
  },
  {
    step: 3,
    imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a',
    title: 'Schedule lessons & plan',
    icon: React.createElement(FaCalendarAlt, { className: "w-6 h-6" }),
    description: "Book lessons, set milestones and sync your learning calendar with ease.",
  },
  {
    step: 4,
    imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a',
    title: 'Engage in live sessions',
    icon: React.createElement(FaComments, { className: "w-6 h-6" }),
    description: "Join interactive lessons and workshops — ask questions and get real-time feedback.",
  },
  {
    step: 5,
    imageUrl: 'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1',
    title: 'Access resources & track progress',
    icon: React.createElement(FaBook, { className: "w-6 h-6" }),
    description: "Download materials, submit assignments and monitor your growth over time.",
  },
  {
    step: 6,
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    title: 'Celebrate milestones',
    icon: React.createElement(FaSmile, { className: "w-6 h-6" }),
    description: "Earn certificates, badges and recommendations as you progress.",
  },
];

export const benefitsData = [
  {
    icon: React.createElement(Zap, { className: "w-8 h-8 text-purple-500 dark:text-purple-400" }),
    title: 'Fast, focused learning',
    description: 'Short, practical lessons and recommended learning paths tailored to your goals.',
  },
  {
    icon: React.createElement(ShieldCheck, { className: "w-8 h-8 text-green-500 dark:text-green-400" }),
    title: 'Trusted educators',
    description: 'Vetted instructors and community reviews make it easy to pick the right guide.',
  },
  {
    icon: React.createElement(Users, { className: "w-8 h-8 text-blue-500 dark:text-blue-400" }),
    title: 'Community & support',
    description: 'Study groups, mentoring and 1:1 help available to keep you on track.',
  },
];

export default {
  stepsData,
  benefitsData,
};
