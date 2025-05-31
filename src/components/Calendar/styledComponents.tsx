import { GlobalStyles, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CalendarGlobalStyles = () => (
    <GlobalStyles
        styles={(theme) => ({
            '.react-calendar': {
                width: '100%',
                maxWidth: '70vw',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                lineHeight: '1.8',
                padding: '20px',
                margin: 'auto',
                border: 'none',

                [theme.breakpoints.up('xl')]: {
                    padding: '40px',
                },
            },
            '.react-calendar__navigation': {
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1rem',
            },
            '.react-calendar__navigation button': {
                fontSize: '1rem',
                fontWeight: 'bold',
                color: '#000',
                background: 'none',
                border: 'none',

                [theme.breakpoints.up('xl')]: {
                    fontSize: '1.5rem',
                },
            },
            '.react-calendar__month-view__weekdays': {
                textAlign: 'center',
                textTransform: 'capitalize',
                fontWeight: 'bold',
                color: '#333',
                fontSize: '1rem',
                marginBottom: '14px',

                [theme.breakpoints.up('xl')]: {
                    fontSize: '1.2rem',
                },

                '& abbr': {
                    textDecoration: 'none',
                    borderBottom: 'none',
                    cursor: 'default',
                },
            },
            '.react-calendar__month-view__days__day': {
                fontSize: '1rem',
                padding: '12px 0',
                color: '#222',

                [theme.breakpoints.up('xl')]: {
                    fontSize: '1rem',
                    padding: '20px 0',
                },
            },
            '.react-calendar__tile--now': {
                backgroundColor: alpha(theme.palette.primary.light, 0.2) + ' !important',
                color: theme.palette.primary.main + ' !important',
                fontWeight: 700,
            },
            '.react-calendar__tile:enabled:hover': {
                backgroundColor: '#f0f0f0',
                cursor: 'pointer',
            },
            '.react-calendar__tile': {
                fontSize: '1rem',
                border: '1px solid #ddd !important', // light gray lines between cells

                [theme.breakpoints.up('xl')]: {
                    fontSize: '1.2rem',
                },
            },
            '.react-calendar__month-view__days__day--neighboringMonth': {
                color: '#999',
            },
        })}
    />
);

export const Dot = styled('div')(({ theme }) => ({
    width: 7,
    height: 7,
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50%',
    marginTop: 9,
    marginInline: 'auto',
}));
