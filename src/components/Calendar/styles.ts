import { SxProps } from '@mui/material';

export const listItemStyled: SxProps = {
    border: '1px solid #ccc',
    borderRadius: 2,
    padding: 2,
    marginBottom: 2,
    display: 'flex',
    alignItems: 'center',
};

export const listItemTextStyled = {
    secondary: { fontWeight: '500', color: 'textPrimary' },
};

export const menuStyled = {
    paper: {
        sx: {
            borderRadius: 2,
            minWidth: 150,
            boxShadow: 3,
        },
    },
};
