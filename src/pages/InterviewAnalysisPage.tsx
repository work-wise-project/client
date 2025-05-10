import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { InterviewAnalysisForm, InterviewAnalysisView } from '../components/InterviewAnalysis';
import { analyzeInterview, getInterviewAnalysis } from '../services/interviewService';
import { InterviewAnalysis } from '../types';
import InterviewChooser from '../components/Interview/InterviewChooser';

export const InterviewAnalysisPage = () => {
    const [interviewId, setInterviewId] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<InterviewAnalysis | null>(null);

    useEffect(() => {
        if (!interviewId) return;

        (async () => {
            try {
                const result = await getInterviewAnalysis(interviewId);
                setAnalysis(result.analysis);
            } catch {
                toast.error('Failed to load interview analysis.');
            }
        })();
    }, [interviewId]);

    const onSubmit = async (fileType: InterviewAnalysis['file_type'], file: File) => {
        if (!interviewId) return;
        try {
            const result = await analyzeInterview(interviewId, file, fileType);
            setAnalysis(result.analysis);
        } catch {
            toast.error('Error analyzing interview. Please try again later.');
        }
    };

    return (
        <Box>
            {interviewId ? (
                <>
                    <InterviewAnalysisForm onSubmit={onSubmit} analysis={analysis} />
                    {analysis && <InterviewAnalysisView {...analysis.analysis} />}
                </>
            ) : (
                <InterviewChooser onSelect={setInterviewId} />
            )}
        </Box>
    );
};
