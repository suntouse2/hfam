import { ErrorAPI } from "@hfam/shared/helpers/error";
import z from "zod";
import { EsellProvider } from "./EsellProvider.js";
import { MulenProvider } from "./MulenProvider.js";
export const data = [
    {
        active: true,
        key: 'esell',
        title: 'Esell',
        methods: [
            'card'
        ],
        schema: {
            esell_token: {
                label: 'Esell TOKEN'
            }
        }
    },
    {
        active: true,
        key: 'mulen',
        title: 'MulenPay',
        methods: [
            'sbp'
        ],
        schema: {
            shop_id: {
                label: 'ID Магазина'
            },
            secret_key: {
                label: 'Секретный ключ'
            },
            api_key: {
                label: 'API Ключ'
            }
        }
    }
];
const instanceMap = {
    esell: EsellProvider,
    mulen: MulenProvider
};
export const providers = {
    getProviders (filters) {
        return data.filter((p)=>{
            if (filters.active !== undefined && p.active !== filters.active) return false;
            if (filters.method) {
                const methods = Array.isArray(filters.method) ? filters.method : [
                    filters.method
                ];
                if (!methods.some((m)=>p.methods.includes(m))) return false;
            }
            return true;
        });
    },
    getProvider (key) {
        const provider = data.find((p)=>p.key === key);
        if (!provider) throw ErrorAPI.badRequest(`No provider with key: ${key}`);
        return provider;
    },
    useInstance (key) {
        const ProviderInstance = instanceMap[key];
        if (!ProviderInstance) throw ErrorAPI.badRequest(`Provider instance by key: ${key} not found`);
        return new ProviderInstance();
    },
    useSchema (key) {
        const provider = data.find((p)=>p.key === key);
        if (!provider) throw new Error(`Schema for ${key} not found`);
        const shape = Object.fromEntries(Object.keys(provider.schema).map((k)=>[
                k,
                z.string()
            ]));
        const schema = z.object(shape);
        return schema;
    }
};
