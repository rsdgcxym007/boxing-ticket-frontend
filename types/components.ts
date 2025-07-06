// types/components.ts
export interface BaseButtonProps {
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

export interface BaseInputProps {
  modelValue?: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  size?: "sm" | "md" | "lg";
}

export interface BaseModalProps {
  isOpen: boolean;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  persistent?: boolean;
}

export interface BaseCardProps {
  title?: string;
  variant?: "default" | "bordered" | "shadow" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
}

export interface BaseAlertProps {
  show?: boolean;
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  message?: string;
  dismissible?: boolean;
}

export interface BaseSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  text?: string;
}
