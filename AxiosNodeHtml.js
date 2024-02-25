const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const base_url = "http://localhost:3000";
// const base_url = "http://node56765-wanichanon.proen.app.ruk-com.cloud";

app.use(cookieParser());
app.set("views", path.join(__dirname, "/public/views"));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/public'));

// list guitar -> shops
app.get("/", async (req, res) => {
    try {
        const response = await axios.get(base_url + "/shops");
        res.render("shops", { shops: response.data, level: req.cookies.level, username: req.cookies.username });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error list guitar')
    }
});

// details guitar -> shops
app.get("/guitar_detail/:id", async (req, res) => {
    try {
        const response = await axios.get(base_url + "/shops/" + req.params.id);
        res.render("guitar_detail", { shop: response.data, level: req.cookies.level, username: req.cookies.username});
    } catch (err) {
        console.error(err);
        res.status(500).send('Error detail guitar')
    }
});

// chords -> chords
app.get("/chords", async (req,res) => {
    try {
        const response = await axios.get(base_url + "/chords");
        res.render("chords", { chords: response.data, level: req.cookies.level, username: req.cookies.username });
    } catch {
        console.error(err);
        res.status(500).send('Error chord')
    }
})

// management -> !!!!!!!!!!!
// app.get("/management", async (req,res) => {
//     try {

//     } catch {
//         console.error(err);
//         res.status(500).send('Error management')
//     }
// })

// signUp -> accounts
app.get("/signup", async (req, res) => {
    try {
        res.render("signup" , { Fail: "" })
    } catch {
        console.error(err);
        res.status(500).send('Error signup')
    }
});

app.post("/signup2", async (req, res) => {
    try {
        const response = await axios.get(base_url + "/accounts");
        const accounts = response.data;

        if (req.body.password != req.body.conpass) {
            return res.render("signup", { Fail: "รหัสผ่านไม่ตรงกัน"});
        }

        const checkaccount = accounts.find(account => account.username === req.body.username);
        if (checkaccount) {
            return res.render("signup", { Fail: "Username ซ้ำ"});
        } 

        const data = {username: req.body.username, password: req.body.password}
        await axios.post(base_url + '/accounts', data)
        res.redirect("/");

    } catch (err) {
        console.error(err);
        res.status(500).send('Error signUp')
    }
});

// login -> accounts
app.get("/login", async (req, res) => {
    try {
        res.render("login", { Fail: ""})
    } catch {
        console.error(err);
        res.status(500).send('Error signup')
    }
});

app.post("/login2", async (req, res) => {
    try {
        const response = await axios.get(base_url + "/accounts");
        const accounts = response.data;
        let loginFailed = true; 

        if (accounts && accounts.length > 0) {
            for (const account of accounts) {
                if (req.body.username === account.username && req.body.password === account.password) {
                    loginFailed = false; 
                    if (account.level == 'admin') res.cookie('level', 'admin', { maxAge: 900000, httpOnly: true });
                    else if (account.level == 'user') res.cookie('level', 'user', { maxAge: 900000, httpOnly: true });
                    res.cookie('username', account.username, { maxAge: 900000, httpOnly: true });
                    return res.redirect("/");
                }
            }
        } else {
            return res.redirect("signup");
        }

        if (loginFailed) {
            return res.render("login", { Fail: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"});
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error Login')
    }
})

// logout
app.get("/logout", async (req, res) => {
    try {
        res.clearCookie('level');
        res.clearCookie('username');
        return res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error Logout')
    }
})

app.listen(5500, () => {console.log('Server stated on http://localhost:5500');});