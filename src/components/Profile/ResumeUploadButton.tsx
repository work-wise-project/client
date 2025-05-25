import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { HttpStatusCode } from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useUserContext } from '../../context/UserContext';
import resumeService from '../../services/resumeService';

interface ResumeUploadButtonProps {
    onUploadSuccess?: () => void;
    buttonLabel?: string;
    isSaved?: boolean;
    setIsResumeChanged?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const ResumeUploadButton: React.FC<ResumeUploadButtonProps> = ({
    onUploadSuccess,
    buttonLabel,
    isSaved,
    setIsResumeChanged,
}) => {
    const { userContext } = useUserContext();
    const [fileName, setFileName] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [typeResume, setTypeResume] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const uploadDirectly = isSaved === undefined;

    const checkAndLoadResume = async () => {
        if (userContext?.id) {
            try {
                const { response } = await resumeService.getResumeIfExist(userContext.id);
                if (response.data) {
                    setTypeResume(response.data.contentType);
                } else {
                    console.log('No resume found for user');
                }
            } catch (error) {
                console.error('Error loading existing resume:', error);
            }
        }
    };

    useEffect(() => {
        checkAndLoadResume();
    }, []);

    const uploadFileToServer = async (file: File) => {
        if (!userContext?.id) {
            toast.error('No user connected');
            return;
        }
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('resume', file);

            const { response } = await resumeService.uploadResume(userContext.id, formData);

            if (response.status !== HttpStatusCode.Ok) {
                throw new Error('Failed to upload file');
            }

            if (uploadDirectly) {
                toast.success('Resume uploaded successfully');
            }

            setSelectedFile(null);
            onUploadSuccess?.();
            setIsResumeChanged?.(false);
        } catch (error) {
            toast.error('Failed to upload file');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAndLoadResume();
    }, [userContext?.id]);

    useEffect(() => {
        const uplodadOnSaved = isSaved && selectedFile;

        if (uplodadOnSaved) {
            uploadFileToServer(selectedFile);
        }
    }, [isSaved]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setSelectedFile(file);
        setFileName(file.name);
        setIsResumeChanged?.(true);

        if (uploadDirectly) {
            uploadFileToServer(file);
        }
    };

    return (
        <Button
            component="label"
            variant="outlined"
            tabIndex={-1}
            endIcon={<CloudUploadIcon />}
            disabled={loading}
            sx={{
                borderRadius: '10px',
                borderColor: '#E5E7EB',
                textTransform: 'none',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                width: '250px',
            }}
        >
            <Box
                style={{
                    color:
                        (buttonLabel && fileName !== buttonLabel) || (!buttonLabel && fileName) || typeResume
                            ? 'blue'
                            : '#4574DC',
                }}
            >
                {!fileName && !typeResume ? 'Upload Your Resume' : fileName ? fileName : `resume.${typeResume}`}
            </Box>
            <VisuallyHiddenInput accept=".pdf,.doc,.docx,.txt" type="file" onChange={handleFileChange} />
        </Button>
    );
};

export default ResumeUploadButton;
