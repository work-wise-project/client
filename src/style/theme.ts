import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        background: {
            default: '#EEEFF1',
        },
        primary: {
            main: '#4574DC',
        },
        secondary: {
            main: '#C5C8D6',
        },
        info: {
            main: '#000000',
        },
        text: {
            primary: '#000000',
            secondary: '#C5C8D6',
        },
        action: {
            disabledBackground: 'rgba(149, 176, 234, 0.2)',
            disabled: 'rgba(56, 89, 159, 0.34)',
            active: 'rgba(69, 116, 220, 0.2)',
        },
        divider: '#C5C8D6',
    },
    components: {
        MuiToolbar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    padding: '8px 16px',
                },
            },
        },
    },
});
