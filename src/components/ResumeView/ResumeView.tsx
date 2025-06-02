import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { ResumeViewTypes } from './types';

export const ResumeView = ({ resumeText, loading }: ResumeViewTypes) => {
    return (
        <Paper
            elevation={4}
            sx={{
                p: 1,
                minHeight: '70vh',
                height: '100%',
                borderRadius: '16px',
                maxHeight: '70vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
            }}
            square={false}
        >
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </Box>
            ) : !resumeText ? (
                <Typography variant="body2" color="text.secondary">
                    No file selected
                </Typography>
            ) : (
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', wordWrap: 'break-word' }}>
                    {resumeText}
                </Typography>
            )}
        </Paper>
    );
};
