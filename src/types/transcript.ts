export type TranscriptLine = {
    time: string;
    confidence: number;
    text: string;
};

export type Transcript = TranscriptLine[];
