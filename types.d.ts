import { ButtonHTMLAttributes, ReactNode, DragEvent } from "react";
import { Node } from "reactflow";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  buttonText?: string;
  backgroundColor?: string;
  tooltipText?: string;
  disabled?: boolean;
}

interface NodeContentProps {
  data: { id: string; data: { label: string }; inFlow?: boolean };
}

type OnDragOverHandler = (event: DragEvent) => void;

type OnDragStartHandler = (
  event: DragEvent<HTMLDivElement>,
  node: Node
) => void;
