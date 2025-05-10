import { Box, Typography, Card, CardContent } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Navigation, Pagination } from 'swiper/modules';
import { useInterviewsContext } from '../../context/InterviewsContext';
import { formatTime } from '../Calendar/types';
import { useNavigate } from 'react-router-dom';

const InterviewChooser = () => {
    const { scheduledInterviews } = useInterviewsContext();
    const navigate = useNavigate();

    return (
        <Box display="flex" flexDirection="column" alignItems="center" py={6} bgcolor="#f0f0f3">
            <Typography variant="h5" gutterBottom>
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
                                    mx: 1,
                                    px: 2,
                                    py: 2,
                                    minWidth: 140,
                                    minHeight: 150,
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    cursor: 'pointer',
                                }}
                                onClick={() => navigate(interview.id)}
                            >
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle1">{interview.title}</Typography>
                                    <Typography variant="body1">{formatTime(interview.date)}</Typography>
                                    <Typography variant="body1">{date}</Typography>
                                </CardContent>
                            </Card>
                        </SwiperSlide>
                    ))
                )}
            </Swiper>
        </Box>
    );
};

export default InterviewChooser;
