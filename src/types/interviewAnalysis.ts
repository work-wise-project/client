export type InterviewAnalysis = {
    interview_id: string;
    file_name: string;
    file_type: 'audio' | 'text';
    analysis: {
        points_to_improve: string[];
        points_to_preserve: string[];
    };
};
