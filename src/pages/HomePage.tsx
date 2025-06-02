import { CalendarComponent } from '../components/Calendar/index';
import { Box } from '@mui/material';

export const HomePage = () => {
    return (
        <Box sx={{ justifyContent: 'center', mt: { lg: 3, xl: 8 } }}>
            <CalendarComponent />
        </Box>
    );
};
