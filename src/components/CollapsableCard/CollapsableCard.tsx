import { ExpandMore } from '@mui/icons-material';
import { Card, CardHeader, Collapse, IconButton, Typography } from '@mui/material';
import { CollapsableCardProps } from './types';

export const CollapsableCard = ({
    isExpanded,
    setIsExpanded,
    titleIcon,
    titleText,
    cardContent,
    cardStyle,
}: CollapsableCardProps) => (
    <Card sx={cardStyle} elevation={0}>
        <CardHeader
            title={
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {titleIcon}
                    {titleText}
                </Typography>
            }
            action={
                <IconButton
                    onClick={() => setIsExpanded((prev) => !prev)}
                    sx={{
                        transform: isExpanded ? 'rotate(-180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s',
                    }}
                >
                    <ExpandMore color="info" />
                </IconButton>
            }
        />
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            {cardContent}
        </Collapse>
    </Card>
);
