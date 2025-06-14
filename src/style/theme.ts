import { createTheme } from '@mui/material/styles';
// @ts-ignore
import '@fontsource/rubik';

export const theme = createTheme({
    typography: { fontFamily: 'Rubik' },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1500,
            xl: 1900,
        },
    },
    palette: {
        primary: {
            main: '#003049',
        },
        secondary: {
            main: '#DDA853',
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
                    height: 'var(--toolbar-height)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
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
