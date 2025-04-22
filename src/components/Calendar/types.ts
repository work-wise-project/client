import { InterviewsSchedule } from '../../types';

export type InterviewDialogProps = {
    open: boolean;
    handleClose: () => void;
    selectedDate: Date | null;
    interviews: InterviewsSchedule | null;
};

export const dateFormatter = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
