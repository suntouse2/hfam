export type ProviderDTO = {
	active: boolean
	key: string
	title: string
	schema: Record<string, { label: string }>
	methods: string[]
}
export type ProjectDTO = {
	name: string
	id: number
	methods: MethodDTO[]
}
export type DomainDTO = {
	id: number
	value: string
	project: Omit<ProjectDTO, 'methods'>
}

export type ConnectorDTO = {
	name: string
	id: number
	schema: Record<string, { label: string; value?: string }>
	project: Omit<ProjectDTO, 'methods'>
	projectId: ProjectDTO['id']
	byProvider: string
	active: boolean
	settings: object | null
	bIndex: number
	methods: MethodDTO[]
}

export type PaymentDTO = {
	id: string
	orderId: string
	method: string | null
	projectId: number
	connector: ConnectorDTO
	status: 'CREATED' | 'PAID' | 'REFUND'
	amount: number
	payload: Record<string, string> | null
	paymentId: string | null
	paymentUrl: string | null
	paymentQr: string | null
	createdAt: Date
	updatedAt: Date
	description: string
	hookWait: boolean
}

export type MethodDTO = {
	id: number
	label: string
	imageSrc: string
	active: boolean
	method?: string
	byProvider?: string
	connector?: ConnectorDTO
	connectorId?: ConnectorDTO['id']
	project: Omit<ProjectDTO, 'methods'>
	projectId: ProjectDTO['id']
	minAmount?: number
	maxAmount?: number
}
