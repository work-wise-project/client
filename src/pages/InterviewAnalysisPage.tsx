import { Box } from '@mui/material';
import { useState } from 'react';
import { InterviewAnalysisForm, InterviewAnalysisView } from '../components/InterviewAnalysis';
import { InterviewAnalysis } from '../types';

export const InterviewAnalysisPage = () => {
    const [analysis, setAnalysis] = useState<InterviewAnalysis | null>(null);

    return (
        <Box>
            <InterviewAnalysisForm onSubmit={setAnalysis} />
            {analysis && <InterviewAnalysisView {...analysis} />}
        </Box>
    );
};
