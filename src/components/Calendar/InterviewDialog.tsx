import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Dialog, DialogTitle, IconButton, List, ListItem, ListItemText, Menu, MenuItem } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterviewsContext } from '../../context';
import { Interview } from '../../types';
import { listItemStyled, listItemTextStyled, menuStyled } from './styles';
import { InterviewDialogProps, formatDate, formatTime } from './types';

export const InterviewDialog = ({ open, handleClose, selectedDate }: InterviewDialogProps) => {
    const { scheduledInterviews, removeInterview } = useInterviewsContext();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (open) {
            const activeEl = document.activeElement as HTMLElement | null;
            if (activeEl && typeof activeEl.blur === 'function') {
                activeEl.blur();
            }
        }
    }, [open]);

    const handleExpandClick = (event: React.MouseEvent<HTMLButtonElement>, interview: Interview) => {
        setAnchorEl(event.currentTarget);
        setSelectedInterview(interview);
    };

    const handleCloseMenu = useCallback(() => {
        setAnchorEl(null);
        setSelectedInterview(null);
        handleClose();
    }, [handleClose]);

    const handleAction = useCallback(
        async (action: string) => {
            if (!selectedInterview) {
                alert('No interview selected');
                return;
            }
            switch (action) {
                case 'Analysis':
                    navigate(`/interviewAnalysis/${selectedInterview.id}`, {
                        state: { title: selectedInterview.title },
                    });
                    break;
                case 'Preparation':
                    navigate(`/interviewPreparation/${selectedInterview.id}`, {
                        state: { title: selectedInterview.title },
                    });
                    break;
                case 'Delete':
                    await removeInterview(selectedInterview.id);
                    break;
                default:
                    alert('Invalid action');
            }
            handleCloseMenu();
        },
        [handleCloseMenu, navigate, removeInterview, selectedInterview]
    );

    return (
        <Dialog open={open} onClose={handleClose}>
            <Box sx={{ p: 2, minWidth: 300 }}>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    interviews – {selectedDate && formatDate(selectedDate)}
                </DialogTitle>
                <List>
                    {selectedDate &&
                        scheduledInterviews &&
                        scheduledInterviews
                            .get(formatDate(selectedDate))
                            ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                            .map((event) => (
                                <ListItem
                                    key={event.id}
                                    sx={listItemStyled}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            onClick={(e) => handleExpandClick(e, event)}
                                            aria-label="more"
                                        >
                                            <ArrowForwardIosIcon color="secondary" />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={event.title}
                                        secondary={formatTime(event.date)}
                                        slotProps={listItemTextStyled}
                                    />
                                </ListItem>
                            ))}
                </List>
            </Box>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu} slotProps={menuStyled}>
                <MenuItem onClick={() => handleAction('Analysis')}>Analysis</MenuItem>
                <MenuItem onClick={() => handleAction('Preparation')}>Preparation</MenuItem>
                <MenuItem onClick={() => handleAction('Delete')}>Delete</MenuItem>
            </Menu>
        </Dialog>
    );
};
