export const prismify = {
	hasSome<T>(field: string, value?: T | T[]) {
		if (!value) return undefined
		if (Array.isArray(value)) {
			return value.length > 0 ? { [field]: { hasSome: value } } : undefined
		}
		return { [field]: { has: value } }
	},

	equals<T>(field: string, value?: T) {
		return value !== undefined ? { [field]: value } : undefined
	},

	contains(field: string, value?: string) {
		return value ? { [field]: { contains: value, mode: 'insensitive' } } : undefined
	},
}
