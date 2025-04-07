import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { pages } from './pages';
import {
    drawerControlContainerStyle,
    drawerControlStyle,
    drawerStyle,
    listItemButtonStyle,
    listItemTextStyle,
    mainContentStyle,
    pagesListStyle,
} from './styles';
import { TopBar } from './TopBar';

const PUBLIC_ROUTES = ['/welcome', '/login', '/signup'];

export const NavBar = ({ children }: { children?: ReactNode }) => {
    const { palette } = useTheme();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useLocalStorage('isNavbarOpen', false);

    const drawerWidth = isOpen ? '10vw' : '3.5vw';
    const isNavbarVisible = !PUBLIC_ROUTES.includes(pathname);

    return (
        <>
            <TopBar />
            {isNavbarVisible && (
                <Drawer variant="permanent" sx={drawerStyle(drawerWidth)}>
                    <List sx={pagesListStyle}>
                        {pages.map(({ text, getIcon, path }, index) => (
                            <ListItemButton
                                key={index}
                                sx={listItemButtonStyle(palette, path === pathname)}
                                onClick={() => navigate(path)}
                            >
                                <ListItemIcon>{getIcon(path === pathname ? 'primary' : 'info')}</ListItemIcon>
                                {isOpen && (
                                    <ListItemText
                                        primary={text}
                                        slotProps={{ primary: { sx: listItemTextStyle(palette, path === pathname) } }}
                                    />
                                )}
                            </ListItemButton>
                        ))}
                    </List>
                    <Box sx={drawerControlContainerStyle}>
                        <IconButton
                            size="small"
                            color="info"
                            onClick={() => setIsOpen(!isOpen)}
                            sx={drawerControlStyle(palette)}
                        >
                            {isOpen ? <ArrowBack fontSize="small" /> : <ArrowForward fontSize="small" />}
                        </IconButton>
                    </Box>
                </Drawer>
            )}
            <Box sx={mainContentStyle(drawerWidth, isNavbarVisible)}>{children}</Box>
        </>
    );
};
