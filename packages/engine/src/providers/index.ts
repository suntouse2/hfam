import type { ProviderDTO } from '@hfam/shared/dto/index'
import { ErrorAPI } from '@hfam/shared/helpers/error'
import type { providersFindSchema } from '@hfam/shared/validation/provider'
import z from 'zod'
import type { BaseProvider } from './BaseProvider'
import { EsellProvider } from './EsellProvider'
import { MulenProvider } from './MulenProvider'
import { P2PProvider } from './P2PProvider'
import { SBPNumberProvider } from './SBPNumberProvider'
import { TRCProvider } from './TRCProvider'
import { TGProvider } from './TgProvider'

export const data: ProviderDTO[] = [
	{
		active: true,
		key: 'esell',
		title: 'Esell',
		methods: ['card'],
		schema: {
			esell_token: { label: 'Esell TOKEN' },
		},
	},
	{
		active: true,
		key: 'mulen',
		title: 'MulenPay',
		methods: ['sbp'],
		schema: {
			shop_id: { label: 'ID Магазина' },
			secret_key: { label: 'Секретный ключ' },
			api_key: { label: 'API Ключ' },
		},
	},
	{
		active: true,
		key: 'p2p',
		title: 'Перевод на карту',
		methods: ['p2p'],
		schema: { json_url: { label: 'JSON-URL' } },
	},
	{
		active: true,
		key: 'sbp_number',
		title: 'SBP Номер',
		methods: ['sbp_number'],
		schema: { json_url: { label: 'JSON-URL' } },
	},
	{
		active: true,
		key: 'trc',
		title: 'Tether USDT',
		methods: ['trc'],
		schema: { trc_wallet: { label: 'Кошелек TRC-20' } },
	},
	{
		active: true,
		key: 'tg',
		title: 'Telegram',
		methods: ['tg'],
		schema: { tg_id: { label: 'TG ID' } },
	},
] as const

const instanceMap: Record<string, new () => BaseProvider> = {
	esell: EsellProvider,
	mulen: MulenProvider,
	p2p: P2PProvider,
	sbp_number: SBPNumberProvider,
	trc: TRCProvider,
	tg: TGProvider,
}

type ProviderFindPayload = z.infer<typeof providersFindSchema>

export const providers = {
	getProviders(filters: ProviderFindPayload) {
		return data.filter(p => {
			if (filters.active !== undefined && p.active !== filters.active) return false
			if (filters.method) {
				const methods = Array.isArray(filters.method) ? filters.method : [filters.method]
				if (!methods.some(m => p.methods.includes(m))) return false
			}
			return true
		})
	},
	getProvider(key: ProviderDTO['key']) {
		const provider = data.find(p => p.key === key)
		if (!provider) throw ErrorAPI.badRequest(`No provider with key: ${key}`)
		return provider
	},
	useInstance(key: ProviderDTO['key']): BaseProvider {
		const ProviderInstance = instanceMap[key]
		if (!ProviderInstance)
			throw ErrorAPI.badRequest(`Provider instance by key: ${key} not found`)
		return new ProviderInstance()
	},
	useSchema<K extends ProviderDTO['key']>(key: K) {
		const provider = data.find(p => p.key === key)
		if (!provider) throw new Error(`Schema for ${key} not found`)

		const shape = Object.fromEntries(
			Object.keys(provider.schema).map(k => [k, z.string()])
		) as {
			[P in keyof typeof provider.schema]: z.ZodString
		}

		const schema = z.object(shape)

		return schema
	},
}
