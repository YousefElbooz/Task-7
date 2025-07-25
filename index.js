const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const usersRouter = require('./routers/users');
const postsouter = require('./routers/posts');

app.use(express.json());

app.use('/posts/',postsouter);
app.use('/users/',usersRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
