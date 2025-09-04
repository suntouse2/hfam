import { server } from './server'

const PORT = process.env.PORT!

server.listen(PORT, () => {
	console.log(`🧃 hfam-engine running at http://localhost:${PORT}`)
})
