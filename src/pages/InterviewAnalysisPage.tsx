import { Box, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { TranscriptForm } from '../components/TranscriptForm';
import { TranscriptView } from '../components/TranscriptView';
import { Transcript } from '../types';

export const InterviewAnalysisPage = () => {
    const [transcript, setTranscript] = useState<Transcript>([]);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Box>
            <TranscriptForm onSubmit={setTranscript} setIsLoading={setIsLoading} />
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                transcript.length > 0 && <TranscriptView transcript={transcript} />
            )}
        </Box>
    );
};
