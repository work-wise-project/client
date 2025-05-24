import { Button } from '@mui/material';
import Event from '@mui/icons-material/Event';

export const AddInterviewButton = ({ onClick }: { onClick: React.MouseEventHandler<HTMLLabelElement> }) => {
    return (
        <Button
            component="label"
            size="large"
            tabIndex={-1}
            startIcon={<Event />}
            color="primary"
            onClick={onClick}
            variant="contained"
        >
            Add Interview
        </Button>
    );
};
