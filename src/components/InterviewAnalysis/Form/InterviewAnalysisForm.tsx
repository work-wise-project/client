import { zodResolver } from '@hookform/resolvers/zod';
import {
    AttachFile,
    Close,
    CloudUploadOutlined,
    InsertDriveFileOutlined,
    PlayArrowOutlined,
} from '@mui/icons-material';
import {
    Autocomplete,
    AutocompleteProps,
    AutocompleteRenderInputParams,
    Box,
    Button,
    ButtonProps,
    IconButton,
    OutlinedInput,
    OutlinedInputProps,
    TextField,
    TextFieldProps,
    Typography,
} from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { Controller, FieldError, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { ALLOWED_FILE_TYPES, FileType, fileTypeOptions } from '../../../constants';
import { analyzeInterview } from '../../../services/interviewService';
import { fieldActionStyle, fieldLabelStyle, fieldStyle, formContainerStyle, submitButtonStyle } from './styles';
import { InterviewAnalysisFormProps } from './types';

const FieldLabel = ({ icon, label }: { icon: ReactNode; label: string }) => (
    <Typography variant="h6" sx={fieldLabelStyle}>
        {icon}
        {label}
    </Typography>
);

const formSchema = z
    .object({
        fileType: z.union([
            z.object({ id: z.literal('audio'), name: z.literal('Audio') }, { message: 'File type is required' }),
            z.object({ id: z.literal('text'), name: z.literal('Text') }),
        ]),
        file: z.instanceof(File, { message: 'File is required' }),
    })
    .superRefine(({ file, fileType: { id: fileType } }, context) => {
        if (!ALLOWED_FILE_TYPES[fileType].includes(file.type)) {
            context.addIssue({
                path: ['file'],
                message: `Only ${fileType} files are allowed`,
                code: z.ZodIssueCode.custom,
            });
        }
    });
type FormSchema = z.infer<typeof formSchema>;

export const InterviewAnalysisForm = ({ onSubmit: outerOnSubmit }: InterviewAnalysisFormProps) => {
    const { control, formState, handleSubmit, reset, watch, resetField } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        resetField('file');
    }, [watch('fileType'), resetField]);

    const onSubmit = async ({ fileType, file }: FormSchema) => {
        setIsLoading(true);
        try {
            const { analysis } = await analyzeInterview(file, fileType.id);
            outerOnSubmit(analysis);
            reset();
        } catch (error) {
            toast.error('Error analyzing interview. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const fileTypeTextFieldProps = (params: AutocompleteRenderInputParams, error?: FieldError): TextFieldProps => ({
        ...params,
        autoComplete: 'off',
        InputProps: { style: { borderRadius: '10px' }, ...params.InputProps },
        error: !!error,
        helperText: error?.message,
    });
    const fileTypeProps = (error?: FieldError): AutocompleteProps<FileType, false, false, false> => ({
        options: fileTypeOptions.filter(({ id }) => id !== 'text'),
        getOptionLabel: ({ name }) => name,
        getOptionKey: ({ id }) => id,
        isOptionEqualToValue: (option, value) => option.id === value.id,
        renderInput: (params) => <TextField {...fileTypeTextFieldProps(params, error)} />,
        autoComplete: false,
        size: 'small',
        slotProps: { clearIndicator: { sx: fieldActionStyle }, popupIndicator: { sx: fieldActionStyle } },
    });
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
        onClick: handleSubmit(onSubmit),
        loading: isLoading,
        loadingPosition: 'end',
    };

    return (
        <Box sx={formContainerStyle}>
            <Box sx={fieldStyle('12%')}>
                <FieldLabel icon={<InsertDriveFileOutlined />} label="File Type" />
                <Controller
                    name="fileType"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <Autocomplete
                            {...field}
                            {...fileTypeProps(error)}
                            value={field.value ?? null}
                            onChange={(_, newValue) => field.onChange(newValue)}
                        />
                    )}
                />
            </Box>
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
