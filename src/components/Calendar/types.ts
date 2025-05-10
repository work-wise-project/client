import { InterviewsSchedule } from '../../types';
import moment from 'moment';

export type InterviewDialogProps = {
    open: boolean;
    handleClose: () => void;
    selectedDate: Date | null;
    interviews: InterviewsSchedule | null;
    deleteInterview: (interviewId: string) => Promise<void>;
};

export const formatDate = (date: Date) => {
    return moment(date).format('DD/MM/YYYY');
};

export const formatTime = (date: string) => {
    return moment(date).format('HH:mm');
};
