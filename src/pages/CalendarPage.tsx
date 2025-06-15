import { Box } from '@mui/material';
import { CalendarComponent } from '../components/Calendar';

export const CalendarPage = () => (
    <Box sx={{ justifyContent: 'center', mt: { lg: 3, xl: 8 } }}>
        <CalendarComponent />
    </Box>
);
