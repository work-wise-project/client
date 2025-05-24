import { CalendarComponent } from '../components/Calendar/index';
import { Box } from '@mui/material';

export const HomePage = () => {
    return (
        <Box sx={{ justifyContent: 'center', mt: { md: 2, lg: 5 } }}>
            <CalendarComponent />
        </Box>
    );
};
