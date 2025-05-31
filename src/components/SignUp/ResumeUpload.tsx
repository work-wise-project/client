import { useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import { FieldLabel } from '../InterviewAnalysis/Form/InterviewAnalysisForm';
import { HttpStatusCode } from 'axios';
import resumeService from '../../services/resumeService';
import { useNavigate } from 'react-router-dom';
import { Send } from '@mui/icons-material';
import { useUserContext } from '../../context/UserContext';
import { VisuallyHiddenInput } from '../../pages/ResumePage';

const ResumeUpload = ({ currentUserId }: { currentUserId: string }) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const navigate = useNavigate();
    const { setUserContext } = useUserContext();

    const uploadFileToServer = async (selectedFile: File) => {
        try {
            const formData = new FormData();
            formData.append('resume', selectedFile);

            const { response } = await resumeService.uploadResume(currentUserId, formData);

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
        setUserContext({ id: currentUserId });
    };

    return (
        <Box sx={{ flex: 1, mt: 3, gap: 15, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexGrow: 1 }}>
                    <Button
                        component="label"
                        variant="outlined"
                        tabIndex={-1}
                        endIcon={<CloudUploadIcon />}
                        sx={{
                            borderRadius: '10px',
                            textTransform: 'none',
                            justifyContent: 'space-between',
                            width: '250px',
                        }}
                    >
                        {fileName ?? 'upload your resume'}
                        <VisuallyHiddenInput accept=".pdf,.doc,.docx,.txt" type="file" onChange={handleFileChange} />
                    </Button>
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
