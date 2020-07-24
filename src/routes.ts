import { Router } from 'express'

import ChatController from './controllers/ChatController'
import UserController from './controllers/UserController'

const routes = Router()

// User routes
routes.get('/users', UserController.index)
routes.post('/users', UserController.store)

// Chat routes
routes.get('/chat', ChatController.index)

export default routes
