import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { TranscriptViewProps } from './types';

export const TranscriptView = ({ transcript }: TranscriptViewProps) => (
    <TableContainer component={Paper} sx={{ maxHeight: '75vh' }}>
        <Table stickyHeader>
            <TableHead>
                <TableRow>
                    <TableCell>
                        <strong>Time</strong>
                    </TableCell>
                    <TableCell>
                        <strong>Confidence</strong>
                    </TableCell>
                    <TableCell>
                        <strong>Text</strong>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {transcript.map(({ confidence, text, time }, index) => (
                    <TableRow key={index}>
                        <TableCell>{time}</TableCell>
                        <TableCell>{confidence * 100}%</TableCell>
                        <TableCell>{text}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);
