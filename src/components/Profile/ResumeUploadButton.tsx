import React, { useState } from 'react';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { HttpStatusCode } from 'axios';
import { toast } from 'react-toastify';
import { useUserContext } from '../../context/UserContext';
import resumeService from '../../services/resumeService';
import { styled } from '@mui/material/styles';

interface ResumeUploadButtonProps {
    userId?: string;
    onUploadSuccess?: (filePath: string) => void;
    buttonLabel?: string;
    showFileName?: boolean;
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
    userId,
    onUploadSuccess,
    buttonLabel = 'Upload Your Resume',
    showFileName,
}) => {
    const { userContext } = useUserContext();
    const [fileName, setFileName] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const uploadFileToServer = async (selectedFile: File) => {
        const userIdResume = userId || userContext?.id;
        if (!userIdResume) {
            toast.error('No user connected');
            return;
        }
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('resume', selectedFile);

            const { response } = await resumeService.uploadResume(userIdResume, formData);

            if (response.status !== HttpStatusCode.Ok) {
                throw new Error('Failed to upload file');
            }

            setFileName(selectedFile.name);
            onUploadSuccess?.(response.data.filePath);
            toast.success('Resume uploaded successfully');
        } catch (error) {
            toast.error('Failed to upload file');
            setFileName(null);
            throw error;
        } finally {
            setLoading(false);
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
                color: '#9CA3AF',
                backgroundColor: 'white',
                width: '250px',
            }}
        >
            {showFileName && fileName ? fileName : buttonLabel}
            <VisuallyHiddenInput accept=".pdf,.doc,.docx,.txt" type="file" onChange={handleFileChange} />
        </Button>
    );
};

export default ResumeUploadButton;
