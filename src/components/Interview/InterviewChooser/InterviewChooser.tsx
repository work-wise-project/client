import { Box, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InterviewSelectSVG from '../../../assets/PeopleInterviewSelect.svg?react';
import { useInterviewsContext } from '../../../context';
import { theme } from '../../../style';
import { formatTime } from '../../Calendar/types';

export const InterviewChooser = () => {
    const { scheduledInterviews } = useInterviewsContext();
    const navigate = useNavigate();

    return (
        <Box display="flex" flexDirection="column" alignItems="center" py={12}>
            {scheduledInterviews && scheduledInterviews.size > 0 ? (
                <Box sx={{ width: '100%', maxWidth: '1200px', px: 2 }}>
                    <Typography
                        variant="h3"
                        gutterBottom
                        sx={{
                            textAlign: 'center',
                            fontSize: { lg: '2.5rem', xl: '3rem' },
                            color: theme.palette.secondary.main,
                            mb: 4,
                        }}
                    >
                        Select an interview
                    </Typography>

                    <Box sx={{ p: 2 }}>
                        <Grid
                            container
                            spacing={3}
                            sx={{
                                justifyContent: 'center',
                            }}
                        >
                            {Array.from(scheduledInterviews?.entries() || []).flatMap(([date, interviews]) =>
                                interviews.map((interview) => (
                                    <Grid
                                        key={interview.id}
                                        size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 4 }}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Card
                                            sx={{
                                                width: { xs: 280, sm: 300, md: 320, lg: 350, xl: 400 },
                                                height: 250,
                                                borderRadius: 2,
                                                boxShadow: 4,
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: 6,
                                                },
                                            }}
                                            onClick={() => navigate(`${interview.id}/${interview.title}`)}
                                        >
                                            <CardContent
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    textAlign: 'center',
                                                    gap: 2,
                                                    height: '100%',
                                                    p: 2,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        height: '100px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        component="div"
                                                        sx={{
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            lineHeight: 1.3,
                                                            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                                                        }}
                                                    >
                                                        {interview.title}
                                                    </Typography>
                                                </Box>
                                                <Divider />
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                                                >
                                                    {formatTime(interview.date)}
                                                </Typography>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                                                >
                                                    {date}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    </Box>
                </Box>
            ) : (
                <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 6, px: 3 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            textAlign: 'center',
                            fontSize: { xs: '1.5rem', lg: '2.5rem', xl: '3rem' },
                            color: theme.palette.secondary.main,
                            mb: 2,
                        }}
                    >
                        No Scheduled Interviews
                    </Typography>
                    <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={{
                            textAlign: 'center',
                            maxWidth: '500px',
                            lineHeight: 1.6,
                            fontSize: { xs: '0.9rem', xl: '1.5rem' },
                        }}
                    >
                        You can schedule interviews in the calendar section. Once scheduled, they will appear here for
                        you to select and manage.
                    </Typography>
                </Box>
            )}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '35vw',
                    zIndex: -100,
                    display: { xs: 'none', md: 'none', lg: 'none', xl: 'block' },
                }}
            >
                <InterviewSelectSVG style={{ width: '100%', height: 'auto' }} />
            </Box>
        </Box>
    );
};
