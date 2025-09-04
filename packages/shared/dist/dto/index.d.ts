export type ProviderDTO = {
    id: number;
    key: string;
    title: string;
    schema: object;
    methods: string[];
};
export type ProjectDTO = {
    name: string;
    domains: string[];
    id: number;
};
export type ConnectorDTO = {
    name: string;
    id: number;
    schema: object;
    projectId: number;
    providerId: number;
    active: boolean;
    settings: object | null;
};
export type PaymentDTO = {
    id: string;
    method: string | null;
    projectId: number;
    providerId: number;
    status: 'CREATED' | 'PAID' | 'REFUND';
    amount: number;
    paymentId: string | null;
    paymentUrl: string | null;
    paymentQr: string | null;
    createdAt: Date;
    updatedAt: Date;
};
//# sourceMappingURL=index.d.ts.map