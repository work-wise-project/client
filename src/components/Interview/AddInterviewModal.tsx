import { Box, Button, Modal, SxProps, TextField, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useInterviewsContext } from '../../context/InterviewsContext';

interface AddInterviewModalProps {
    onClose: () => void;
}

export const AddInterviewModal = ({ onClose }: AddInterviewModalProps) => {
    const { addInterview } = useInterviewsContext();

    const [title, setTitle] = useState('');
    const [jobLink, setJobLink] = useState('');
    const [date, setDate] = useState<Dayjs | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title && jobLink && date) {
            addInterview({ title, jobLink, date: date.toISOString() });
            onClose();
        }
    };

    const TextFieldStyle: SxProps = {
        borderRadius: 1,
        fontSize: '20px',
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Modal open onClose={onClose}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        position: 'absolute' as const,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 600 },
                        maxWidth: 600,
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

                    <DateTimePicker
                        label="Interview Date & Time"
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                        minDateTime={dayjs()}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                required: true,
                            },
                        }}
                        format="MMM DD, YYYY hh:mm A"
                    />

                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, py: 1.5 }}>
                        Add Interview
                    </Button>
                </Box>
            </Modal>
        </LocalizationProvider>
    );
};
