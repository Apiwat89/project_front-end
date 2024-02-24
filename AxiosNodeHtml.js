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

// app.get("/chords", async (req, res) => {
//     res.render("chords");
// });

// login
app.get("/login", async (req, res) => {
    res.render("login");
});

// ยังบ่เสร็จ
app.get("/login2", async (req, res) => {
    try {
        const response = await axios.get(base_url + "/accounts");
        if (req.body.username == response.data.username)
        
        res.render("shops", { shops: response.data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error shops guitar')
    }
})

// signUp 
app.get("/signup", async (req, res) => {
    res.render("signup");
});

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

// shops guitar
app.get("/", async (req, res) => {
    try {
        const response = await axios.get(base_url + "/shops");
        res.render("shops", { shops: response.data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error shops guitar')
    }
});



// app.get("/book/:id", async (req, res) => {
//     try {
//         const response = await axios.get(base_url + '/books/' + req.params.id);
//         res.render("book", {book: response.data});
//     } catch(err) {
//         console.error(err);
//         res.status(500).send('Error');
//     }
// });

// app.get("/create", (req, res) => {
//     res.render("create");
// });

// app.post("/create", async (req, res) => {
//     try {
//         const data = {title: req.body.title, author: req.body.author};
//         await axios.post(base_url + '/books', data);
//         res.redirect("/");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error');
//     }
// });

// app.get("/update/:id", async (req, res) => {
//     try {
//         const response = await axios.get(
//         base_url + '/books/' + req.params.id);
//         res.render("update", {book: response.data});  
//     } catch(err) {
//         console.error(err);
//         res.status(500).send('Error');
//     }
// });

// app.post("/update/:id", async (req, res) => {
//     try {
//         const data = {title: req.body.title, author: req.body.author};
//         await axios.put(base_url + '/books/' + req.params.id, data);
//         res.redirect("/");
//     } catch(err) {
//         console.error(err);
//         res.status(500).send('Error');
//     }
// });

// app.get("/delete/:id", async (req, res) => {
//     try {
//         await axios.delete(base_url + '/books/' + req.params.id);
//         res.redirect("/");
//     } catch(err) {
//         console.error(err);
//         res.status(500).send('Error');
//     }
// });

app.listen(5500, () => {
    console.log('Server stated on port 5500');
});