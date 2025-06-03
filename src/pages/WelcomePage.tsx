import { Box, Container, Link, Typography, CircularProgress } from '@mui/material';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const WelcomePage: FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreateAccount = async () => {
        setLoading(true);
        // Simulate a small delay or any async operation if needed
        setTimeout(() => {
            navigate('/signup');
        }, 500);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ textAlign: 'left', mt: 15 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom color="secondary">
                    Welcome to WorkWise,
                </Typography>
                <Typography variant="h4" gutterBottom>
                    To start your journey to improve yourself and your career
                </Typography>
                <Link
                    component="button"
                    variant="h5"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mt: 10,
                        textDecoration: 'underline',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        padding: 0,
                    }}
                    onClick={handleCreateAccount}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Creating account...
                        </>
                    ) : (
                        'Create an account'
                    )}
                </Link>
                <Link href="/login" variant="h5" sx={{ display: 'block', mt: 4 }}>
                    Already have an account?
                </Link>
            </Box>
        </Container>
    );
};
