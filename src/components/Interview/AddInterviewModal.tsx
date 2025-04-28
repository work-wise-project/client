import { Box, Button, Modal, SxProps, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { InterviewData } from './types';

interface AddInterviewModalProps {
    onClose: () => void;
    onAdd: (interview: InterviewData) => void;
}

export default function AddInterviewModal({ onClose, onAdd }: AddInterviewModalProps) {
    const [title, setTitle] = useState('');
    const [jobLink, setJobLink] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title && jobLink && date) {
            onAdd({ title, jobLink, date: new Date(date).toISOString() });
            onClose();
        }
    };

    const TextFieldStyle: SxProps = {
        borderRadius: 4,
        fontSize: '20px',
    };

    return (
        <Modal open onClose={onClose}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    position: 'absolute' as const,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Typography variant="h4" component="h2" textAlign="center" fontWeight={'bold'}>
                    Add Interview
                </Typography>

                <TextField
                    slotProps={{ input: { sx: TextFieldStyle } }}
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    slotProps={{ input: { sx: TextFieldStyle } }}
                    label="Job Link"
                    value={jobLink}
                    onChange={(e) => setJobLink(e.target.value)}
                    type="url"
                    fullWidth
                    required
                />
                <TextField
                    slotProps={{ input: { sx: TextFieldStyle } }}
                    label="Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    type="date"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                />

                <Button type="submit" variant="contained" fullWidth>
                    Add Interview
                </Button>
            </Box>
        </Modal>
    );
}
