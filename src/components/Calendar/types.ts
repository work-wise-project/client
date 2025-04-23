import { InterviewsSchedule } from '../../types';
import moment from 'moment';

export type InterviewDialogProps = {
    open: boolean;
    handleClose: () => void;
    selectedDate: Date | null;
    interviews: InterviewsSchedule | null;
};

export const dateFormatter = (date: Date) => {
    return moment(date).format('YYYY-MM-DD');
};
