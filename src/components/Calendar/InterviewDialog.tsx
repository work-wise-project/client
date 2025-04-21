import { Dialog, DialogTitle, List, ListItem, IconButton, Box, Typography } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { listItemStyled } from './styles';
import { InterviewDialogProps } from './types';

export const InterviewDialog = ({ open, handleClose, selectedDate, events }: InterviewDialogProps) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <Box sx={{ p: 2, minWidth: 300 }}>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    interviews – {selectedDate?.toLocaleDateString('en-GB')}
                </DialogTitle>
                <List>
                    {selectedDate &&
                        events[selectedDate.toISOString().split('T')[0]]?.map((event, index) => (
                            <ListItem key={index} sx={listItemStyled}>
                                <Typography variant="body2" fontWeight={500}>
                                    {event.time}
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                    {event.company}
                                </Typography>
                                <IconButton edge="end" size="small">
                                    <ArrowForwardIosIcon fontSize="inherit" />
                                </IconButton>
                            </ListItem>
                        ))}
                </List>
            </Box>
        </Dialog>
    );
};
