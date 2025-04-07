import { ExitToApp } from '@mui/icons-material';
import { Box, IconButton, Toolbar, Typography } from '@mui/material';
import { HttpStatusCode } from 'axios';
import { toast } from 'react-toastify';
import logo from '../../assets/logo.png';
import { useUserContext } from '../../context/UserContext';
import userService from '../../services/userService';
import { logoTypographyStyle, toolbarStyle } from './styles';

export const TopBar = () => {
    const { userContext, clearUserSession } = useUserContext();

    const handleLogout = async () => {
        try {
            const { response } = await userService.logout();
            if (response.status === HttpStatusCode.Ok) {
                clearUserSession();
            }
        } catch {
            toast.error('Failed to log out');
        }
    };

    return (
        <Toolbar sx={toolbarStyle}>
            <Typography variant="h6" component="div" sx={logoTypographyStyle}>
                <Box component="img" src={logo} sx={{ height: '65px', marginRight: '8px' }} />
                WorkWise
            </Typography>
            {userContext?.id && (
                <IconButton onClick={handleLogout} color="inherit">
                    <ExitToApp />
                </IconButton>
            )}
        </Toolbar>
    );
};
