export type Interview = {
    id: string;
    user: string;
    date: string;
    title: string;
    job_link: string;
};

export type InterviewsSchedule = Map<string, Interview[]>;
