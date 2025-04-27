import { Paper, Typography } from '@mui/material';
import { ResumeViewTypes } from './types';

export const ResumeView = ({ resumeText }: ResumeViewTypes) => {
    return (
        <Paper
            elevation={0}
            sx={{ p: 1, minHeight: '70vh', borderRadius: '16px', overflowY: 'auto', maxHeight: '70vh' }}
            square={false}
        >
            {!resumeText ? (
                <Typography variant="body2" color="text.secondary">
                    No file selected
                </Typography>
            ) : (
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {resumeText}
                </Typography>
            )}
        </Paper>
    );
};
