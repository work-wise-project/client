import { InterviewAnalysis } from '../../../types';

export type InterviewAnalysisFormProps = {
    onSubmit: (fileType: InterviewAnalysis['file_type'], file: File) => Promise<void>;
    analysis: InterviewAnalysis | null;
};
