const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;
app.use(express.static('./dist'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'));

    res.status(200);
});

app.listen(PORT, () => `Server launched at port ${PORT}`);