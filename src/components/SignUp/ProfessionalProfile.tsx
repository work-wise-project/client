import { zodResolver } from '@hookform/resolvers/zod';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Button, Container, IconButton } from '@mui/material';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { IUser, UserCareer, UserEducation, UserSkill } from '../../types';
import UserQualificationsForm from '../Profile/UserQualificationsForm';

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
type ProfessionalProfileProps = {
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    setUserData: React.Dispatch<React.SetStateAction<Partial<IUser> | null>>;
};
const ProfessionalProfile = ({ setActiveStep, setUserData }: ProfessionalProfileProps) => {
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
        const formattedEducation: UserEducation[] = data.education.filter(
            (edu: UserEducation) => edu.institute.trim() !== '' && edu.years >= 0
        );

        const formattedCareer: UserCareer[] = data.career.filter(
            (career: UserCareer) => career.company.trim() !== '' && career.years >= 0
        );

        const formattedSkills: UserSkill[] = data.skills.map((skill: UserSkill) => ({
            ...skill,
            skill_id: skill.id,
        }));

        try {
            setUserData((prev) => ({
                ...prev,
                education: formattedEducation,
                career: formattedCareer,
                skills: formattedSkills,
            }));
            setActiveStep((prev) => prev + 1);
        } catch {
            toast.error('Failed to update user profile');
        }
    };

    return (
        <Container>
            <FormProvider {...form}>
                <Box component="form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
                    <UserQualificationsForm />
                    <Button type="submit" style={{ display: 'none' }} />
                </Box>
            </FormProvider>

            <Box
                sx={{
                    position: 'fixed',
                    bottom: 50,
                    right: 50,
                    zIndex: 1000,
                }}
            >
                <IconButton aria-label="next step" onClick={form.handleSubmit(onSubmit)} size="large" color="primary">
                    <ArrowForwardIcon sx={{ fontSize: 40 }} />
                </IconButton>
            </Box>
        </Container>
    );
};

export default ProfessionalProfile;
