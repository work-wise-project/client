import {
    ArrowBack,
    ArrowForward,
    Code,
    FeedOutlined,
    MenuBookOutlined,
    OndemandVideoOutlined,
} from '@mui/icons-material';
import LinkIcon from '@mui/icons-material/Link';
import { Box, Button, Card, CardContent, CircularProgress, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getInterviewPreparation } from '../services/interviewService';

type MaterialType = 'tutorial' | 'documentation' | 'exercises' | 'course' | 'video' | 'article' | 'other';

export const InterviewPreparationPage = () => {
    const navigate = useNavigate();
    const { interviewId, interviewTitle } = useParams();
    const [materialLinks, setMaterialLinks] = useState<Array<{ title: string; description: string; link: string }>>([]);
    const [companyInfo, setCompanyInfo] = useState<string>('');
    const [jobInfo, setJobInfo] = useState<string>('');
    const [page, setPage] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const itemsPerPage = 4;

    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
    const handleNext = () => setPage((prev) => Math.min(prev + 1, Math.ceil(materialLinks.length / itemsPerPage) - 1));

    useEffect(() => {
        if (!interviewId) {
            navigate('/interviewAnalysis');
            return;
        }

        const fetchPreparation = async () => {
            setLoading(true);
            try {
                const data = await getInterviewPreparation(interviewId);

                setMaterialLinks(data.material_links);
                setCompanyInfo(data.company_info);
                setJobInfo(data.job_info);
            } catch (error) {
                console.error('Failed to fetch interview preparation:', error);
                setCompanyInfo('Information about the company was not provided in the job description.');
                setJobInfo('Information about the job was not provided in the job description.');
                setMaterialLinks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPreparation();
    }, [interviewId, navigate]);

    const getMaterialType = (materialLink: { title: string; description: string; link: string }): MaterialType => {
        const titleLower = materialLink.title.toLowerCase();
        const descriptionLower = materialLink.description.toLowerCase();
        const linkLower = materialLink.link.toLowerCase();

        if (
            titleLower.includes('tutorial') ||
            titleLower.includes('guide') ||
            titleLower.includes('learn') ||
            descriptionLower.includes('tutorial') ||
            descriptionLower.includes('guide') ||
            descriptionLower.includes('learn')
        ) {
            return 'tutorial';
        }

        if (titleLower.includes('documentation') || descriptionLower.includes('documentation')) {
            return 'documentation';
        }

        if (
            titleLower.includes('exercises') ||
            descriptionLower.includes('exercises') ||
            titleLower.includes('leetcode')
        ) {
            return 'exercises';
        }

        if (
            titleLower.includes('course') ||
            titleLower.includes('training') ||
            descriptionLower.includes('course') ||
            descriptionLower.includes('training')
        ) {
            return 'course';
        }

        if (titleLower.includes('video') || descriptionLower.includes('video')) {
            return 'video';
        }

        if (
            titleLower.includes('article') ||
            descriptionLower.includes('article') ||
            linkLower.includes('blog') ||
            titleLower.includes('how i passed') ||
            titleLower.includes('i just got')
        ) {
            return 'article';
        }

        return 'other';
    };

    const getButtonText = (materialLink: { title: string; description: string; link: string }) => {
        const type = getMaterialType(materialLink);

        switch (type) {
            case 'tutorial':
                return 'Click here to go to the tutorial';
            case 'documentation':
                return 'Click here to go to the documentation';
            case 'exercises':
                return 'Click here to go to the exercises';
            case 'course':
                return 'Click here to go to the course';
            case 'video':
                return 'Click here to go to the video';
            case 'article':
                return 'Click here to go to the article';
            default:
                return 'Visit Resource';
        }
    };

    const getMaterialIcon = (materialLink: { title: string; description: string; link: string }) => {
        const type = getMaterialType(materialLink);

        switch (type) {
            case 'article':
                return <FeedOutlined sx={{ fontSize: '2.5rem', color: '#333' }} />;
            case 'exercises':
                return <Code sx={{ fontSize: '2.5rem', color: '#333' }} />;
            case 'video':
                return <OndemandVideoOutlined sx={{ fontSize: '2.5rem', color: '#333' }} />;
            case 'tutorial':
            case 'course':
            case 'documentation':
                return <MenuBookOutlined sx={{ fontSize: '2.5rem', color: '#333' }} />;
            default:
                return <LinkIcon sx={{ fontSize: '2.5rem', color: '#333' }} />;
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box display="flex" flexDirection="column" paddingInline={4}>
            <Typography
                variant="h6"
                sx={{
                    textAlign: 'start',
                    marginBlock: 4,
                    fontSize: { lg: '1.5rem', xl: '2rem' },
                }}
                color="secondary"
            >
                {interviewTitle || 'Interview Analysis'}
            </Typography>

            <Box
                display="flex"
                flexDirection="column"
                sx={{
                    overflowY: 'auto',
                    paddingBottom: '60px',
                }}
            >
                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
                    <Box flex={1}>
                        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { lg: '1.1rem', xl: '1.3rem' } }}>
                            Company Info
                        </Typography>
                        <Typography sx={{ fontSize: { lg: '0.95rem', xl: '1.1rem' } }} mt={1}>
                            {companyInfo}
                        </Typography>
                    </Box>

                    <Box flex={1}>
                        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { lg: '1.1rem', xl: '1.3rem' } }}>
                            Job Info
                        </Typography>
                        <Typography sx={{ fontSize: { lg: '0.95rem', xl: '1.1rem' } }} mt={1}>
                            {jobInfo}
                        </Typography>
                    </Box>
                </Box>

                <Box mt={1} pt={1} borderTop="1px solid #ccc">
                    <Typography variant="h6" fontWeight="bold" mb={2} sx={{ fontSize: { lg: '1.1rem', xl: '1.3rem' } }}>
                        Materials Suggestions
                    </Typography>

                    <Box display="flex" alignItems="center">
                        <IconButton
                            onClick={handlePrev}
                            disabled={page === 0}
                            sx={{
                                color: page === 0 ? '#ccc' : 'gray',
                                '& svg': { fontSize: '3rem' },
                            }}
                        >
                            <ArrowBack />
                        </IconButton>

                        <Box display="flex" flexWrap="wrap" gap={2} flex={1} justifyContent="center" height={350}>
                            {materialLinks
                                .slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage)
                                .map((item, index) => (
                                    <Card
                                        key={index}
                                        variant="outlined"
                                        sx={{
                                            width: '45%',
                                            borderRadius: '20px',
                                            height: '170px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            mx: 1.5,
                                        }}
                                    >
                                        <CardContent
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                height: '100%',
                                                position: 'relative',
                                            }}
                                        >
                                            <Box>
                                                <Box display="flex" alignItems="center" mb={1}>
                                                    {getMaterialIcon(item)}
                                                    <Typography
                                                        fontWeight="bold"
                                                        sx={{
                                                            ml: 1,
                                                            fontSize: '1.1rem',
                                                            color: 'text.primary',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        {item.title}
                                                    </Typography>
                                                </Box>

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        pl: 6,
                                                        mb: 1,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {item.description}
                                                </Typography>
                                            </Box>

                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 8,
                                                    pl: 5,
                                                }}
                                            >
                                                <Button
                                                    size="small"
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    variant="text"
                                                    sx={{ color: 'blue' }}
                                                >
                                                    {getButtonText(item)}
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                        </Box>

                        <IconButton
                            onClick={handleNext}
                            disabled={page >= Math.ceil(materialLinks.length / itemsPerPage) - 1}
                            sx={{
                                color: page >= Math.ceil(materialLinks.length / itemsPerPage) - 1 ? '#ccc' : 'gray',
                                '& svg': { fontSize: '3rem' },
                            }}
                        >
                            <ArrowForward />
                        </IconButton>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 4,
                        }}
                    >
                        {[...Array(Math.ceil(materialLinks.length / itemsPerPage) || 1)].map((_, i) => (
                            <Button
                                key={i}
                                size="small"
                                onClick={() => setPage(i)}
                                variant={page === i ? 'contained' : 'text'}
                                sx={{ mx: 0.5, minWidth: 32 }}
                            >
                                {i + 1}
                            </Button>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
