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
        text: 'Interview preparation',
        getIcon: (color) => <AssistantOutlined color={color} />,
        path: '/interviewPreparation',
    },
    {
        text: 'Interview analysis',
        getIcon: (color) => <AutoAwesome color={color} />,
        path: '/interviewAnalysis',
    },
];
