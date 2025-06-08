import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, TextField, TextFieldProps, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { Controller, FieldError, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useInterviewsContext } from '../../../context';
import { InterviewFormProps } from './types';

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    jobLink: z.string().url('Enter a valid URL'),
    date: z.date().refine((value) => value > new Date(), { message: 'Date must be in the future' }),
});
type FormSchema = z.infer<typeof formSchema>;

export const InterviewForm = ({ onSubmit: outerOnSubmit }: InterviewFormProps) => {
    const { addInterview } = useInterviewsContext();

    const { control, handleSubmit, formState } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: '', jobLink: '', date: new Date() },
        mode: 'onChange',
    });

    const onSubmit = ({ title, jobLink, date }: FormSchema) => {
        addInterview({ title, jobLink, date: date.toISOString() });
        outerOnSubmit && outerOnSubmit();
    };

    const textFieldProps = (error?: FieldError): TextFieldProps => ({
        fullWidth: true,
        required: true,
        error: !!error,
        helperText: error?.message,
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" textAlign="center">
                    Add Interview
                </Typography>
                <Controller
                    name="title"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label="Title" {...textFieldProps(error)} />
                    )}
                />
                <Controller
                    name="jobLink"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label="Job Link" type="url" {...textFieldProps(error)} />
                    )}
                />
                <Controller
                    name="date"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <DateTimePicker
                            {...field}
                            format="DD/MM/YYYY HH:mm"
                            ampm={false}
                            label="Interview Date & Time"
                            minDateTime={dayjs()}
                            slotProps={{ textField: { ...textFieldProps(error) } }}
                            onChange={(date) => field.onChange(date?.toDate() ?? null)}
                            value={field.value ? dayjs(field.value) : null}
                        />
                    )}
                />
                <Button variant="contained" fullWidth disabled={!formState.isValid} onClick={handleSubmit(onSubmit)}>
                    Add Interview
                </Button>
            </Box>
        </LocalizationProvider>
    );
};
