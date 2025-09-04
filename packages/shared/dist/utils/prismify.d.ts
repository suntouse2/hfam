export declare const prismify: {
    hasSome<T>(field: string, value?: T | T[]): {
        [x: string]: {
            hasSome: T[];
        };
    } | {
        [x: string]: {
            has: NonNullable<T>;
        };
    } | undefined;
    equals<T>(field: string, value?: T): {
        [x: string]: T & ({} | null);
    } | undefined;
    contains(field: string, value?: string): {
        [x: string]: {
            contains: string;
            mode: string;
        };
    } | undefined;
};
//# sourceMappingURL=prismify.d.ts.map