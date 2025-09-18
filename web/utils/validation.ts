import type { FormError } from '@nuxt/ui';
import type { z } from 'zod';

export const handleValidationError = (error: z.ZodError): FormError[] => {
  return error.issues.map((issue) => ({
    message: issue.message,
    path: issue.path.join('.'),
  }));
};

export const validateForm = <T>(
  schema: z.ZodSchema<T>,
  formData: unknown
): { success: boolean; data?: T; errors?: FormError[] } => {
  const result = schema.safeParse(formData);
  
  if (!result.success) {
    return {
      success: false,
      errors: handleValidationError(result.error),
    };
  }
  
  return {
    success: true,
    data: result.data,
  };
};

// Example usage in a component:
/*
const onSubmit = async () => {
  const { success, data, errors } = validateForm(userSchema, formData);
  
  if (!success) {
    // Handle validation errors
    formErrors.value = errors || [];
    return;
  }
  
  // Proceed with form submission using validated data
  try {
    await submitForm(data);
  } catch (error) {
    // Handle API errors
  }
};
*/
