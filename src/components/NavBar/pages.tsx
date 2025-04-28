import { ArticleOutlined, AssistantOutlined, AutoAwesome, HomeOutlined } from '@mui/icons-material';
import { IconProps } from '@mui/material';
import { ReactNode } from 'react';

type PageConfig = {
    text: string;
    getIcon: (color: IconProps['color']) => ReactNode;
    path: string;
};

export const pages: PageConfig[] = [
    {
        text: 'Home',
        getIcon: (color) => <HomeOutlined color={color} />,
        path: '/',
    },
    {
        text: 'Resume',
        getIcon: (color) => <ArticleOutlined color={color} />,
        path: '/resume',
    },
    {
        text: 'Interview analysis',
        getIcon: (color) => <AutoAwesome color={color} />,
        // placeholder path for testing - until we'll have a InterviewChooser page
        path: '/interviewAnalysis/5c89f7d9-4af8-4b69-8751-2c9f4c6eab84',
    },
    {
        text: 'Interview preparation',
        getIcon: (color) => <AssistantOutlined color={color} />,
        path: '/interviewPreparation',
    },
];
