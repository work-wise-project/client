import { Typography, Paper, Stack } from '@mui/material';
import { AnalyzeViewTypes } from './types';
import ResumeAnalyzeSVG from '../../assets/WomanResumeAnalyze.svg?react';

export const AnalyzeView = ({
    resumeAnalysisResult,
    showAnalyzeResult,
    showGrammarCheckResult,
    grammarCheckResult,
}: AnalyzeViewTypes) => {
    return (
        <>
            <Paper
                elevation={4}
                sx={{ p: 2, minHeight: '70vh', borderRadius: '16px', overflowY: 'auto', maxHeight: '70vh' }}
                square={false}
            >
                {resumeAnalysisResult && showAnalyzeResult && (
                    <Stack spacing={1}>
                        <Typography variant="h6" sx={{ fontSize: { xs: '1.25rem', lg: '1.4rem', xl: '1.8rem' } }}>
                            Analyze Result
                        </Typography>
                        {resumeAnalysisResult.general_review && (
                            <Typography
                                variant="body2"
                                sx={{ fontSize: { xs: '0.875rem', lg: '1.2rem', xl: '1.4rem' } }}
                            >
                                <strong>General Review:</strong> {resumeAnalysisResult.general_review}
                            </Typography>
                        )}

                        {resumeAnalysisResult.strengths && resumeAnalysisResult.strengths.length > 0 && (
                            <div>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        mb: 0.5,
                                        fontSize: { xs: '0.875rem', lg: '1.2rem', xl: '1.4rem' },
                                    }}
                                >
                                    <strong>Strengths:</strong>
                                </Typography>
                                <ul style={{ margin: 0, paddingLeft: 16 }}>
                                    {resumeAnalysisResult.strengths.map((strength, index) => (
                                        <li key={index}>
                                            <Typography
                                                variant="body2"
                                                sx={{ fontSize: { xs: '0.875rem', lg: '1.2rem', xl: '1.4rem' } }}
                                            >
                                                {strength}
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {resumeAnalysisResult.weaknesses && resumeAnalysisResult.weaknesses.length > 0 && (
                            <div>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        mb: 0.5,
                                        fontSize: { xs: '0.875rem', lg: '1.2rem', xl: '1.4rem' },
                                    }}
                                >
                                    <strong>Weaknesses:</strong>
                                </Typography>
                                <ul style={{ margin: 0, paddingLeft: 16 }}>
                                    {resumeAnalysisResult.weaknesses.map((weakness, index) => (
                                        <li key={index}>
                                            <Typography
                                                variant="body2"
                                                sx={{ fontSize: { xs: '0.875rem', lg: '1.2rem', xl: '1.4rem' } }}
                                            >
                                                {weakness}
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Stack>
                )}
                {grammarCheckResult && showGrammarCheckResult && (
                    <Stack spacing={1}>
                        <Typography variant="h6" sx={{ fontSize: { xs: '1.25rem', lg: '1.4rem', xl: '1.75rem' } }}>
                            Grammar Check
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                whiteSpace: 'pre-line',
                                fontSize: { xs: '0.875rem', lg: '1.2rem', xl: '1.4rem' },
                            }}
                        >
                            {grammarCheckResult}
                        </Typography>
                    </Stack>
                )}

                {!showAnalyzeResult && !showGrammarCheckResult && (
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ height: '100%', marginTop: { lg: '0vh', xl: '10vh' } }}
                    >
                        <ResumeAnalyzeSVG style={{ width: '100%', maxWidth: 500 }} />
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ fontSize: { xs: '0.875rem', lg: '1.2rem', xl: '1.4rem' } }}
                        >
                            Click "Analyze" or "Grammar Check" to see the results
                        </Typography>
                    </Stack>
                )}
            </Paper>
        </>
    );
};
