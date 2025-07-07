export const trimFields = <T extends object = object>(data: T): T => {
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
            const trimmedValue = typeof value === 'string' ? value.trim() : value;
            return [key, trimmedValue];
        })
    ) as T;
};
