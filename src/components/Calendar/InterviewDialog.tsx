import React, { useState } from 'react';
import { Dialog, DialogTitle, List, ListItem, IconButton, Box, ListItemText, Menu, MenuItem } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { listItemStyled, listItemTextStyled, menuStyled } from './styles';
import { InterviewDialogProps, dateFormatter } from './types';

export const InterviewDialog = ({ open, handleClose, selectedDate, interviews }: InterviewDialogProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedInterview, setSelectedInterview] = useState<string | null>(null);

    const handleExpandClick = (event: React.MouseEvent<HTMLButtonElement>, interviewId: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedInterview(interviewId);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedInterview(null);
    };

    const handleAction = (action: string) => {
        console.log(`${action} for ${selectedInterview}`);
        handleCloseMenu();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <Box sx={{ p: 2, minWidth: 300 }}>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    interviews – {selectedDate?.toLocaleDateString('en-GB')}
                </DialogTitle>
                <List>
                    {selectedDate &&
                        interviews &&
                        interviews.get(dateFormatter(selectedDate))?.map((event, index) => (
                            <ListItem
                                key={event.id}
                                sx={listItemStyled}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        onClick={(e) => handleExpandClick(e, event.company)}
                                        aria-label="more"
                                    >
                                        <ArrowForwardIosIcon color="secondary" />
                                    </IconButton>
                                }
                            >
                                <ListItemText
                                    primary={event.company}
                                    secondary={event.time}
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
