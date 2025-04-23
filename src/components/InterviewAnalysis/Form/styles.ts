import { SxProps } from '@mui/material';
import { CSSProperties } from 'react';

export const formContainerStyle: SxProps = {
    display: 'flex',
    gap: 5,
    justifyContent: 'center',
    paddingY: 2,
};

export const fieldStyle = (width: CSSProperties['width']): SxProps => ({
    width,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
});

export const fieldLabelStyle: SxProps = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
};

export const fieldActionStyle: SxProps = {
    color: 'text.primary',
};

export const submitButtonStyle: SxProps = {
    width: '7%',
    textTransform: 'none',
    alignSelf: 'flex-end',
    borderRadius: '10px',
    fontSize: '1.05rem',
};
