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

const UserQualificationsForm = () => {
    const { control } = useFormContext();

    const {
        fields: education,
        append: appendEducation,
        remove: removeEducation,
    } = useFieldArray({ control, name: 'education' });

    const { fields: career, append: appendCareer, remove: removeCareer } = useFieldArray({ control, name: 'career' });

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

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                gap: { md: 1, lg: 2, xl: 7 },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',

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

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: { md: 1, lg: 4, xl: 10 },
                    mb: 2,
                    mt: 5,
                    px: { xs: 1, sm: 2, md: 3 },
                }}
            >
                <Box
                    sx={{
                        minWidth: { xs: '100%', lg: '400px', xl: '700px' },
                    }}
                >
                    <FieldLabel icon={<SchoolIcon />} label="Education" />
                    {education.map((field, index) => (
                        <Box
                            key={field.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1,
                                flexGrow: 1,
                                gap: { xs: 0.5, sm: 1 },
                            }}
                        >
                            <Controller
                                name={`education.${index}.institute`}
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <FormControl
                                        sx={{
                                            mr: { xs: 0.5, sm: 1 },

                                            minWidth: {
                                                xs: '150px',
                                                sm: '200px',

                                                lg: '250px',
                                                xl: '300px',
                                            },
                                        }}
                                        variant="outlined"
                                    >
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
                                    <FormControl sx={{ minWidth: 50 }}>
                                        <TextField
                                            {...field}
                                            type="number"
                                            placeholder="Years"
                                            label="Years"
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
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 0.5, sm: 1 } }}>
                                {education.length !== 1 && (
                                    <IconButton onClick={() => removeEducation(index)} color="primary" size="small">
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

                <Box
                    sx={{
                        minWidth: '50%',
                        paddingInlineStart: { xs: 0, lg: 2, xl: 3 },
                    }}
                >
                    <FieldLabel icon={<WorkIcon />} label="Career" />
                    {career.map((field, index) => (
                        <Box
                            key={field.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1,

                                gap: { xs: 0.5, sm: 1 },
                            }}
                        >
                            <Controller
                                name={`career.${index}.company`}
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <FormControl
                                        sx={{
                                            mr: { xs: 0.5, sm: 1 },

                                            minWidth: { xs: '150px', sm: '200px', lg: '250px', xl: '300px' },
                                        }}
                                        variant="outlined"
                                    >
                                        <OutlinedInput
                                            {...field}
                                            placeholder="Company"
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
                                name={`career.${index}.years`}
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <FormControl variant="outlined">
                                        <TextField
                                            {...field}
                                            type="number"
                                            placeholder="Years"
                                            label="Years"
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
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 0.5, sm: 1 } }}>
                                {career.length !== 1 && (
                                    <IconButton onClick={() => removeCareer(index)} color="primary" size="small">
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                )}
                                {index === career.length - 1 && (
                                    <IconButton
                                        onClick={() => appendCareer({ company: '', years: 0 })}
                                        color="primary"
                                        size="small"
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
    );
};

export default UserQualificationsForm;
