import { useState, useCallback } from 'react';

interface UseFormStateReturn<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  setValues: (values: T) => void;
  setErrors: (errors: Record<keyof T, string>) => void;
  setTouched: (touched: Record<keyof T, boolean>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  resetForm: () => void;
}

export const useFormState = <T extends Record<string, unknown>>(
  initialValues: T
): UseFormStateReturn<T> => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({} as Record<keyof T, string>);
    setTouched({} as Record<keyof T, boolean>);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValues,
    setErrors,
    setTouched,
    handleChange,
    handleBlur,
    resetForm,
  };
};

