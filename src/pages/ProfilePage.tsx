import { zodResolver } from '@hookform/resolvers/zod';
import { ArticleOutlined } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Container, Typography } from '@mui/material';
import { HttpStatusCode } from 'axios';
import { FC, useMemo, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { FieldLabel } from '../components/InterviewAnalysis/Form/InterviewAnalysisForm';
import ResumeUploadButton from '../components/Profile/ResumeUploadButton';
import UserQualificationsForm from '../components/Profile/UserQualificationsForm';
import { useUserContext } from '../context/UserContext';
import userService from '../services/userService';
import { UserCareer, UserEducation, UserSkill } from '../types';

const yearSchema = z.coerce
    .number({
        required_error: 'Years of experience is required',
        invalid_type_error: 'Must be a number',
    })
    .min(0, { message: 'Years of experience cannot be negative' })
    .max(50, { message: 'Years of experience seems too high' });

const educationEntrySchema = z.object({
    institute: z.string(),
    years: yearSchema,
    is_deleted: z.boolean().optional(),
});

const careerEntrySchema = z.object({
    company: z.string(),
    years: yearSchema,
    is_deleted: z.boolean().optional(),
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

export const ProfilePage: FC = () => {
    const { userContext, setUserContext } = useUserContext();

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            education: userContext?.education?.length ? userContext.education : [{ institute: '', years: 0 }],
            career: userContext?.career?.length ? userContext.career : [{ company: '', years: 0 }],
            skills: userContext?.skills ?? [],
        },
    });

    const isSameEducation = (a: UserEducation, b: UserEducation) => a.institute === b.institute && a.years === b.years;
    const isSameCareer = (a: UserCareer, b: UserCareer) => a.company === b.company && a.years === b.years;
    const isSameSkill = (a: UserSkill, b: UserSkill) => a.id === b.id && a.name === b.name;

    const [hasResumeChanged, setHasResumeChanged] = useState(false);
    const [shouldUploadNow, setShouldUploadNow] = useState(false);

    const watchedValues = useWatch({ control: form.control }) as FormSchema;

    const hasChanges = useMemo(() => {
        if (!userContext) return false;

        const addedOrEditedEducation = watchedValues.education.filter(
            (edu) =>
                edu.institute.trim() !== '' &&
                edu.years >= 0 &&
                !userContext.education?.some((e) => isSameEducation(e, edu))
        );

        const removedEducation = (userContext.education ?? []).filter(
            (e) => !watchedValues.education.some((edu) => isSameEducation(e, edu))
        );

        const addedOrEditedCareer = watchedValues.career.filter(
            (career) =>
                career.company.trim() !== '' &&
                career.years >= 0 &&
                !userContext.career?.some((c) => isSameCareer(c, career))
        );

        const removedCareer = (userContext.career ?? []).filter(
            (c) => !watchedValues.career.some((career) => isSameCareer(c, career))
        );

        const addedOrEditedSkills = watchedValues.skills.filter(
            (skill) => !userContext.skills?.some((s) => isSameSkill(s, skill))
        );

        const removedSkills = (userContext.skills ?? []).filter(
            (s) => !watchedValues.skills.some((skill) => isSameSkill(s, skill))
        );

        return (
            addedOrEditedEducation.length > 0 ||
            removedEducation.length > 0 ||
            addedOrEditedCareer.length > 0 ||
            removedCareer.length > 0 ||
            addedOrEditedSkills.length > 0 ||
            removedSkills.length > 0 ||
            hasResumeChanged
        );
    }, [watchedValues, userContext, hasResumeChanged]);

    const onSubmit = async (data: FormSchema) => {
        if (!userContext?.id) return;

        if (!hasChanges) {
            toast.info('No changes to save');
            return;
        }

        const newOrUpdatedEducation = data.education.filter(
            (edu) =>
                edu.institute.trim() !== '' &&
                edu.years >= 0 &&
                !userContext.education?.some((e) => isSameEducation(e, edu))
        );

        const removedEducation = (userContext.education ?? []).filter(
            (e) => !data.education.some((edu) => isSameEducation(e, edu))
        );

        const newOrUpdatedCareer = data.career.filter(
            (career) =>
                career.company.trim() !== '' &&
                career.years >= 0 &&
                !userContext.career?.some((c) => isSameCareer(c, career))
        );

        const removedCareer = (userContext.career ?? []).filter(
            (c) => !data.career.some((career) => isSameCareer(c, career))
        );

        const newOrUpdatedSkills = data.skills
            .map((skill) => ({ ...skill, skill_id: skill.id }))
            .filter((skill) => !userContext.skills?.some((s) => isSameSkill(s, skill)));

        const removedSkills = (userContext.skills ?? []).filter(
            (s) => !data.skills.some((skill) => isSameSkill(s, skill))
        );

        try {
            const { response } = await userService.updateUser(userContext.id, {
                education:
                    newOrUpdatedEducation.length > 0 || removedEducation.length > 0
                        ? [...newOrUpdatedEducation, ...removedEducation.map((e) => ({ ...e, is_deleted: true }))]
                        : undefined,
                career:
                    newOrUpdatedCareer.length > 0 || removedCareer.length > 0
                        ? [...newOrUpdatedCareer, ...removedCareer.map((c) => ({ ...c, is_deleted: true }))]
                        : undefined,
                skills:
                    newOrUpdatedSkills.length > 0 || removedSkills.length > 0
                        ? [
                              ...newOrUpdatedSkills,
                              ...removedSkills.map((s) => ({
                                  ...s,
                                  skill_id: s.id,
                                  is_deleted: true,
                              })),
                          ]
                        : undefined,
            });

            if (response.status === HttpStatusCode.Ok) {
                toast.success('Profile updated successfully');

                setUserContext({
                    ...userContext,
                    education: (userContext.education ?? [])
                        .filter((edu) => !removedEducation.some((r) => isSameEducation(r, edu)))
                        .concat(newOrUpdatedEducation),
                    career: (userContext.career ?? [])
                        .filter((car) => !removedCareer.some((r) => isSameCareer(r, car)))
                        .concat(newOrUpdatedCareer),
                    skills: (userContext.skills ?? [])
                        .filter((sk) => !removedSkills.some((r) => isSameSkill(r, sk)))
                        .concat(newOrUpdatedSkills),
                });

                setShouldUploadNow(true);
                form.reset(data);
            } else {
                toast.error('Failed to update profile');
            }
        } catch {
            toast.error('An unexpected error occurred');
        }
    };

    return (
        <Container
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: { lg: 6, xl: 15 },
                flexDirection: 'column',
                gap: { lg: 4, xl: 15 },
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                color="secondary"
                sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', lg: '2rem', xl: '3rem' } }}
            >
                Professional Profile
            </Typography>

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
            <Box>
                <FieldLabel icon={<ArticleOutlined />} label="Resume" />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexGrow: 1 }}>
                    <ResumeUploadButton
                        shouldUploadNow={shouldUploadNow}
                        setHasResumeChanged={setHasResumeChanged}
                        onUploadSuccess={() => {
                            setShouldUploadNow(false);
                        }}
                    />
                </Box>
            </Box>
            <Button
                sx={{ flex: 1, mt: 3 }}
                disabled={!hasChanges}
                onClick={form.handleSubmit(onSubmit)}
                startIcon={<SaveIcon />}
                color="primary"
                variant="contained"
            >
                Save
            </Button>
        </Container>
    );
};
