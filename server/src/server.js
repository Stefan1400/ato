const PORT = process.env.PORT || 5000;

const app = require('./app.js');

app.listen(PORT, '0.0.0.0', () => {
   console.log(`Server is listening on port ${PORT}`);
});
