const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const usersFile = path.join(__dirname, 'users.json');

const readusers = () => {
  const data = fs.readFileSync(usersFile, 'utf-8');
  return JSON.parse(data);
};

const writeusers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};


app.get('', (req, res) => {
  const users = readusers();
  res.json(users);
});


app.post('', (req, res) => {
  const users = readusers();
  const { id, name } = req.body;

  if (id && users.some(user => user.id === id)) {
    return res.status(400).json({ error: `user with ID ${id} already exists.` });
  }

  const newuser = {
    id: id || (users.length ? users[users.length - 1].id + 1 : 1),
    name,
  };

  users.push(newuser);
  writeusers(users);
  res.status(201).json(newuser);
});


app.put('/:id', (req, res) => {
  const users = readusers();
  const id = parseInt(req.params.id);
  const index = users.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).send("user not found");

  users[index] = { id, ...req.body };
  writeusers(users);
  res.json(users[index]);
});

app.delete('/:id', (req, res) => {
  const users = readusers();
  const updatedusers = users.filter(p => p.id !== parseInt(req.params.id));
  writeusers(updatedusers);
  res.sendStatus(204);
});


app.get('/:id', (req, res) => {
  const users = readusers();
  const user = users.find(p => p.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("user not found");
  res.json(user);
});

module.exports=app;