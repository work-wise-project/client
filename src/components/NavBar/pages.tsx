import { ArticleOutlined, AssistantOutlined, AutoAwesome, CalendarMonth, HomeOutlined } from '@mui/icons-material';
import { IconProps } from '@mui/material';
import { ReactNode } from 'react';

type PageConfig = {
    text: string;
    getIcon: (color: IconProps['color']) => ReactNode;
    path: string;
    id?: string;
};

export const pages: PageConfig[] = [
    {
        text: 'Home',
        getIcon: (color) => <HomeOutlined color={color} />,
        path: '/',
    },
    {
        text: 'Calendar',
        getIcon: (color) => <CalendarMonth color={color} />,
        path: '/calendar',
        id: 'calendar-page',
    },
    {
        text: 'Resume',
        getIcon: (color) => <ArticleOutlined color={color} />,
        path: '/resume',
        id: 'resume-page',
    },
    {
        text: 'Interview Preparation',
        getIcon: (color) => <AssistantOutlined color={color} />,
        path: '/interviewPreparation',
        id: 'interview-preparation-page',
    },
    {
        text: 'Interview Analysis',
        getIcon: (color) => <AutoAwesome color={color} />,
        path: '/interviewAnalysis',
        id: 'interview-analysis-page',
    },
];
