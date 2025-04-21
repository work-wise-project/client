export type InterviewDialogProps = {
    open: boolean;
    handleClose: () => void;
    selectedDate: Date | null;
    events: Record<string, { time: string; company: string }[]>;
};
