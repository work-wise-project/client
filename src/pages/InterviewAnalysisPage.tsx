import { Box, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AudioAnalyzeCSV from '../assets/AudioAnalyze.svg?react';
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
    const { interviewId, interviewTitle } = useParams();
    const [analysis, setAnalysis] = useState<InterviewAnalysis | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!interviewId) {
            navigate('/interviewAnalysis');
            return;
        }
        const fetchAnalysis = async () => {
            try {
                setIsLoading(true);
                const { analysis, file } = await getInterviewAnalysis(interviewId);
                setAnalysis(analysis);
                setFileUrl(createFileUrl(file));
            } catch (error) {
                console.error('Failed to fetch interview analysis:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalysis();
    }, [interviewId, navigate, setAnalysis]);

    const onSubmit = async (fileType: InterviewAnalysis['file_type'], file: File) => {
        if (!interviewId) return;

        try {
            if (!interviewId) return;
            const result = await analyzeInterview(interviewId, file, fileType);
            setAnalysis(result.analysis);
            setFileUrl(URL.createObjectURL(file));
        } catch (error) {
            console.error('Error analyzing interview:', error);
            toast.error('Error analyzing interview. Please try again later.');
        }
    };

    return (
        <Box display={'flex'} flexDirection="column">
            <Typography
                variant="h6"
                sx={{
                    textAlign: 'start',
                    m: 4,
                    fontSize: { lg: '1.5rem', xl: '2rem' },
                }}
                color="secondary"
            >
                {interviewTitle || 'Interview Analysis'}
            </Typography>
            <InterviewAnalysisForm onSubmit={onSubmit} analysis={analysis} />
            {isLoading && (
                <Box display="flex" flexDirection="row">
                    <Skeleton variant="rectangular" height={400} width={'40vw'} sx={{ margin: 4, borderRadius: 2 }} />
                    <Skeleton variant="rectangular" height={400} width={'40vw'} sx={{ margin: 4, borderRadius: 2 }} />
                </Box>
            )}
            {fileUrl && analysis ? (
                <InterviewAnalysisView {...analysis.analysis} fileUrl={fileUrl} />
            ) : (
                !isLoading && <AudioAnalyzeCSV style={{ maxHeight: '55vh' }} />
            )}
        </Box>
    );
};
