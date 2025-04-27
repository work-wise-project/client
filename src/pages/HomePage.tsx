import { CalendarComponent } from '../components/Calendar/index';
import { Box } from '@mui/material';

export const HomePage = () => {
    return (
        <Box sx={{ justifyContent: 'center', mb: 4 }}>
            <CalendarComponent />
        </Box>
    );
};
