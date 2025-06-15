import { AccountCircle, CalendarToday, Description, Insights, School } from '@mui/icons-material';
import { Box, Button, Card, CardContent, List, ListItemIcon, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const SpotlightOverlay = ({ targetId, onClose }: { targetId: string; onClose: () => void }) => {
    const [rect, setRect] = useState<DOMRect | null>(null);

    const updateRect = () => {
        const element = document.getElementById(targetId);
        if (element) {
            setRect(element.getBoundingClientRect());
        } else {
            onClose();
        }
    };

    useEffect(() => {
        updateRect();
    }, [targetId]);

    useEffect(() => {
        document.addEventListener('click', onClose);
        window.addEventListener('resize', onClose);
        window.addEventListener('scroll', onClose);

        return () => {
            document.removeEventListener('click', onClose);
            window.removeEventListener('resize', updateRect);
            window.removeEventListener('scroll', updateRect);
        };
    }, [onClose]);

    if (!rect) {
        return <></>;
    }

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                pointerEvents: 'none',
                zIndex: 2000,
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: rect.top,
                    left: rect.left + 3,
                    width: rect.width - 6,
                    height: rect.height,
                    borderRadius: 2,
                    boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.6)`,
                    outline: '3px solid #1976d2',
                    pointerEvents: 'auto',
                    backgroundColor: 'transparent',
                    transition: 'all 0.3s ease',
                }}
            />
        </Box>
    );
};

const steps = [
    {
        icon: <CalendarToday color="primary" />,
        title: 'Step 1: Add an Interview',
        description: 'Go to the Calendar page or use the form on the home page to schedule an interview.',
        buttonText: 'Go to Calendar',
        targetId: 'calendar-page',
    },
    {
        icon: <School color="primary" />,
        title: 'Step 2: Prepare for the Interview',
        description: 'View company and job info, and access study resources.',
        buttonText: 'Go to Preparation',
        targetId: 'interview-preparation-page',
    },
    {
        icon: <Insights color="primary" />,
        title: 'Step 3: Analyze Your Interview',
        description: 'Upload a recording and receive AI-generated feedback.',
        buttonText: 'Go to Analysis',
        targetId: 'interview-analysis-page',
    },
    {
        icon: <Description color="primary" />,
        title: 'Bonus: Resume Analysis',
        description: 'Upload your resume for grammar checks and insight suggestions.',
        buttonText: 'Go to Resume Page',
        targetId: 'resume-page',
    },
    {
        icon: <AccountCircle color="primary" />,
        title: 'Optional: Complete Your Profile',
        description: 'Keep your profile up to date for more personalized feedback.',
        buttonText: 'Go to Profile',
        targetId: 'profile-page',
    },
];

export const GettingStarted = () => {
    const [highlightTarget, setHighlightTarget] = useState<string | null>(null);

    const handleGoTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => setHighlightTarget(id));
        }
    };

    return (
        <>
            {highlightTarget && (
                <SpotlightOverlay targetId={highlightTarget} onClose={() => setHighlightTarget(null)} />
            )}
            <Box sx={{ width: '75%', marginX: 'auto', padding: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 600, marginBottom: 2, textAlign: 'center' }}>
                    Getting Started with WorkWise
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', marginBottom: 4, textAlign: 'center' }}>
                    Follow these steps to prepare, practice, and improve your interview performance.
                </Typography>
                <List>
                    {steps.map(({ icon, title, description, buttonText, targetId }, index) => (
                        <Card key={index} sx={{ marginBottom: 3 }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        {title}
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                        {description}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{ ml: 2 }}
                                    onClick={() => handleGoTo(targetId)}
                                >
                                    {buttonText}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </List>
            </Box>
        </>
    );
};
