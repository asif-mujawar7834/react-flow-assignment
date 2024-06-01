import { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  buttonText?: string;
  backgroundColor?: string;
  tooltipText?: string;
}

interface NodeContentProps {
  data: { id: string; data: { label: string }; inFlow?: boolean };
}
