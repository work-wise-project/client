import { zodResolver } from '@hookform/resolvers/zod';
import { AttachFile, Close, CloudUploadOutlined, PlayArrowOutlined } from '@mui/icons-material';
import { Box, Button, ButtonProps, IconButton, OutlinedInput, OutlinedInputProps, Typography } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { Controller, FieldError, useForm } from 'react-hook-form';
import { FormSchema, formSchema } from './formSchema';
import { fieldActionStyle, fieldLabelStyle, fieldStyle, formContainerStyle, submitButtonStyle } from './styles';
import { InterviewAnalysisFormProps } from './types';

export const FieldLabel = ({ icon, label }: { icon: ReactNode; label: string }) => (
    <Typography variant="h6" sx={fieldLabelStyle}>
        {icon}
        {label}
    </Typography>
);

export const InterviewAnalysisForm = ({ onSubmit, analysis }: InterviewAnalysisFormProps) => {
    const { control, formState, handleSubmit, reset } = useForm<FormSchema>({
        resolver: zodResolver(formSchema(analysis?.file_name)),
        mode: 'onChange',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (analysis) {
            reset({ file: analysis.file_name ? new File([], analysis.file_name, { type: 'audio/mp3' }) : undefined });
        }
    }, [analysis, reset]);

    const onFormSubmit = async ({ file }: FormSchema) => {
        setIsLoading(true);
        await onSubmit('audio', file);
        setIsLoading(false);
    };

    const fileProps = (onChange: (...event: any[]) => void, value: File, error?: FieldError): OutlinedInputProps => ({
        value: value?.name || '',
        readOnly: true,
        size: 'small',
        sx: { borderRadius: '10px' },
        error: !!error,
        startAdornment: value && (
            <IconButton size="small" onClick={() => onChange(null)}>
                <Close color="info" />
            </IconButton>
        ),
        endAdornment: (
            <IconButton component="label" size="small" sx={fieldActionStyle}>
                <CloudUploadOutlined />
                <input hidden type="file" onChange={(event) => onChange(event.target.files?.[0] || null)} />
            </IconButton>
        ),
    });
    const submitButtonProps: ButtonProps = {
        variant: 'outlined',
        color: 'primary',
        disabled: !formState.isValid,
        sx: submitButtonStyle,
        endIcon: <PlayArrowOutlined />,
        onClick: handleSubmit(onFormSubmit),
        loading: isLoading,
        loadingPosition: 'end',
    };

    return (
        <Box sx={formContainerStyle}>
            <Box sx={fieldStyle('20%')}>
                <FieldLabel icon={<AttachFile />} label="File" />
                <Controller
                    name="file"
                    control={control}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <>
                            <OutlinedInput {...fileProps(onChange, value, error)} />
                            {error && (
                                <Typography variant="body2" color="error">
                                    {error.message}
                                </Typography>
                            )}
                        </>
                    )}
                />
            </Box>
            <Button {...submitButtonProps}>Analyze</Button>
        </Box>
    );
};
