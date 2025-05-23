import { useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import { FieldLabel } from '../InterviewAnalysis/Form/InterviewAnalysisForm';
import { HttpStatusCode } from 'axios';
import resumeService from '../../services/resumeService';
import { useNavigate } from 'react-router-dom';
import { Send } from '@mui/icons-material';
import { primaryIconButton } from './styles';
import { useUserContext } from '../../context/UserContext';
import { VisuallyHiddenInput } from '../../pages/ResumePage';
import { IUser } from '../../types';

const ResumeUpload = ({ currentUser }: { currentUser: IUser }) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const navigate = useNavigate();
    const { setUserContext } = useUserContext();

    const uploadFileToServer = async (selectedFile: File) => {
        try {
            const formData = new FormData();
            formData.append('resume', selectedFile);

            const { response } = await resumeService.uploadResume(currentUser.id, formData);

            if (response.status != HttpStatusCode.Ok) {
                throw new Error('Failed to upload file');
            }
            const { data } = response;
            setFileName(selectedFile.name);
            return data.filePath;
        } catch (error) {
            console.error('Error uploading file:', error);
            setFileName(null);

            throw error;
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;

        try {
            await uploadFileToServer(selectedFile);
            event.target.value = '';
        } catch (error) {
            console.error('Error handling file change:', error);
        }
    };

    const handleNext = () => {
        navigate('/');
        setUserContext(currentUser);
    };

    return (
        <Box sx={{ flex: 1, mt: 3 }}>
            <FieldLabel icon={<ArticleOutlined />} label="Resume" />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexGrow: 1 }}>
                <Button
                    component="label"
                    variant="outlined"
                    tabIndex={-1}
                    endIcon={<CloudUploadIcon />}
                    sx={{
                        borderRadius: '10px',
                        borderColor: '#E5E7EB',
                        textTransform: 'none',
                        justifyContent: 'space-between',
                        color: '#9CA3AF',
                        backgroundColor: 'white',
                        width: '250px',
                    }}
                >
                    {fileName ?? 'upload your resume'}
                    <VisuallyHiddenInput accept=".pdf,.doc,.docx,.txt" type="file" onChange={handleFileChange} />
                </Button>
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
