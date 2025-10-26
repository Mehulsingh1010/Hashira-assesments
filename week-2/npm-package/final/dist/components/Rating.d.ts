import type React from "react";
export interface RatingProps {
    name: string;
    label?: string;
    maxStars?: number;
    value?: number;
    disabled?: boolean;
    onChange?: (rating: number) => void;
    className?: string;
    helperText?: string;
}
export declare const Rating: React.FC<RatingProps>;
//# sourceMappingURL=Rating.d.ts.map