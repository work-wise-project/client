import moment from 'moment';

export type InterviewDialogProps = {
    open: boolean;
    handleClose: () => void;
    selectedDate: Date | null;
};

export const formatDate = (date: Date) => {
    return moment(date).format('DD/MM/YYYY');
};

export const formatTime = (date: string) => {
    return moment(date).format('HH:mm');
};
