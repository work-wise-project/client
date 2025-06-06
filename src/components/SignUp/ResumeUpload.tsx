import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import { Box, IconButton } from '@mui/material';
import { FieldLabel } from '../InterviewAnalysis/Form/InterviewAnalysisForm';

import { Send } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import ResumeUploadButton from '../Profile/ResumeUploadButton';

const ResumeUpload = () => {
    const navigate = useNavigate();
    const { setIsUserConnoted } = useUserContext();

    const handleNext = () => {
        navigate('/');
        setIsUserConnoted(true);
    };

    return (
        <Box
            sx={{
                flex: 1,
                mt: 3,
                gap: { lg: 5, xl: 15 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <FieldLabel icon={<ArticleOutlined />} label="Resume" />
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <ResumeUploadButton />
                </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton onClick={handleNext} color="primary">
                    <Send sx={{ fontSize: 40 }} />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ResumeUpload;
