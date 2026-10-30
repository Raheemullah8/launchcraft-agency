import { z } from "zod";

export const jobApplicationSchema = z.object({
  candidateName: z
    .string()
    .min(2, { message: "Candidate name must be at least 2 characters." })
    .max(100, { message: "Name must not exceed 100 characters." }),
  candidateEmail: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),
  candidatePhone: z.string().max(30).optional().or(z.literal("")),
  portfolioUrl: z
    .string()
    .url({ message: "Please provide a valid URL (e.g. https://github.com/yourname)." })
    .optional()
    .or(z.literal("")),
  coverNote: z
    .string()
    .min(10, { message: "Please provide at least 10 characters introducing yourself." })
    .max(2000, { message: "Cover note cannot exceed 2000 characters." }),
  consentAccepted: z.literal(true, {
    message: "You must accept the privacy notice to submit your application.",
  }),
});

export type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;
