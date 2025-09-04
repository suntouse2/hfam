import express from 'express'
import 'dotenv/config'

import { error } from '@/middlewares/error'
import { auth } from './middlewares/auth'

import { projects } from './routes/projects'
import { providers } from './routes/providers'
import { connectors } from './routes/connectors'

export const server = express()

server.use(express.json())

server.use('/projects', auth, projects)
server.use('/providers', auth, providers)
server.use('/connectors', auth, connectors)

server.get('/ping', (_req, res) => {
	res.send('pong')
})

server.use(error)
