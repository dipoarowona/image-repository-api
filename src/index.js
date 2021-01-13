const App = require("./app");

const port = process.env.PORT;

App.listen(port, () => {
  console.log(`Listening on ${port}...`);
});
