export type Interview = {
    id: string;
    time: string;
    company: string;
};

export type InterviewsSchedule = Map<string, Interview[]>;
