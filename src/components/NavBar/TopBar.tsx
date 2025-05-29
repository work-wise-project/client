import { AccountCircle, ExitToApp } from '@mui/icons-material';
import { Box, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { HttpStatusCode } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../assets/logo.png';
import { useUserContext } from '../../context/UserContext';
import userService from '../../services/userService';
import { logoTypographyStyle, toolbarStyle } from './styles';

export const TopBar = () => {
    const { userContext, clearUserSession } = useUserContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            const { response } = await userService.logout();
            if (response.status === HttpStatusCode.Ok) {
                clearUserSession();
                handleMenuClose();
            }
        } catch {
            toast.error('Failed to log out');
        }
    };

    const handleProfilePage = () => {
        navigate('/profile');
        handleMenuClose();
    };

    return (
        <Toolbar sx={toolbarStyle}>
            <Typography variant="h6" component="div" sx={logoTypographyStyle}>
                <Box component="img" src={logo} sx={{ height: '65px', marginRight: '8px' }} />
                WorkWise
            </Typography>
            {userContext?.isUserConnected && (
                <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ marginRight: 1 }}>Hello {userContext.name}</Typography>
                    <IconButton onClick={handleMenuOpen} color="inherit">
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <MenuItem onClick={handleProfilePage}>Profile page</MenuItem>
                        <MenuItem onClick={handleLogout}>
                            Logout <ExitToApp fontSize="small" sx={{ ml: 1 }} />
                        </MenuItem>
                    </Menu>
                </Box>
            )}
        </Toolbar>
    );
};
