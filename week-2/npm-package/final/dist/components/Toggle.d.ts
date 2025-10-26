import type React from "react";
export interface ToggleProps {
    name: string;
    label?: string;
    checked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    className?: string;
    helperText?: string;
}
export declare const Toggle: React.FC<ToggleProps>;
//# sourceMappingURL=Toggle.d.ts.map