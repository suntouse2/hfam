export const prismify = {
    hasSome(field, value) {
        if (!value)
            return undefined;
        if (Array.isArray(value)) {
            return value.length > 0 ? { [field]: { hasSome: value } } : undefined;
        }
        return { [field]: { has: value } };
    },
    equals(field, value) {
        return value !== undefined ? { [field]: value } : undefined;
    },
    contains(field, value) {
        return value ? { [field]: { contains: value, mode: 'insensitive' } } : undefined;
    },
};
