import { createConsumer } from "@rails/actioncable"

// единое WebSocket-соединение с rails
const consumer = createConsumer()

export default consumer