import { InterviewAnalysisPoint } from '../../../types';

export type InterviewAnalysisViewProps = {
    points_to_improve: InterviewAnalysisPoint[];
    points_to_preserve: InterviewAnalysisPoint[];
    fileUrl: string;
};
