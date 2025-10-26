import type React from "react";
import { defaultTheme } from "../styles/theme";
export interface StepperProps {
    name: string;
    label?: string;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    onChange?: (value: number) => void;
    theme?: typeof defaultTheme;
    className?: string;
    helperText?: string;
}
export declare const Stepper: React.FC<StepperProps>;
//# sourceMappingURL=Stepper.d.ts.map