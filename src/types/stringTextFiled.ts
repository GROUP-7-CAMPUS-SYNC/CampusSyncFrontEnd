import type { ChangeEvent, ReactNode, RefObject } from "react";

export interface TextFieldProps {
    inputContainerDesign?:string;
    inputDesign?: string;
    label? : string;
    labelDesing?: string;
    value: string;
    placeholder? : string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    errorMessage? : string;
    errorMessageDesign? : string;
    type?: string;
    name?:string;
    disabled?: boolean;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    autoFocus?:boolean;
    autoComplete?: "on" | "off";
    iconLeft?: ReactNode;
    iconLeftDesign?: string;
    iconRight?: ReactNode;
    iconRightDesign?: string;
    inputRef?: RefObject<HTMLInputElement>;
    showError?: boolean
}