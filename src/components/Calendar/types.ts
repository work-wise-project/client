export type InterviewDialogProps = {
    open: boolean;
    handleClose: () => void;
    selectedDate: Date | null;
    interviews: Record<string, { time: string; company: string }[]>;
};
