const express = require("express");
const app = express();

const PORT = 5000;
app.use(express.json());

app.listen(PORT, () => {
  console.log("app running on port : ", PORT);
});

require("./routes/vendor")(app);
require("./routes/customer")(app);
require("./routes/product")(app);
require("./routes/purchase")(app);
require("./routes/account")(app);
require("./routes/sales")(app);
