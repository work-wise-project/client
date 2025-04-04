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
            disabled: '#D9D9D9',
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
    },
});
