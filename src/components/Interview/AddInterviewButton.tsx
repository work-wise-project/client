import { Button } from '@mui/material';
import Event from '@mui/icons-material/Event';

export const AddInterviewButton = ({ onClick }: { onClick: React.MouseEventHandler<HTMLLabelElement> }) => {
    return (
        <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-4 py-2"
            component="label"
            role={undefined}
            variant="outlined"
            tabIndex={-1}
            startIcon={<Event />}
            color="primary"
            onClick={onClick}
        >
            Add Interview
        </Button>
    );
};
