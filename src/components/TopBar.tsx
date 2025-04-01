import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import logoImage from '../../logo.png'; // Replace with your image path
import { ExitToApp } from '@mui/icons-material';
import userService from '../services/userService';
import { HttpStatusCode } from 'axios';
import { useUserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

const TopBar = () => {
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
    <AppBar
      position="static"
      style={{ height: '70px', backgroundColor: 'white', color: 'black' }}
      elevation={0}
    >
      <Toolbar style={{ height: '100%' }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Box display="flex" alignItems="center">
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 0,
                marginRight: 2,
                display: 'flex',
                alignItems: 'center',
                fontWeight: 'bold',
              }}
            >
              <img
                src={logoImage}
                alt="WorkWise Logo"
                style={{ height: '65px', marginRight: '8px' }}
              />
              WorkWise
            </Typography>
          </Box>
          {userContext?.id && (
            <IconButton onClick={handleLogout} color="inherit">
              <ExitToApp />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
