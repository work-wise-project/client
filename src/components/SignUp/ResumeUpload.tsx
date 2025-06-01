import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import { Box, IconButton } from '@mui/material';
import { FieldLabel } from '../InterviewAnalysis/Form/InterviewAnalysisForm';

import { Send } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import ResumeUploadButton from '../Profile/ResumeUploadButton';
import { primaryIconButton } from './styles';

const ResumeUpload = () => {
    const navigate = useNavigate();
    const { setIsUserConncted } = useUserContext();

    const handleNext = () => {
        navigate('/');
        setIsUserConncted(true);
    };

    return (
        <Box sx={{ flex: 1, mt: 3 }}>
            <FieldLabel icon={<ArticleOutlined />} label="Resume" />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexGrow: 1 }}>
                <ResumeUploadButton />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <IconButton onClick={handleNext}>
                    <Send sx={{ fontSize: 40, ...primaryIconButton }} />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ResumeUpload;
