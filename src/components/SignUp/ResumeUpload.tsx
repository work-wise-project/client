import { Send } from '@mui/icons-material';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import { Box, CircularProgress, IconButton } from '@mui/material';
import { HttpStatusCode } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import userService from '../../services/userService';
import { IUser } from '../../types';
import { FieldLabel } from '../InterviewAnalysis/Form/InterviewAnalysisForm';
import ResumeUploadButton from '../Profile/ResumeUploadButton';

const ResumeUpload = ({
    userData,
    googleCredential,
}: {
    userData: Partial<IUser> | null;
    googleCredential: string;
}) => {
    const navigate = useNavigate();
    const { storeUserSession, clearUserSession } = useUserContext();
    const [shouldUploadNow, setShouldUploadNow] = useState(false);
    const [registerResponse, setRegisterResponse] = useState<{
        accessToken: string;
        refreshToken: string;
        user: IUser;
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleNext = async () => {
        setLoading(true);
        try {
            const { response } = await userService.googleRegister(googleCredential, userData);
            if (response.status === HttpStatusCode.Ok) {
                setRegisterResponse(response.data);
                setShouldUploadNow(true);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            clearUserSession();
            navigate('/welcome', { replace: true });
        }
    };

    const handleUploadSuccess = () => {
        setShouldUploadNow(false);
        if (registerResponse) {
            storeUserSession(registerResponse);
        }
        setLoading(false);
        navigate('/');
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
            {loading && (
                <Box sx={{ mt: 10 }}>
                    <CircularProgress />
                </Box>
            )}

            <Box
                sx={{
                    display: loading ? 'none' : 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <FieldLabel icon={<ArticleOutlined />} label="Resume" />
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <ResumeUploadButton
                        userId={registerResponse?.user.id}
                        shouldUploadNow={shouldUploadNow}
                        onUploadSuccess={handleUploadSuccess}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <IconButton onClick={handleNext} color="primary">
                        <Send sx={{ fontSize: 40 }} />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default ResumeUpload;
