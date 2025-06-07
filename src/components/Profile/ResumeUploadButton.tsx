import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { HttpStatusCode } from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useUserContext } from '../../context';
import resumeService from '../../services/resumeService';

interface ResumeUploadButtonProps {
    onUploadSuccess?: () => void;
    buttonLabel?: string;
    shouldUploadNow?: boolean;
    setHasResumeChanged?: React.Dispatch<React.SetStateAction<boolean>>;
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
    shouldUploadNow,
    setHasResumeChanged,
}) => {
    const { userContext } = useUserContext();
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [existingResumeType, setExistingResumeType] = useState<string | null>(null);
    const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);

    // If `isSaved` prop is undefined, upload immediately on file select
    const shouldUploadImmediately = shouldUploadNow === undefined;

    useEffect(() => {
        const checkAndLoadResume = async () => {
            if (userContext?.id) {
                try {
                    const { response } = await resumeService.getResumeIfExist(userContext.id);
                    if (response.data) {
                        setExistingResumeType(response.data.contentType);
                    } else {
                        console.log('No resume found for user');
                    }
                } catch (error) {
                    console.error('Error loading existing resume:', error);
                }
            }
        };
        checkAndLoadResume();
    }, [userContext?.id]);

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

            if (shouldUploadImmediately) {
                toast.success('Resume uploaded successfully');
            }

            setPendingUploadFile(null);
            onUploadSuccess?.();
            setHasResumeChanged?.(false);
        } catch (error) {
            toast.error('Failed to upload file');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const uplodadOnSaved = shouldUploadNow && pendingUploadFile;

        if (uplodadOnSaved) {
            uploadFileToServer(pendingUploadFile);
        }
    }, [shouldUploadNow, pendingUploadFile]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setPendingUploadFile(file);
        setUploadedFileName(file.name);
        setHasResumeChanged?.(true);

        if (shouldUploadImmediately) {
            uploadFileToServer(file);
        }
        event.target.value = '';
    };

    return (
        <Button
            component="label"
            variant="outlined"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            disabled={loading}
            sx={{
                borderRadius: '10px',
                textTransform: 'none',
                justifyContent: 'space-between',
            }}
        >
            {!uploadedFileName && !existingResumeType
                ? 'Upload Your Resume'
                : uploadedFileName
                ? uploadedFileName
                : `resume.${existingResumeType}`}

            <VisuallyHiddenInput accept=".pdf,.doc,.docx,.txt" type="file" onChange={handleFileChange} />
        </Button>
    );
};

export default ResumeUploadButton;
