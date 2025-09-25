import { useState, useCallback } from 'react';

export interface IUseBool {
    value: boolean;
    onToggle: () => void;
    onTrue: () => void;
    onFalse: () => void;
}

export const useBool = (defaultValue = false): IUseBool => {
    const [value, setValue] = useState<boolean>(defaultValue);

    const onToggle = useCallback(() => setValue((p) => !p), []);
    const onTrue = useCallback(() => setValue(true), []);
    const onFalse = useCallback(() => setValue(false), []);

    return {
        value,
        onToggle,
        onTrue,
        onFalse,
    };
};
