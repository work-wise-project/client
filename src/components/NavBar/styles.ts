import { Palette, SxProps } from '@mui/material';
import { CSSProperties } from 'react';

const topBarHeight = 'var(--toolbar-height)';

export const logoTypographyStyle: SxProps = {
    marginRight: 2,
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
};

const drawerBasicStyle = (drawerWidth: string): CSSProperties => ({
    width: drawerWidth,
    top: topBarHeight,
    height: `calc(100vh - ${topBarHeight})`,
});

export const drawerStyle = (drawerWidth: string): SxProps => ({
    flexShrink: 0,
    position: 'fixed',
    ...drawerBasicStyle(drawerWidth),
    '& .MuiDrawer-paper': {
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
    marginY: 2,
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
    marginTop: topBarHeight,
    marginLeft: isNavVisible ? drawerWidth : 0,
    transition: 'margin-left 0.3s',
    height: `calc(100vh - ${topBarHeight})`,
});
