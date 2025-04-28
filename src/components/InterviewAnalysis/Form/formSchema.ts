import { z } from 'zod';
import { ALLOWED_FILE_TYPES } from '../../../constants';

export const formSchema = (currentFileName?: string, currentFileType?: string) =>
    z
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

            if (currentFileName === file.name && currentFileType === fileType) {
                context.addIssue({
                    path: ['file'],
                    message: 'File is already uploaded',
                    code: z.ZodIssueCode.custom,
                });
            }
        });
export type FormSchema = z.infer<ReturnType<typeof formSchema>>;
