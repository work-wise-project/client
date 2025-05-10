import { SxProps } from '@mui/material';
import { Dispatch, ReactNode, SetStateAction } from 'react';

export type CollapsableCardProps = {
    isExpanded: boolean;
    setIsExpanded: Dispatch<SetStateAction<boolean>>;
    titleIcon: ReactNode;
    titleText: string;
    cardContent: ReactNode;
    cardStyle?: SxProps;
};
