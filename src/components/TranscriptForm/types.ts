import { Transcript } from '../../types';

export type TranscriptFormProps = {
    onSubmit: (transcript: Transcript) => void;
    setIsLoading: (isLoading: boolean) => void;
};
