import { z } from 'zod';

const ALLOWED_FILE_TYPES = ['audio/mpeg', 'audio/wav'];

export const formSchema = (currentFileName?: string) =>
    z
        .object({
            file: z.instanceof(File, { message: 'File is required' }),
        })
        .superRefine(({ file }, context) => {
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                context.addIssue({
                    path: ['file'],
                    message: `Only audio files are allowed`,
                    code: z.ZodIssueCode.custom,
                });
            }

            if (currentFileName === file.name) {
                context.addIssue({
                    path: ['file'],
                    message: 'File is already uploaded',
                    code: z.ZodIssueCode.custom,
                });
            }
        });
export type FormSchema = z.infer<ReturnType<typeof formSchema>>;
