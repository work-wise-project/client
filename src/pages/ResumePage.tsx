import React, { useEffect, useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import InsightsIcon from '@mui/icons-material/Insights';
import { styled } from '@mui/material/styles';
import resumeService, { IResumeAnalysisResult } from '../services/resumeService';
import { HttpStatusCode } from 'axios';
import { toast } from 'react-toastify';
import { ResumeView } from '../components/ResumeView/ResumeView';
import { AnalyzeView } from '../components/ResumeAnalyzeView/AnalyzeView';
import { useUserContext } from '../context/UserContext';

export const VisuallyHiddenInput = styled('input')({
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

export const ResumePage: React.FC = () => {
    const [resumeText, setResumeText] = useState<string | null>(null);
    const [resumeAnalysisResult, setResumeAnalysisResult] = useState<IResumeAnalysisResult | null>(null);
    const [grammarCheckResult, setGrammarCheckResult] = useState<string | null>(null);
    const [showAnalyzeResult, setShowAnalyzeResult] = useState(false);
    const [showGrammarCheckResult, setShowGrammarCheckResult] = useState(false);
    const [loadingAnalyze, setLoadingAnalyze] = useState(false);
    const [loadingGrammarCheck, setLoadingGrammarCheck] = useState(false);
    const [loadingResume, setLoadingResume] = useState(false);
    const { userContext } = useUserContext();

    const checkAndLoadResume = async () => {
        if (userContext?.id) {
            try {
                setLoadingResume(true);
                const { response } = await resumeService.getResumeIfExist(userContext.id);
                if (response.data) {
                    setResumeText(response.data);
                } else {
                    console.log('No resume found for user');
                }
            } catch (error) {
                console.error('Error loading existing resume:', error);
            } finally {
                setLoadingResume(false);
            }
        }
    };

    useEffect(() => {
        checkAndLoadResume();

        return () => {
            setResumeText(null);
            setResumeAnalysisResult(null);
            setGrammarCheckResult(null);
            setShowAnalyzeResult(false);
            setShowGrammarCheckResult(false);
        };
    }, [userContext?.id]);

    useEffect(() => {
        setGrammarCheckResult(null);
        setResumeAnalysisResult(null);
        setShowAnalyzeResult(false);
        setShowGrammarCheckResult(false);
    }, [resumeText]);

    const uploadFileToServer = async (selectedFile: File) => {
        try {
            if (userContext?.id) {
                const formData = new FormData();
                formData.append('resume', selectedFile);

                const { response } = await resumeService.uploadResume(userContext.id, formData);

                if (response.status != HttpStatusCode.Ok) {
                    throw new Error('Failed to upload file');
                }

                return response.data;
            } else {
                toast.error('No user conected');
            }
        } catch (error) {
            toast.error('Failed to upload file');

            throw error;
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;

        try {
            await uploadFileToServer(selectedFile);
            event.target.value = '';
            await checkAndLoadResume();
        } catch (error) {
            console.error('Error handling file change:', error);
            setResumeText(null);
        }
    };

    const onAnalyzeClick = async () => {
        if (!resumeText) {
            toast.info('Please upload a resume first');
            return;
        }
        setLoadingAnalyze(true);
        try {
            if (userContext?.id) {
                if (!resumeAnalysisResult) {
                    const { responseResume } = await resumeService.analyzeResume(userContext.id);
                    if (responseResume.status !== HttpStatusCode.Ok) {
                        throw new Error('Failed to analyze file');
                    }
                    const parsedData = JSON.parse(responseResume.data);

                    setResumeAnalysisResult(parsedData);
                }
                setShowAnalyzeResult(true);
                setShowGrammarCheckResult(false);
            } else {
                toast.error('No user conected');
            }
        } catch (error) {
            console.error('Error analyzing file:', error);
            toast.error('Failed to analyze file');
        } finally {
            setLoadingAnalyze(false);
        }
    };

    const onGrammarCheckClicked = async () => {
        if (!resumeText) {
            toast.info('Please upload a resume first');
            return;
        }
        setLoadingGrammarCheck(true);
        try {
            if (userContext?.id) {
                if (!grammarCheckResult) {
                    const { responseCheckGrammar } = await resumeService.checkResumeGrammar(userContext.id);
                    if (responseCheckGrammar.status !== HttpStatusCode.Ok) {
                        throw new Error('Failed to check grammar');
                    }
                    setGrammarCheckResult(responseCheckGrammar.data);
                }
                setShowAnalyzeResult(false);
                setShowGrammarCheckResult(true);
            } else {
                toast.error('No user conected');
            }
        } catch (error) {
            console.error('Error checking grammar:', error);
            toast.error('Failed to check grammar');
        } finally {
            setLoadingGrammarCheck(false);
        }
    };

    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', mt: { xs: 1, lg: 7 } }}>
            <Box display="flex" justifyContent="flex-start" mb={3}>
                <Button
                    component="label"
                    role={undefined}
                    variant="outlined"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                >
                    Upload Your Resume
                    <VisuallyHiddenInput accept=".pdf,.doc,.docx,.txt" type="file" onChange={handleFileChange} />
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 5, md: 5 }}>
                    <ResumeView resumeText={resumeText} loading={loadingResume} />
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
                        disabled={loadingGrammarCheck || !resumeText}
                    >
                        Analyze
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        startIcon={<SpellcheckIcon />}
                        disabled={loadingAnalyze || !resumeText}
                        onClick={onGrammarCheckClicked}
                        loading={loadingGrammarCheck}
                        loadingPosition="start"
                    >
                        Grammar Check
                    </Button>
                </Grid>

                <Grid size={{ xs: 5, md: 5 }}>
                    <AnalyzeView
                        resumeAnalysisResult={resumeAnalysisResult}
                        showAnalyzeResult={showAnalyzeResult}
                        showGrammarCheckResult={showGrammarCheckResult}
                        grammarCheckResult={grammarCheckResult}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};
