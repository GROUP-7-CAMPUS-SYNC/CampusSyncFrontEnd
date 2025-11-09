export interface ButtonProps {
    type: 'submit' | 'reset' | 'button';
    buttonContainerDesign? : string;
    buttonText: string;
    onClick?: () => void
}