import { SxProps } from '@mui/material';

export const formContainerStyle: SxProps = {
    display: 'flex',
    gap: 5,
    justifyContent: 'center',
    paddingY: 2,
};
export const fieldStyle: SxProps = {
    width: '20%',
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
};

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
    height: '4.5vh',
    paddingX: 2,
    marginTop: 4.75,
    textTransform: 'none',
    borderRadius: '10px',
    fontSize: '1.05rem',
};
