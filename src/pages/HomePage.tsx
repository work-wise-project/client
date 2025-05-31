import { CalendarComponent } from '../components/Calendar/index';
import { Box } from '@mui/material';

export const HomePage = () => {
    return (
        <Box sx={{ justifyContent: 'center', mt: { md: 4, lg: 8 } }}>
            <CalendarComponent />
        </Box>
    );
};
