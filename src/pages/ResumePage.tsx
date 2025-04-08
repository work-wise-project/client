import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import InsightsIcon from '@mui/icons-material/Insights';
import { Document, Page, pdfjs } from 'react-pdf';
import { styled } from '@mui/material/styles';
import resumeService, { IResumeAnalysisResult } from '../services/resumeService';
import { HttpStatusCode } from 'axios';
// import mammoth from 'mammoth';

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
    const [docxText, setDocxText] = useState('');
    const [numPages, setNumPages] = useState<number | null>(null);
    const [resumeAnalyze, setResumeAnalyze] = useState<IResumeAnalysisResult | null>(null);

    const uploadFileToServer = async (selectedFile: File) => {
        try {
            const formData = new FormData();
            formData.append('resume', selectedFile);

            const { response } = await resumeService.uploadResume(formData);

            if (response.status != HttpStatusCode.Ok) {
                throw new Error('Failed to upload file');
            }
            const { data } = response;

            console.log(data);

            return data.filePath; // URL to the file
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;

        try {
            const ext = selectedFile.name.split('.').pop()?.toLowerCase();
            const fileUrl = await uploadFileToServer(selectedFile);
            setResumeUrl(fileUrl); // New state for URL

            if (ext === 'docx') {
                // you can fetch and convert the DOCX later
                setDocxText(''); // for now
            }
        } catch (error) {
            console.error('Error handling file change:', error);
            setDocxText('');
            setResumeUrl(null); // Reset URL if there's an error
        }
    };

    const onAnalyzeClick = async () => {
        if (!resumeUrl) return;

        try {
            const { responseResume } = await resumeService.analyzeResume(resumeUrl);
            if (responseResume.status !== HttpStatusCode.Ok) {
                throw new Error('Failed to analyze file');
            }
            const parsedData = JSON.parse(responseResume.data);
            console.log(parsedData);
            // setResumeAnalyze(parsedData); // Assuming data contains the analysis result
        } catch (error) {
            console.error('Error analyzing file:', error);
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
                        sx={{ p: 2, minHeight: '70vh', borderRadius: '16px', overflowY: 'auto', maxHeight: '70vh' }}
                        square={false}
                    >
                        {!resumeUrl && (
                            <Typography variant="body2" color="text.secondary">
                                No file selected
                            </Typography>
                        )}

                        {resumeUrl && resumeUrl.endsWith('.pdf') && (
                            <Document
                                file={resumeUrl}
                                renderMode="none"
                                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                            >
                                {Array.from(new Array(numPages), (_, i) => (
                                    <Page key={i + 1} pageNumber={i + 1} />
                                ))}
                            </Document>
                        )}

                        {resumeUrl && resumeUrl.endsWith('.docx') && (
                            <div dangerouslySetInnerHTML={{ __html: docxText }} style={{ fontSize: '0.9rem' }} />
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
                        startIcon={<InsightsIcon />}
                        onClick={onAnalyzeClick}
                    >
                        Analyze
                    </Button>
                    <Button variant="contained" fullWidth color="primary" startIcon={<SpellcheckIcon />}>
                        Spell Check
                    </Button>
                </Grid>

                <Grid size={{ xs: 5, md: 5 }}>
                    {resumeAnalyze && (
                        <Paper
                            elevation={0}
                            sx={{ p: 2, minHeight: '70vh', borderRadius: '16px', overflowY: 'auto', maxHeight: '70vh' }}
                            square={false}
                        >
                            {resumeAnalyze}
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};
