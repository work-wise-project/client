import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Select,
    MenuItem,
    IconButton,
    FormControl,
    InputLabel,
    InputAdornment,
    Autocomplete,
    AutocompleteProps,
    AutocompleteRenderInputParams,
    TextFieldProps,
    OutlinedInput,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { FieldLabel } from '../TranscriptForm/TranscriptForm';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Controller, FieldError, useFieldArray, useForm } from 'react-hook-form';
import { fieldActionStyle, fieldStyle } from '../TranscriptForm/styles';
// import { skillsTypeOptions, SkillType } from '../../constants';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { primaryIconButton } from './styles';
import skillService, { ISkill } from '../../services/skillService';
import { HttpStatusCode } from 'axios';

interface EducationEntry {
    institute: string;
    years: string;
}

interface CareerEntry {
    company: string;
    years: string;
}

const ProfessionalProfile = ({ setActiveStep }: { setActiveStep: React.Dispatch<React.SetStateAction<number>> }) => {
    const { control } = useForm<any>({
        mode: 'onChange',
        defaultValues: {
            educations: [{ institute: '', years: '' }],
            careers: [{ company: '', years: '' }],
            skills: [],
        },
    });

    const {
        fields: educations,
        append: appendEducation,
        remove: removeEducation,
    } = useFieldArray({
        control,
        name: 'educations',
    });

    const {
        fields: careers,
        append: appendCareer,
        remove: removeCareer,
    } = useFieldArray({
        control,
        name: 'careers',
    });

    const [skillsTypeOptions, setSkillsTypeOptions] = useState<Array<ISkill>>([]);

    const skillTextFieldProps = (params: AutocompleteRenderInputParams, error?: FieldError): TextFieldProps => ({
        ...params,
        autoComplete: 'off',
        InputProps: { style: { borderRadius: '10px', backgroundColor: 'white' }, ...params.InputProps },
        error: !!error,
        helperText: error?.message,
    });
    const skillProps = (error?: FieldError): AutocompleteProps<ISkill, true, false, false> => ({
        options: skillsTypeOptions.filter(({ id }) => id !== 'text'),
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

    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
                    Create account - Professional profile
                </Typography>
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
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, mt: 3 }}>
                    <Box sx={{ flex: 1, minWidth: '400px' }}>
                        <FieldLabel icon={<SchoolIcon />} label="Education" />
                        {educations.map((field, index) => (
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
                                    name={`education.${index}.years`}
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <FormControl sx={{ minWidth: 50 }} variant="outlined">
                                            <OutlinedInput
                                                {...field}
                                                type="number"
                                                placeholder="Years of experience"
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
                                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                                    {educations.length !== 1 && (
                                        <IconButton onClick={() => removeEducation(index)} sx={primaryIconButton}>
                                            <RemoveCircleOutlineIcon />
                                        </IconButton>
                                    )}
                                    {index === educations.length - 1 && (
                                        <IconButton
                                            onClick={() => appendEducation({ institute: '', years: '' })}
                                            sx={primaryIconButton}
                                        >
                                            <AddCircleOutlineIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: '400px' }}>
                        <FieldLabel icon={<WorkIcon />} label="Career" />
                        {careers.map((field, index) => (
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
                                            <OutlinedInput
                                                {...field}
                                                type="number"
                                                placeholder="Years of experience"
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
                                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                                    {careers.length !== 1 && (
                                        <IconButton onClick={() => removeCareer(index)} sx={primaryIconButton}>
                                            <RemoveCircleOutlineIcon />
                                        </IconButton>
                                    )}
                                    {index === careers.length - 1 && (
                                        <IconButton
                                            onClick={() => appendCareer({ institute: '', years: '' })}
                                            sx={primaryIconButton}
                                        >
                                            <AddCircleOutlineIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    zIndex: 1000,
                }}
            >
                <IconButton
                    aria-label="next step"
                    sx={{ fontSize: 40, ...primaryIconButton }}
                    onClick={() => setActiveStep((prev) => prev + 1)}
                >
                    <ArrowForwardIcon sx={{ fontSize: 40 }} />
                </IconButton>
            </Box>
        </Container>
    );
};

export default ProfessionalProfile;
