const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04d0f51b613ad5201c238849bc6cc3afe2adc3287b6d981faf4316e62d464bc0a6d82afe7d0f9beb45879ea0d4082d51f4f2931682bc9a7de69219ec24afd9dff0": 100,
  "0442c7ca29a7de8f7e03fd27e84708789dd7c3d8f9633489b082ba7b9c40d44a23e70ecfc86542379e90c5d956c7dfa76107d12ad9930e5495ab1c5ba25c8ad21e": 50,
  "047284c311e37d5c00fe3aa807ec4acb004971173428456a320e6c016b7d63ddfa7e61834465a39e8c4bedb1840a9dec872f614613e16c40010dc198b2ee310ef4": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // get a signature from the client side appplication
  // recover the public address from the signature
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
