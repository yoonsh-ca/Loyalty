require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

const customerRoutes = require('./routes/customer');
const faqRoutes = require('./routes/faq');

app.use(cors());
app.use(express.json());

app.use('/api', customerRoutes);
app.use('/api/faq', faqRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
