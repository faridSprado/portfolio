import { z } from "zod"

export const nameSchema = z
  .string()
  .trim()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios")

export const emailSchema = z
  .string()
  .trim()
  .email("Email inválido")

export const consultaSchema = z
  .string()
  .trim()
  .min(10, "El mensaje debe tener al menos 10 caracteres")

export { consultaSchema as messageSchema }

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  consulta: consultaSchema,
})

export type ContactFormData = z.infer<typeof contactSchema>

interface ValidationSuccess {
  success: true
  value: string
}

interface ValidationError {
  success: false
  error: string
}

export type ValidationResult = ValidationSuccess | ValidationError

export function validateName(input: string): ValidationResult {
  const result = nameSchema.safeParse(input)
  if (result.success) {
    return { success: true, value: result.data }
  }
  return {
    success: false,
    error: result.error.issues[0]?.message ?? "El nombre es inválido.",
  }
}

export function validateEmail(input: string): ValidationResult {
  const result = emailSchema.safeParse(input)
  if (result.success) {
    return { success: true, value: result.data }
  }
  return {
    success: false,
    error: result.error.issues[0]?.message ?? "El email es inválido.",
  }
}

export function validateConsulta(input: string): ValidationResult {
  const result = consultaSchema.safeParse(input)
  if (result.success) {
    return { success: true, value: result.data }
  }
  return {
    success: false,
    error: result.error.issues[0]?.message ?? "El mensaje es inválido.",
  }
}
