import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PsychologyIcon from '@mui/icons-material/Psychology';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import {
    Autocomplete,
    AutocompleteProps,
    AutocompleteRenderInputParams,
    Box,
    Container,
    FormControl,
    IconButton,
    OutlinedInput,
    TextField,
    TextFieldProps,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { HttpStatusCode } from 'axios';
import { Controller, FieldError, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import skillService from '../../services/skillService';
import userService from '../../services/userService';
import { ISkill, UserCareer, UserEducation, UserSkill } from '../../types';
import { FieldLabel } from '../InterviewAnalysis/Form/InterviewAnalysisForm';
import { fieldActionStyle, fieldStyle } from '../InterviewAnalysis/Form/styles';

const yearSchema = z.coerce
    .number({
        required_error: 'Years of experience is required',
        invalid_type_error: 'Must be a number',
    })
    .min(0, { message: 'Years of experience cannot be negative' })
    .max(50, { message: 'Years of experience seems to high' });

const educationEntrySchema = z
    .object({
        institute: z.string(),
        years: yearSchema,
    })
    .superRefine((data, ctx) => {
        if (data.years > 0 && data.institute.trim().length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Institute is required with years of experience',
                path: ['institute'],
            });
        }
    });

const careerEntrySchema = z
    .object({
        company: z.string(),
        years: yearSchema,
    })
    .superRefine((data, ctx) => {
        if (data.years > 0 && data.company.trim().length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Company is required with years of experience',
                path: ['company'],
            });
        }
    });

const skillEntrySchema = z.object({
    id: z.number(),
    name: z.string().min(1, { message: 'Skill name is required' }),
    is_deleted: z.boolean(),
});

const formSchema = z.object({
    education: z.array(educationEntrySchema),
    career: z.array(careerEntrySchema),
    skills: z.array(skillEntrySchema),
});

type FormSchema = z.infer<typeof formSchema>;

const ProfessionalProfile = ({
    setActiveStep,
    currentUserId,
}: {
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    currentUserId: string;
}) => {
    const { control, getValues } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            education: [{ institute: '', years: 0 }],
            career: [{ company: '', years: 0 }],
            skills: [],
        },
    });

    const {
        fields: education,
        append: appendEducation,
        remove: removeEducation,
    } = useFieldArray({
        control,
        name: 'education',
    });

    const {
        fields: career,
        append: appendCareer,
        remove: removeCareer,
    } = useFieldArray({
        control,
        name: 'career',
    });

    const [skillsTypeOptions, setSkillsTypeOptions] = useState<Array<ISkill>>([]);

    const skillTextFieldProps = (params: AutocompleteRenderInputParams, error?: FieldError): TextFieldProps => ({
        ...params,
        autoComplete: 'off',
        InputProps: { style: { borderRadius: '10px' }, ...params.InputProps },
        error: !!error,
        helperText: error?.message,
    });
    const skillProps = (error?: FieldError): AutocompleteProps<ISkill, true, false, false> => ({
        options: skillsTypeOptions,
        getOptionLabel: ({ name }) => name,
        getOptionKey: ({ id }) => id,
        isOptionEqualToValue: (option, value) => option.id === value.id,
        renderInput: (params) => <TextField {...skillTextFieldProps(params, error)} label="select your skills" />,
        autoComplete: false,
        size: 'medium',
        multiple: true,
        slotProps: { clearIndicator: { sx: fieldActionStyle }, popupIndicator: { sx: fieldActionStyle } },
    });

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const { response } = await skillService.getAllSkills();

                if (response.status === HttpStatusCode.Ok) {
                    setSkillsTypeOptions(response.data as ISkill[]);
                }
            } catch (error) {
                console.error('Error fetching skills:', error);
            }
        };

        fetchSkills();
    }, []);

    const saveUserProfessionalProfile = async () => {
        const formData = getValues();

        const formattedEducation = formData.education.filter(
            (edu: UserEducation) => edu.institute !== '' && edu.years >= 0
        );

        const formattedCareer = formData.career.filter(
            (career: UserCareer) => career.company !== '' && career.years >= 0
        );

        const formattedSkills = formData.skills.map((skill: UserSkill) => ({
            ...skill,
            skill_id: skill.id,
        }));

        const { response } = await userService.updateUser(currentUserId, {
            education: formattedEducation,
            career: formattedCareer,
            skills: formattedSkills,
        });

        if (response.status === HttpStatusCode.Ok) {
            setActiveStep((prev) => prev + 1);
        }
    };

    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '50%',
                        margin: '0 auto',
                        ...fieldStyle('60%'),
                    }}
                >
                    <FieldLabel icon={<PsychologyIcon />} label="Skills" />
                    <Controller
                        name="skills"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <Autocomplete
                                {...field}
                                {...skillProps(error)}
                                value={Array.isArray(field.value) ? field.value : []}
                                onChange={(_, newValue) => field.onChange(newValue)}
                            />
                        )}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, mt: 5 }}>
                    <Box sx={{ flex: 1, minWidth: '400px' }}>
                        <FieldLabel icon={<SchoolIcon />} label="Education" />
                        {education.map((field, index) => (
                            <Box key={field.id} sx={{ display: 'flex', alignItems: 'center', mb: 1, flexGrow: 1 }}>
                                <Controller
                                    name={`education.${index}.institute`}
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <FormControl sx={{ mr: 1, flexGrow: 1 }} variant="outlined">
                                            <OutlinedInput
                                                {...field}
                                                placeholder="Institute"
                                                error={!!error}
                                                sx={{ borderRadius: '10px' }}
                                            />
                                            {error && (
                                                <Typography variant="body2" color="error">
                                                    {error.message}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    name={`education.${index}.years`}
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <FormControl sx={{ minWidth: 50 }}>
                                            <TextField
                                                {...field}
                                                type="number"
                                                label="Years of experience"
                                                placeholder="Years of experience"
                                                error={!!error}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                            {error && (
                                                <Typography variant="body2" color="error">
                                                    {error.message}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    )}
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                                    {education.length !== 1 && (
                                        <IconButton onClick={() => removeEducation(index)} color="primary">
                                            <RemoveCircleOutlineIcon />
                                        </IconButton>
                                    )}
                                    {index === education.length - 1 && (
                                        <IconButton
                                            onClick={() => appendEducation({ institute: '', years: 0 })}
                                            color="primary"
                                        >
                                            <AddCircleOutlineIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: '400px', paddingInlineStart: 5 }}>
                        <FieldLabel icon={<WorkIcon />} label="Career" />
                        {career.map((field, index) => (
                            <Box key={field.id} sx={{ display: 'flex', alignItems: 'center', mb: 1, flexGrow: 1 }}>
                                <Controller
                                    name={`career.${index}.company`}
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <FormControl sx={{ mr: 1, flexGrow: 1 }} variant="outlined">
                                            <OutlinedInput
                                                {...field}
                                                placeholder="Company"
                                                error={!!error}
                                                sx={{ borderRadius: '10px', backgroundColor: 'white' }}
                                            />
                                            {error && (
                                                <Typography variant="body2" color="error">
                                                    {error.message}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    )}
                                />

                                <Controller
                                    name={`career.${index}.years`}
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <FormControl sx={{ minWidth: 50 }} variant="outlined">
                                            <TextField
                                                {...field}
                                                type="number"
                                                label="Years of experience"
                                                placeholder="Years of experience"
                                                error={!!error}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                            {error && (
                                                <Typography variant="body2" color="error">
                                                    {error.message}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    )}
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                                    {career.length !== 1 && (
                                        <IconButton onClick={() => removeCareer(index)} color="primary">
                                            <RemoveCircleOutlineIcon />
                                        </IconButton>
                                    )}
                                    {index === career.length - 1 && (
                                        <IconButton
                                            color="primary"
                                            onClick={() => appendCareer({ company: '', years: 0 })}
                                        >
                                            <AddCircleOutlineIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 50,
                        right: 50,
                        zIndex: 1000,
                    }}
                >
                    <IconButton
                        aria-label="next step"
                        onClick={saveUserProfessionalProfile}
                        size="large"
                        color="primary"
                    >
                        <ArrowForwardIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                </Box>
            </Box>
        </Container>
    );
};

export default ProfessionalProfile;
