import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { InterviewAnalysisForm, InterviewAnalysisView } from '../components/InterviewAnalysis';
import { analyzeInterview, getInterviewAnalysis } from '../services/interviewService';
import { InterviewAnalysis, InterviewAudioFile } from '../types';

const createFileUrl = ({ fileBuffer, mimeType = 'audio/wav' }: InterviewAudioFile) => {
    const binary = atob(fileBuffer);
    const buffer = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const file = new Blob([buffer], { type: mimeType });

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
            setAnalysis(analysis);
            setFileUrl(createFileUrl(file));
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
