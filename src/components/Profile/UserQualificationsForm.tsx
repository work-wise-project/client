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
    FormControl,
    IconButton,
    OutlinedInput,
    TextField,
    TextFieldProps,
    Typography,
} from '@mui/material';
import { HttpStatusCode } from 'axios';
import { useEffect, useState } from 'react';
import { Controller, FieldError, useFieldArray, useFormContext } from 'react-hook-form';
import skillService from '../../services/skillService';
import { ISkill } from '../../types';
import { FieldLabel } from '../InterviewAnalysis/Form/InterviewAnalysisForm';
import { fieldActionStyle, fieldStyle } from '../InterviewAnalysis/Form/styles';
import { primaryIconButton } from '../SignUp/styles';

const UserQualificationsForm = () => {
    const { control, watch, setValue } = useFormContext();

    const {
        fields: education,
        append: appendEducation,
        remove: removeEducation,
    } = useFieldArray({ control, name: 'education' });

    const { fields: career, append: appendCareer, remove: removeCareer } = useFieldArray({ control, name: 'career' });

    const [skillsTypeOptions, setSkillsTypeOptions] = useState<Array<ISkill>>([]);

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

    const skills = watch('skills') || [];
    const newSkills = watch('newSkills') || [];

    const skillTextFieldProps = (params: AutocompleteRenderInputParams, error?: FieldError): TextFieldProps => ({
        ...params,
        autoComplete: 'off',
        InputProps: { style: { borderRadius: '10px', backgroundColor: 'white' }, ...params.InputProps },
        error: !!error,
        helperText: error?.message,
    });

    const skillProps = (error?: FieldError): AutocompleteProps<ISkill | string, true, false, true> => ({
        options: skillsTypeOptions,
        getOptionLabel: (option) => (typeof option === 'string' ? option : option.name),
        getOptionKey: (option) => (typeof option === 'string' ? option : option.id),
        isOptionEqualToValue: (option, value) =>
            (typeof option === 'string' && typeof value === 'string' && option === value) ||
            (typeof option !== 'string' && typeof value !== 'string' && option.id === value.id),
        renderInput: (params) => <TextField {...skillTextFieldProps(params, error)} label="Select your skills" />,
        autoComplete: false,
        size: 'medium',
        multiple: true,
        freeSolo: true,
        slotProps: { clearIndicator: { sx: fieldActionStyle }, popupIndicator: { sx: fieldActionStyle } },
    });

    return (
        <>
            <Box
                sx={{ display: 'flex', justifyContent: 'center', width: '50%', margin: '0 auto', ...fieldStyle('60%') }}
            >
                <FieldLabel icon={<PsychologyIcon />} label="Skills" />
                <Controller
                    name="skills"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <Autocomplete
                            freeSolo
                            {...skillProps(error)}
                            value={[...skills, ...newSkills]}
                            onChange={(_, newValue) => {
                                const existingSkills = newValue.filter((item) => typeof item !== 'string') as ISkill[];
                                const createdSkills = newValue.filter((item) => typeof item === 'string') as string[];

                                field.onChange(existingSkills);
                                setValue('newSkills', createdSkills, { shouldValidate: true, shouldDirty: true });
                            }}
                        />
                    )}
                />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, mt: 3 }}>
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
                                            placeholder="Years"
                                            error={!!error}
                                            sx={{ borderRadius: '10px', backgroundColor: 'white' }}
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
                                    <IconButton onClick={() => removeEducation(index)} sx={primaryIconButton}>
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                )}
                                {index === education.length - 1 && (
                                    <IconButton
                                        onClick={() => appendEducation({ institute: '', years: 0 })}
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
                                        <OutlinedInput
                                            {...field}
                                            type="number"
                                            placeholder="Years"
                                            error={!!error}
                                            sx={{ borderRadius: '10px', backgroundColor: 'white' }}
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
                                    <IconButton onClick={() => removeCareer(index)} sx={primaryIconButton}>
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                )}
                                {index === career.length - 1 && (
                                    <IconButton
                                        onClick={() => appendCareer({ company: '', years: 0 })}
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
        </>
    );
};

export default UserQualificationsForm;
