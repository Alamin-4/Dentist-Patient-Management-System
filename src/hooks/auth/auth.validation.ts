import z from "zod";

export const registerDentistSchema = z.object({

    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    referralCode: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export const registerPatientSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export type IRegisterDentist = z.infer<typeof registerDentistSchema>;
export type IRegisterPatient = z.infer<typeof registerPatientSchema>;