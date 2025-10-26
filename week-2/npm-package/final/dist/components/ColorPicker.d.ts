import type React from "react";
export interface ColorPickerProps {
    name: string;
    label?: string;
    value?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    onChange?: (color: string) => void;
    onBlur?: () => void;
    className?: string;
    helperText?: string;
}
export declare const ColorPicker: React.FC<ColorPickerProps>;
//# sourceMappingURL=ColorPicker.d.ts.map