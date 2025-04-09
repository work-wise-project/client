import { createTheme } from '@mui/material/styles';
// @ts-ignore
import '@fontsource/rubik';

export const theme = createTheme({
    typography: { fontFamily: 'Rubik' },
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
        MuiCssBaseline: {
            styleOverrides: {
                '*': {
                    '&::-webkit-scrollbar': { width: '7px', height: '10px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#C5C8D6', borderRadius: '10px' },
                    '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#898C95' },
                },
            },
        },
    },
});
