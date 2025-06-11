import { ArrowBackIosNew, ArrowForwardIos, Circle } from '@mui/icons-material';
import { Box, IconButton, IconButtonProps } from '@mui/material';
import { useState } from 'react';
import { InterviewProgress } from '../InterviewProgress';
import { InterviewProgressListProps } from './types';

const PAGE_SIZE = 3;

export const InterviewProgressList = ({ interviews }: InterviewProgressListProps) => {
    const pageNumber = Math.ceil(interviews.length / PAGE_SIZE);

    const [page, setPage] = useState(0);

    const iconButtonProps = (action: 'prev' | 'next'): IconButtonProps => {
        const disabled = { prev: page === 0, next: page === pageNumber - 1 }[action];
        const step = { prev: pageNumber - 1, next: 1 }[action];
        const newPage = (page + step) % pageNumber;

        return { color: 'primary', size: 'large', onClick: () => setPage(newPage), disabled };
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-around' }}>
                <IconButton {...iconButtonProps('prev')}>
                    <ArrowBackIosNew />
                </IconButton>
                <Box sx={{ width: '90%', display: 'flex', flexDirection: 'column', padding: 3, gap: 10 }}>
                    {interviews
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
                        .map((interview) => (
                            <InterviewProgress key={interview.id} interview={interview} />
                        ))}
                </Box>
                <IconButton {...iconButtonProps('next')}>
                    <ArrowForwardIos />
                </IconButton>
            </Box>
            <Box sx={{ display: 'flex', paddingY: 5 }}>
                {Array.from({ length: pageNumber }).map((_, index) => (
                    <IconButton
                        key={index}
                        size="small"
                        color={index === page ? 'primary' : 'default'}
                        onClick={() => setPage(index)}
                    >
                        <Circle />
                    </IconButton>
                ))}
            </Box>
        </Box>
    );
};
