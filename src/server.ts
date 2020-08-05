import express from 'express';

const app = express();

app.use(express.json());

const users = [
    { name: "Joe", age: 79 },
    { name: "Joe 2", age: 32}
]

app.get('/users', (request, response) => {
    console.log("Rota /users acessada - GET");
    console.log(request.query)

    return response.json(users);
});

app.post('/users', (request, response) => {
    console.log("Rota /users acessada - POST");
    console.log(request.body);
    
    return response.json(users);
});

app.delete('/users/:id', (request, response) => {
    console.log("Rota /users acessada - DELETE");
    console.log(request.params);

    return response.json(users);
});



app.listen(3333, '0.0.0.0');