const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const base_url = "http://localhost:3000";
// const base_url = "http://node56765-wanichanon.proen.app.ruk-com.cloud";

app.set("views", path.join(__dirname, "/public/views"));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/public'));

// guitar -> shops
app.get("/", async (req, res) => {
    try {
        const response = await axios.get(base_url + "/shops");
        res.render("shops", { shops: response.data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error shops guitar')
    }
});

// signUp -> accounts
app.get("/signup", async (req, res) => res.render("signup"));
app.post("/signup2", async (req, res) => {
    try {
        if (req.body.password != req.body.conpass) {
            res.render("signup");
        } else {
            const data = {username: req.body.username, password: req.body.password}
            await axios.post(base_url + '/accounts', data)
            res.redirect("/");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error signUp')
    }
});

// login -> accounts
app.get("/login", async (req, res) => res.render("login"));
app.post("/login2", async (req, res) => {
    try {
        const response = await axios.get(base_url + "/accounts");
        const accounts = response.data;
        if (accounts && accounts.length > 0) {
            for (const account of accounts) {
                if (req.body.username === account.username) {
                    if (req.body.password === account.password) {
                        res.redirect("/");
                        return;
                    }
                }
            }
        }
        res.render("login");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error shops guitar')
    }
})

app.listen(5500, () => {console.log('Server stated on port 5500');});