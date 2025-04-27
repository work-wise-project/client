import { useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { ResumeViewTypes } from './types';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export const ResumeView = ({ resumeUrl }: ResumeViewTypes) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    return (
        <>
            <Paper
                elevation={0}
                sx={{ p: 1, minHeight: '70vh', borderRadius: '16px', overflowY: 'auto', maxHeight: '70vh' }}
                square={false}
            >
                {!resumeUrl && (
                    <Typography variant="body2" color="text.secondary">
                        No file selected
                    </Typography>
                )}

                {resumeUrl && resumeUrl.endsWith('.pdf') && (
                    <Document file={resumeUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                        {Array.from(new Array(numPages), (_, i) => (
                            <Page key={i + 1} pageNumber={i + 1} />
                        ))}
                    </Document>
                )}
            </Paper>
        </>
    );
};
