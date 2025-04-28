import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { InterviewAnalysisForm, InterviewAnalysisView } from '../components/InterviewAnalysis';
import { analyzeInterview, getInterviewAnalysis } from '../services/interviewService';
import { InterviewAnalysis } from '../types';

export const InterviewAnalysisPage = () => {
    const navigate = useNavigate();
    const { interviewId } = useParams();
    if (!interviewId) {
        navigate('/interviewAnalysis');
        return <></>;
    }

    const [analysis, setAnalysis] = useState<InterviewAnalysis | null>(null);

    useEffect(() => {
        (async () => {
            setAnalysis((await getInterviewAnalysis(interviewId)).analysis);
        })();
    }, [setAnalysis]);

    const onSubmit = async (fileType: InterviewAnalysis['file_type'], file: File) => {
        try {
            setAnalysis((await analyzeInterview(interviewId, file, fileType)).analysis);
        } catch (error) {
            toast.error('Error analyzing interview. Please try again later.');
        }
    };

    return (
        <Box>
            <InterviewAnalysisForm onSubmit={onSubmit} analysis={analysis} />
            {analysis && <InterviewAnalysisView {...analysis.analysis} />}
        </Box>
    );
};
