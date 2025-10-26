import type React from "react";
export interface SliderProps {
    name: string;
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    disabled?: boolean;
    onChange?: (value: number) => void;
    className?: string;
    helperText?: string;
    showValue?: boolean;
}
export declare const Slider: React.FC<SliderProps>;
//# sourceMappingURL=Slider.d.ts.map