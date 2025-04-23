import { CheckCircle, WarningAmber } from '@mui/icons-material';
import { Card, CardContent, CardHeader, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ReactNode } from 'react';
import { InterviewAnalysis } from '../../../types';

const PointList = ({ points, icon }: { points: string[]; icon: ReactNode }) => (
    <List>
        {points.map((point, index) => (
            <ListItem key={index}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={point} />
            </ListItem>
        ))}
    </List>
);
export const InterviewAnalysisView = ({ points_to_improve, points_to_preserve }: InterviewAnalysis) => (
    <Grid container spacing={3}>
        <Grid size={6}>
            <Card variant="outlined">
                <CardHeader title="✅ Points to Preserve" slotProps={{ title: { color: 'success' } }} />
                <CardContent>
                    <PointList points={points_to_preserve} icon={<CheckCircle color="success" />} />
                </CardContent>
            </Card>
        </Grid>
        <Grid size={6}>
            <Card variant="outlined">
                <CardHeader title="⚠️ Points to Improve" slotProps={{ title: { color: 'warning' } }} />
                <CardContent>
                    <PointList points={points_to_improve} icon={<WarningAmber color="warning" />} />
                </CardContent>
            </Card>
        </Grid>
    </Grid>
);
