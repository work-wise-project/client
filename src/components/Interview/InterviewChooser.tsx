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
        <Box display="flex" flexDirection="column" alignItems="center" py={6}>
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
                style={{ padding: '40px', width: '60%', maxWidth: '1000px' }}
            >
                {Array.from(scheduledInterviews?.entries() || []).flatMap(([date, interviews]) =>
                    interviews.map((interview) => (
                        <SwiperSlide key={interview.id}>
                            <Card
                                sx={{
                                    p: 1,
                                    minWidth: 140,
                                    minHeight: 150,
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    cursor: 'pointer',
                                }}
                                onClick={() => navigate(`${interview.id}/${interview.title}`)}
                            >
                                <CardContent
                                    sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', gap: 2 }}
                                >
                                    <Typography variant="h6" component="div" gutterBottom>
                                        {interview.title}
                                    </Typography>
                                    <Divider />
                                    <Typography variant="subtitle1">{formatTime(interview.date)}</Typography>
                                    <Typography variant="subtitle1">{date}</Typography>
                                </CardContent>
                            </Card>
                        </SwiperSlide>
                    ))
                )}
            </Swiper>
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '35vw',
                    zIndex: 0,
                    display: { lg: 'none', xl: 'block' },
                }}
            >
                <InterviewSelectSVG style={{ width: '100%', height: 'auto' }} />
            </Box>
        </Box>
    );
};

export default InterviewChooser;
