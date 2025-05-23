import { Box, IconButton } from '@mui/material';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import { FieldLabel } from '../InterviewAnalysis/Form/InterviewAnalysisForm';

import { useNavigate } from 'react-router-dom';
import { Send } from '@mui/icons-material';
import { primaryIconButton } from './styles';
import { useUserContext } from '../../context/UserContext';
import { IUser } from '../../types';
import ResumeUploadButton from '../Profile/ResumeUploadButton';

const ResumeUpload = ({ currentUser }: { currentUser: IUser }) => {
    const navigate = useNavigate();
    const { setUserContext } = useUserContext();

    const handleNext = () => {
        navigate('/');
        setUserContext(currentUser);
    };

    return (
        <Box sx={{ flex: 1, mt: 3 }}>
            <FieldLabel icon={<ArticleOutlined />} label="Resume" />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexGrow: 1 }}>
                <ResumeUploadButton userId={currentUser.id} showFileName={true} />
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
