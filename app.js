const express = require('express');
const app = express();
const moment = require("moment");
const port = 3013;
const bodyParser = require("body-parser");
const formData = require("express-form-data")



app.use(formData.parse());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.json({extended : true}));

require('./rotas/fornecedores')(app);
require('./rotas/clientes')(app);


app.get('/', function (req, res) {
  res.send('Backend Rafael Adolfo rodando...');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
