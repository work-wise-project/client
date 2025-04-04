import { Palette, SxProps } from '@mui/material';
import { CSSProperties } from 'react';

export const toolbarStyle: SxProps = {
    height: '8vh',
    color: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
};

export const logoTypographyStyle: SxProps = {
    marginRight: 2,
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
};

const drawerBasicStyle = (drawerWidth: string): CSSProperties => ({
    width: drawerWidth,
    top: '8vh',
    height: '92vh',
});

export const drawerStyle = (drawerWidth: string): SxProps => ({
    flexShrink: 0,
    position: 'fixed',
    ...drawerBasicStyle(drawerWidth),
    '& .MuiDrawer-paper': {
        border: 'none',
        transition: 'width 0.3s',
        overflowX: 'hidden',
        ...drawerBasicStyle(drawerWidth),
    },
});

export const pagesListStyle: SxProps = {
    height: '100%',
    paddingTop: 2,
};

export const listItemButtonStyle = (palette: Palette, isActive: boolean): SxProps => ({
    height: '6vh',
    display: 'flex',
    paddingX: 2.5,
    backgroundColor: isActive ? palette.action.active : '',
});

export const listItemTextStyle = (palette: Palette, isActive: boolean): SxProps => ({
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive ? palette.primary.main : palette.text.primary,
});

export const drawerControlContainerStyle: SxProps = {
    display: 'flex',
    padding: 2,
    justifyContent: 'end',
};

export const drawerControlStyle = (palette: Palette): SxProps => ({
    border: `1px solid ${palette.divider}`,
    borderRadius: '10%',
});

export const mainContentStyle = (drawerWidth: string, isNavVisible: boolean): SxProps => ({
    marginLeft: isNavVisible ? drawerWidth : 0,
    padding: 2,
    transition: 'margin-left 0.3s',
});
