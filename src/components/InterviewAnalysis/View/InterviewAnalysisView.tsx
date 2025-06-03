import { CheckCircleOutline, FormatListBulleted, GraphicEq, WarningAmber } from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import { ReactNode, useState } from 'react';
import { InterviewAnalysisPoint } from '../../../types';
import { CollapsableCard } from '../../CollapsableCard';
import { InterviewAnalysisViewProps } from './types';

const PointList = ({ points, icon, text }: { points: InterviewAnalysisPoint[]; icon: ReactNode; text: string }) => (
    <Card variant="outlined">
        <CardHeader
            title={
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {icon}
                    {text}
                </Typography>
            }
        />
        <CardContent>
            <List>
                {points.map(({ text, timestamp, trend }, index) => (
                    <ListItem key={index}>
                        <ListItemIcon>{icon}</ListItemIcon>
                        <ListItemText primary={text} secondary={`Timestamp: ${timestamp} | Trend: ${trend}`} />
                    </ListItem>
                ))}
            </List>
        </CardContent>
    </Card>
);

export const InterviewAnalysisView = ({
    points_to_improve,
    points_to_preserve,
    fileUrl,
}: InterviewAnalysisViewProps) => {
    const [showAudio, setShowAudio] = useState(false);
    const [showPoints, setShowPoints] = useState(true);

    return (
        <Box sx={{ maxHeight: '75vh', overflowY: 'auto' }}>
            <CollapsableCard
                isExpanded={showAudio}
                setIsExpanded={setShowAudio}
                titleIcon={<GraphicEq />}
                titleText="Interview Audio"
                cardStyle={{ marginBottom: 3 }}
                cardContent={
                    <CardMedia sx={{ padding: 2 }}>
                        <audio controls>
                            <source src={fileUrl} type="audio/wav" />
                            <Typography variant="body2">Your browser doesn't support the audio element</Typography>
                        </audio>
                    </CardMedia>
                }
            />
            <CollapsableCard
                isExpanded={showPoints}
                setIsExpanded={setShowPoints}
                titleIcon={<FormatListBulleted />}
                titleText="Points"
                cardContent={
                    <Grid container spacing={3} sx={{ padding: 2 }}>
                        <Grid size={6}>
                            <PointList
                                points={points_to_preserve}
                                icon={<CheckCircleOutline color="success" />}
                                text="Points to Preserve"
                            />
                        </Grid>
                        <Grid size={6}>
                            <PointList
                                points={points_to_improve}
                                icon={<WarningAmber color="warning" />}
                                text="Points to Improve"
                            />
                        </Grid>
                    </Grid>
                }
            />
        </Box>
    );
};
