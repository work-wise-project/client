import InsightsIcon from '@mui/icons-material/Insights';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import { Box, Button, Grid } from '@mui/material';
import { HttpStatusCode } from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ResumeUploadButton from '../components/Profile/ResumeUploadButton';
import { AnalyzeView } from '../components/ResumeAnalyzeView/AnalyzeView';
import { ResumeView } from '../components/ResumeView/ResumeView';
import { useUserContext } from '../context/UserContext';
import resumeService, { IResumeAnalysisResult } from '../services/resumeService';

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
                    setResumeText(response.data.textContent);
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
            <Box display="flex" justifyContent="flex-start" mb={2}>
                <ResumeUploadButton
                    onUploadSuccess={async () => {
                        await checkAndLoadResume();
                    }}
                />
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
