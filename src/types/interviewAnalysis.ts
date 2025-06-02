export type InterviewAnalysisPoint = {
    text: string;
    timestamp?: string;
    trend?: string;
};

export type InterviewAnalysis = {
    interview_id: string;
    file_name: string;
    file_type: 'audio' | 'text';
    analysis: {
        points_to_improve: InterviewAnalysisPoint[];
        points_to_preserve: InterviewAnalysisPoint[];
    };
};

export type InterviewAudioFile = {
    fileBuffer: string;
    mimeType: string | undefined;
};
