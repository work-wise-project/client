import { CalendarComponent } from '../components/Calendar/index';
import { Box, Button } from '@mui/material';
import Event from '@mui/icons-material/Event';

export const HomePage = () => {
    return (
        <Box sx={{ justifyContent: 'center', mb: 4 }}>
            <Button
                component="label"
                role={undefined}
                variant="outlined"
                tabIndex={-1}
                startIcon={<Event />}
                color="primary"
                sx={{ mb: 4, marginInlineStart: '10vw', mt: 5 }}
                onClick={() => alert('Button clicked!')}
            >
                Add Interview
            </Button>
            <CalendarComponent />
        </Box>
    );
};
