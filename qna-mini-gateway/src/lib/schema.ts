import z from "zod"

export const SchemaValidate = z.object({
    answer: z.string().trim().min(1),
    sources:z.array(z.string().url()).min(5)
});

