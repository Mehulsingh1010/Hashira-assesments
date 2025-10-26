import type React from "react";
export interface TagsInputProps {
    name: string;
    label?: string;
    placeholder?: string;
    value?: string[];
    required?: boolean;
    disabled?: boolean;
    error?: string;
    onChange?: (tags: string[]) => void;
    onBlur?: () => void;
    className?: string;
    helperText?: string;
    maxTags?: number;
}
export declare const TagsInput: React.FC<TagsInputProps>;
//# sourceMappingURL=TagsInput.d.ts.map