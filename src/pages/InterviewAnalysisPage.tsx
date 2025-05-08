import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { InterviewAnalysisForm, InterviewAnalysisView } from '../components/InterviewAnalysis';
import { analyzeInterview, getInterviewAnalysis } from '../services/interviewService';
import { InterviewAnalysis, InterviewAudioFile } from '../types';

const createFileUrl = ({ fileBuffer, mimeType = 'audio/wav' }: InterviewAudioFile, fileName: string) => {
    const blob = new Blob([fileBuffer], { type: mimeType });
    const file = new File([blob], fileName, { type: mimeType });

    return URL.createObjectURL(file);
};

export const InterviewAnalysisPage = () => {
    const navigate = useNavigate();
    const { interviewId } = useParams();
    if (!interviewId) {
        navigate('/interviewAnalysis');
        return <></>;
    }

    const [analysis, setAnalysis] = useState<InterviewAnalysis | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const { analysis, file } = await getInterviewAnalysis(interviewId);
            if (!!analysis) {
                setAnalysis(analysis);
                setFileUrl(createFileUrl(file, analysis.file_name));
            }
            setIsLoading(false);
        })();
    }, [setAnalysis]);

    const onSubmit = async (fileType: InterviewAnalysis['file_type'], file: File) => {
        try {
            setAnalysis((await analyzeInterview(interviewId, file, fileType)).analysis);
            setFileUrl(URL.createObjectURL(file));
        } catch (error) {
            toast.error('Error analyzing interview. Please try again later.');
        }
    };

    return (
        <Box>
            <InterviewAnalysisForm onSubmit={onSubmit} analysis={analysis} />
            {isLoading && (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            )}
            {fileUrl && analysis && <InterviewAnalysisView {...analysis.analysis} fileUrl={fileUrl} />}
        </Box>
    );
};
