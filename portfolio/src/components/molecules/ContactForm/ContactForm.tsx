import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input } from "../../atoms"
import { cn } from "@/lib/utils"
import { contactSchema, type ContactFormData } from "@/lib/contactValidation"
import { sendContactEmail } from "@/lib/api/contact"

interface ContactFormProps {
  onSuccess?: () => void
  className?: string
}

export function ContactForm({ onSuccess, className }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    const result = await sendContactEmail(data)
    if (result.success) {
      reset()
      onSuccess?.()
      return
    }
    console.error("Error sending message:", result.error)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
      <div>
        <Input
          {...register("name")}
          placeholder="Tu nombre"
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register("email")}
          type="email"
          placeholder="Tu email"
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <textarea
          {...register("consulta")}
          placeholder="Tu mensaje"
          rows={4}
          className={cn(
            "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            errors.consulta ? "border-destructive" : ""
          )}
        />
        {errors.consulta && (
          <p className="text-sm text-destructive mt-1">{errors.consulta.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Enviando..." : "Enviar mensaje"}
      </Button>
    </form>
  )
}
