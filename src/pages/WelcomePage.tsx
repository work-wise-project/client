import { FC } from 'react';
import { Box, Container, Link, Typography } from '@mui/material';

const WelcomePage: FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'left', mt: 8 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Welcome to WorkWise,
        </Typography>
        <Typography variant="h4" gutterBottom>
          To start your journey to improve yourself and your career
        </Typography>
        <Link href="/signup" variant="h5" sx={{ display: 'block', mt: 2 }}>
          Create an account
        </Link>
        <Link href="/login" variant="h5" sx={{ display: 'block', mt: 4 }}>
          Already have an account?
        </Link>
      </Box>
    </Container>
  );
};

export default WelcomePage;
