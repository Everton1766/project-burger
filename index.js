const express = require('express');
const uuid = require('uuid');
const cors = require('cors');


const port = 3001;
const app = express();
app.use(express.json());
app.use(cors())


const completeOrder = []

const logRequest = (request, response, next) => {
    console.log(`Method: ${request.method}, URL: ${request.url}`)
    
    next()
}

app.use(logRequest)

const checkId = (request, response, next) => {
    const { id } = request.params
    const index = completeOrder.findIndex(element => element.id === id)
    if (index < 0) {
        return response.status(404).json({ error: "Not Found" })
    }
    request.orderIndex = index
    request.orderId = id

    next()
}


app.get("/order", logRequest, (request, response) => {
    return response.json(completeOrder)
})

app.post("/order", logRequest, (request, response) => {
    const { order, clientName, price, status } = request.body
    const newClient = { id: uuid.v4(), order, clientName, price, status }
    completeOrder.push(newClient)
    return response.status(201).json(newClient)
})

app.put("/order/:id", checkId, logRequest, (request, response) => {
    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId
    const updateOrden = { id, order, clientName, price, status }
    completeOrder[index] = updateOrden

    return response.json(updateOrden)
})

app.delete("/order/:id", checkId, logRequest, (request, response) => {
    const index = request.orderIndex
    completeOrder.splice(index, 1)
    response.status(204).json()
})

app.get("/order/:id", checkId, logRequest, (request, response) => {
    const index = request.orderIndex
    const toCheck = completeOrder[index]
    return response.json(toCheck)
})

app.patch("/order/:id", checkId, logRequest, (request, response) => {
    const index = request.orderIndex

    completeOrder[index].status = "Pronto"
    return response.json(completeOrder[index])

})


app.listen(port, () => {
    console.log(`🌍 Server started on port ${port} 🌍`)
})