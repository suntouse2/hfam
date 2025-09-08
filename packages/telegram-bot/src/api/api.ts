import got from 'got'

export const api = got.extend({
	prefixUrl: 'http://localhost:4000',
	responseType: 'json',
	timeout: { request: 10000 },
	retry: { limit: 2 },
	hooks: {
		beforeRequest: [
			options => {
				options.headers.Authorization = `Bearer ${process.env.API_KEY}`
			},
		],
	},
})
