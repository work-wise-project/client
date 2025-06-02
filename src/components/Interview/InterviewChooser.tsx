import { Box, Typography, Card, CardContent, Divider } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Navigation, Pagination } from 'swiper/modules';
import { useInterviewsContext } from '../../context/InterviewsContext';
import { formatTime } from '../Calendar/types';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../style';
import InterviewSelectSVG from '../../assets/PeopleInterviewSelect.svg?react';

const InterviewChooser = () => {
    const { scheduledInterviews } = useInterviewsContext();
    const navigate = useNavigate();

    return (
        <Box display="flex" flexDirection="column" alignItems="center" py={12}>
            {scheduledInterviews && scheduledInterviews.size > 0 ? (
                <Box>
                    <Typography
                        variant="h3"
                        gutterBottom
                        sx={{
                            textAlign: 'center',
                            fontSize: { lg: '2.5rem', xl: '3rem' },
                            color: theme.palette.secondary.main,
                        }}
                    >
                        Select an interview
                    </Typography>

                    <Swiper
                        slidesPerView={3}
                        spaceBetween={10}
                        navigation
                        pagination={{ clickable: true }}
                        modules={[Navigation, Pagination]}
                        style={{ padding: '40px', width: '100%', maxWidth: '1000px' }}
                    >
                        {Array.from(scheduledInterviews?.entries() || []).flatMap(([date, interviews]) =>
                            interviews.map((interview) => (
                                <SwiperSlide key={interview.id}>
                                    <Card
                                        sx={{
                                            p: 1,
                                            minWidth: 140,
                                            height: 250,
                                            borderRadius: 2,
                                            boxShadow: 3,
                                            cursor: 'pointer',
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
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    height: { lg: '12vh', xl: '8vh' },
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
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                        lineHeight: 1.4,
                                                    }}
                                                >
                                                    {interview.title}
                                                </Typography>
                                            </Box>
                                            <Divider />
                                            <Typography variant="subtitle1">{formatTime(interview.date)}</Typography>
                                            <Typography variant="subtitle1">{date}</Typography>
                                        </CardContent>
                                    </Card>
                                </SwiperSlide>
                            ))
                        )}
                    </Swiper>
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
                    zIndex: 0,
                    display: { xs: 'none', md: 'none', lg: 'none', xl: 'block' },
                }}
            >
                <InterviewSelectSVG style={{ width: '100%', height: 'auto' }} />
            </Box>
        </Box>
    );
};

export default InterviewChooser;
