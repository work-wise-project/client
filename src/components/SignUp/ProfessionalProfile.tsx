import React from 'react';
import { Container, Box, IconButton, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { HttpStatusCode } from 'axios';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import userService from '../../services/userService';
import { IUser, UserCareer, UserEducation, UserSkill } from '../../types';
import UserQualificationsForm from '../Profile/UserQualificationsForm';
import { primaryIconButton } from './styles';
import { toast } from 'react-toastify';

const yearSchema = z.coerce
    .number({
        required_error: 'Years of experience is required',
        invalid_type_error: 'Must be a number',
    })
    .min(0, { message: 'Years of experience cannot be negative' })
    .max(50, { message: 'Years of experience seems too high' });

const educationEntrySchema = z.object({
    institute: z.string().min(1, { message: 'Institute is required' }),
    years: yearSchema,
});

const careerEntrySchema = z.object({
    company: z.string().min(1, { message: 'Company is required' }),
    years: yearSchema,
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
    currentUser,
}: {
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    currentUser: IUser;
}) => {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            education: [{ institute: '', years: 0 }],
            career: [{ company: '', years: 0 }],
            skills: [],
        },
    });

    const onSubmit = async (data: FormSchema) => {
        const formattedEducation = data.education.filter(
            (edu: UserEducation) => edu.institute.trim() !== '' && edu.years >= 0
        );

        const formattedCareer = data.career.filter(
            (career: UserCareer) => career.company.trim() !== '' && career.years >= 0
        );

        const formattedSkills = data.skills.map((skill: UserSkill) => ({
            ...skill,
            skill_id: skill.id,
        }));

        try {
            const { response } = await userService.updateUser(currentUser.id, {
                education: formattedEducation,
                career: formattedCareer,
                skills: formattedSkills,
            });

            if (response.status === HttpStatusCode.Ok) {
                setActiveStep((prev) => prev + 1);
            } else {
                toast.error('Failed to update user profile');
            }
        } catch {
            toast.error('Failed to update user profile');
        }
    };

    return (
        <Container>
            <FormProvider {...form}>
                <Box
                    component="form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    noValidate
                    sx={{ display: 'flex', flexDirection: 'column' }}
                >
                    <UserQualificationsForm />
                    <Button type="submit" style={{ display: 'none' }} />
                </Box>
            </FormProvider>

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
                    onClick={form.handleSubmit(onSubmit)}
                >
                    <ArrowForwardIcon sx={{ fontSize: 40 }} />
                </IconButton>
            </Box>
        </Container>
    );
};

export default ProfessionalProfile;
