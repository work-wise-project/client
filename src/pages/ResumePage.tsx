import React, { useState } from 'react';
import { Box, Button, Grid, Typography, Paper, Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import InsightsIcon from '@mui/icons-material/Insights';
import { Document, Page, pdfjs } from 'react-pdf';
import { styled } from '@mui/material/styles';
import resumeService, { IResumeAnalysisResult } from '../services/resumeService';
import { HttpStatusCode } from 'axios';
import { toast } from 'react-toastify';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export const ResumePage: React.FC = () => {
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [resumeAnalysisResult, setResumeAnalysisResult] = useState<IResumeAnalysisResult | null>(null);
    const [grammarCheckResult, setGrammarCheckResult] = useState<string | null>(null);
    const [showAnalyzeResult, setShowAnalyzeResult] = useState(false);
    const [showGrammarCheckResult, setShowGrammarCheckResult] = useState(false);
    const [loadingAnalyze, setLoadingAnalyze] = useState(false);
    const [loadingGrammarCheck, setLoadingGrammarCheck] = useState(false);

    const uploadFileToServer = async (selectedFile: File) => {
        try {
            const formData = new FormData();
            formData.append('resume', selectedFile);

            const { response } = await resumeService.uploadResume(formData);

            if (response.status != HttpStatusCode.Ok) {
                throw new Error('Failed to upload file');
            }
            const { data } = response;
            return data.filePath;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;

        try {
            const fileUrl = await uploadFileToServer(selectedFile);
            setResumeAnalysisResult(null);
            setGrammarCheckResult(null);
            setResumeUrl(fileUrl);
        } catch (error) {
            console.error('Error handling file change:', error);
            setResumeUrl(null);
        }
    };

    const onAnalyzeClick = async () => {
        if (!resumeUrl) {
            toast.info('Please upload a resume first');
            return;
        }
        setLoadingAnalyze(true);
        try {
            if (!resumeAnalysisResult) {
                const { responseResume } = await resumeService.analyzeResume(resumeUrl);
                if (responseResume.status !== HttpStatusCode.Ok) {
                    throw new Error('Failed to analyze file');
                }
                const parsedData = JSON.parse(responseResume.data);

                setResumeAnalysisResult(parsedData);
            }
            setShowAnalyzeResult(true);
            setShowGrammarCheckResult(false);
        } catch (error) {
            console.error('Error analyzing file:', error);
            toast.error('Failed to analyze file');
        } finally {
            setLoadingAnalyze(false);
        }
    };

    const onGrammarCheckClicked = async () => {
        if (!resumeUrl) {
            toast.info('Please upload a resume first');
            return;
        }
        setLoadingGrammarCheck(true);
        try {
            if (!grammarCheckResult) {
                const { responseCheckGrammar } = await resumeService.checkResumeGrammar(resumeUrl);
                if (responseCheckGrammar.status !== HttpStatusCode.Ok) {
                    throw new Error('Failed to check grammar');
                }
                setGrammarCheckResult(responseCheckGrammar.data);
            }
            setShowAnalyzeResult(false);
            setShowGrammarCheckResult(true);
        } catch (error) {
            console.error('Error checking grammar:', error);
            toast.error('Failed to check grammar');
        } finally {
            setLoadingGrammarCheck(false);
        }
    };

    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="flex-start" mb={2}>
                <Button
                    component="label"
                    role={undefined}
                    variant="outlined"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                >
                    Upload Your Resume
                    <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 5, md: 5 }}>
                    <Paper
                        elevation={0}
                        sx={{ p: 1, minHeight: '70vh', borderRadius: '16px', overflowY: 'auto', maxHeight: '70vh' }}
                        square={false}
                    >
                        {!resumeUrl && (
                            <Typography variant="body2" color="text.secondary">
                                No file selected
                            </Typography>
                        )}

                        {resumeUrl && resumeUrl.endsWith('.pdf') && (
                            <Document file={resumeUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                                {Array.from(new Array(numPages), (_, i) => (
                                    <Page key={i + 1} pageNumber={i + 1} />
                                ))}
                            </Document>
                        )}
                    </Paper>
                </Grid>

                <Grid
                    size="grow"
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        loading={loadingAnalyze}
                        loadingPosition="start"
                        startIcon={<InsightsIcon />}
                        onClick={onAnalyzeClick}
                        disabled={loadingGrammarCheck}
                    >
                        Analyze
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        startIcon={<SpellcheckIcon />}
                        disabled={loadingAnalyze}
                        onClick={onGrammarCheckClicked}
                        loading={loadingGrammarCheck}
                        loadingPosition="start"
                    >
                        Grammar Check
                    </Button>
                </Grid>

                <Grid size={{ xs: 5, md: 5 }}>
                    {(showAnalyzeResult || showGrammarCheckResult) && (
                        <Paper
                            elevation={0}
                            sx={{ p: 2, minHeight: '70vh', borderRadius: '16px', overflowY: 'auto', maxHeight: '70vh' }}
                            square={false}
                        >
                            {resumeAnalysisResult && showAnalyzeResult && (
                                <Stack spacing={1}>
                                    <Typography variant="h6">Analyze Result</Typography>
                                    {resumeAnalysisResult.general_review && (
                                        <Typography variant="body2">
                                            <strong>General Review:</strong> {resumeAnalysisResult.general_review}
                                        </Typography>
                                    )}

                                    {resumeAnalysisResult.strengths && resumeAnalysisResult.strengths.length > 0 && (
                                        <div>
                                            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                                <strong>Strengths:</strong>
                                            </Typography>
                                            <ul style={{ margin: 0, paddingLeft: 16 }}>
                                                {resumeAnalysisResult.strengths.map((strength, index) => (
                                                    <li key={index}>
                                                        <Typography variant="body2">{strength}</Typography>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {resumeAnalysisResult.weaknesses && resumeAnalysisResult.weaknesses.length > 0 && (
                                        <div>
                                            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                                <strong>Weaknesses:</strong>
                                            </Typography>
                                            <ul style={{ margin: 0, paddingLeft: 16 }}>
                                                {resumeAnalysisResult.weaknesses.map((weakness, index) => (
                                                    <li key={index}>
                                                        <Typography variant="body2">{weakness}</Typography>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </Stack>
                            )}
                            {grammarCheckResult && showGrammarCheckResult && (
                                <Stack spacing={1}>
                                    <Typography variant="h6">Grammer Check</Typography>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                        {grammarCheckResult}
                                    </Typography>
                                </Stack>
                            )}
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};
