export type Interview = {
    id: string;
    user: string;
    date: string;
    title: string;
    job_link: string;
};

export type InterviewsSchedule = Map<string, Interview[]>;

export type InterviewProgress = Interview & { hasAnalysis: boolean; hasPreparation: boolean };

export type InterviewData = {
    title: string;
    jobLink: string;
    date: string;
};
