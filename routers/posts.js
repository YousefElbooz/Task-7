const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const postsFile = path.join(__dirname, 'posts.json');

const readPosts = () => {
  const data = fs.readFileSync(postsFile, 'utf-8');
  return JSON.parse(data);
};

const writePosts = (posts) => {
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
};

app.get('', (req, res) => {
  const posts = readPosts();
  res.json(posts);
});


app.post('', (req, res) => {
  const posts = readPosts();
  const { id, title, body } = req.body;

  if (id && posts.some(post => post.id === id)) {
    return res.status(400).json({ error: `Post with ID ${id} already exists.` });
  }

  const newPost = {
    id: id || (posts.length ? posts[posts.length - 1].id + 1 : 1),
    title,
    body
  };

  posts.push(newPost);
  writePosts(posts);
  res.status(201).json(newPost);
});


app.put('/:id', (req, res) => {
  const posts = readPosts();
  const id = parseInt(req.params.id);
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).send("Post not found");

  posts[index] = { id, ...req.body };
  writePosts(posts);
  res.json(posts[index]);
});

app.delete('/:id', (req, res) => {
  const posts = readPosts();
  const updatedPosts = posts.filter(p => p.id !== parseInt(req.params.id));
  writePosts(updatedPosts);
  res.sendStatus(204);
});


app.get('/:id', (req, res) => {
  const posts = readPosts();
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).send("Post not found");
  res.json(post);
});

module.exports=app;