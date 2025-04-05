export const ALLOWED_FILE_TYPES = {
    audio: ['audio/mpeg', 'audio/wav'],
    text: [
        'text/plain',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
};

export const fileTypeOptions = [
    { id: 'audio', name: 'Audio' },
    { id: 'text', name: 'Text' },
];
export type FileType = (typeof fileTypeOptions)[number];
