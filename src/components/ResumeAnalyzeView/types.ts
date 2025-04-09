import { IResumeAnalysisResult } from '../../services/resumeService';

export type AnalyzeViewTypes = {
    resumeAnalysisResult: IResumeAnalysisResult | null;
    showAnalyzeResult: boolean;
    showGrammarCheckResult: boolean;
    grammarCheckResult: string | null;
};
