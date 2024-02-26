const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer  = require('multer');

const base_url = "http://localhost:3000";
// const base_url = "http://node56765-wanichanon.proen.app.ruk-com.cloud";

app.set("views", path.join(__dirname, "/public/views"));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/public'));

app.use(cookieParser());

// auto img 
const putguitar = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, './public/pictures/Guitar'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const putchord = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, './public/pictures/Chord'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const guitar = multer({ storage: putguitar });
const chord = multer({ storage: putchord });

// [PAGE] list guitar -> shops
app.get("/", async (req, res) => {
    try {
        const response = await axios.get(base_url + "/shops");
        res.render("shops", { shops: response.data, level: req.cookies.level, username: req.cookies.username });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error list guitar')
    }
});

// [PAGE] details guitar -> shops
app.get("/guitar_detail/:id", async (req, res) => {
    try {
        const response = await axios.get(base_url + "/shops/" + req.params.id);
        res.render("guitar_detail", { shop: response.data, level: req.cookies.level, username: req.cookies.username});
    } catch (err) {
        console.error(err);
        res.status(500).send('Error detail guitar')
    }
});

// [PAGE] chords -> chords
app.get("/chords", async (req,res) => {
    try {
        const response = await axios.get(base_url + "/chords");
        res.render("chords", { chords: response.data, level: req.cookies.level, username: req.cookies.username });
    } catch {
        console.error(err);
        res.status(500).send('Error chord')
    }
})

// [PAGE] management -> shops
app.get("/management", async (req,res) => {
    try {
        if (req.cookies.level == 'user') {
            res.redirect("/");
        } else if (req.cookies.level == 'admin') {
            const response = await axios.get(base_url + "/shops");
            res.render("management", { shops: response.data, level: req.cookies.level, username: req.cookies.username, Fail: "" });
        } else {
            res.redirect("/");
        }
    } catch {
        console.error(err);
        res.status(500).send('Error management')
    }
})

// [PAGE] MMguitarCreate -> shops
app.get('/MMguitarCreate', async (req, res) => {
    try {
        if (req.cookies.level == 'user') {
            res.redirect("/");
        } else if (req.cookies.level == 'admin') {
            res.render("MMguitarCreate", { level: req.cookies.level, username: req.cookies.username});
        } else {
            res.redirect("/");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error putIMG');
    }
});

// MMguitarCreate2 -> shops
app.post('/MMguitarCreate2', guitar.single('guitarURL'), async (req, res) => {
    try {
        if (req.cookies.level == 'user') {
            res.redirect("/");
        } else if (req.cookies.level == 'admin') {
            const data = {
                guitarURL: req.file.filename,
                guitarname: req.body.guitarname,
                price: req.body.price,
                detail: req.body.detail
            };
    
            await axios.post(base_url + '/shops' , data);
            return res.redirect("/management");
        } else {
            res.redirect("/");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error MMguitarCreate2');
    }
});

// [PAGE] MMguitarView -> shops
app.get("/MMguitarView/:id", async (req,res) => {
    try {
        if (req.cookies.level == 'user') {
            res.redirect("/");
        } else if (req.cookies.level == 'admin') {
            const response = await axios.get(base_url + "/shops/" + req.params.id);
            res.render("MMguitarView", { shops: response.data, level: req.cookies.level, username: req.cookies.username, Fail: "" });
        } else {
            res.redirect("/");
        }
    } catch {
        console.error(err);
        res.status(500).send('Error MMguitarView')
    }
})

// [PAGE] MMguitarEdit -> shops
app.get("/MMguitarEdit/:id", async (req,res) => {
    try {
        if (req.cookies.level == 'user') {
            res.redirect("/");
        } else if (req.cookies.level == 'admin') {
            const response = await axios.get(base_url + "/shops/" + req.params.id);
            res.render("MMguitarEdit", { shops: response.data, level: req.cookies.level, username: req.cookies.username, Fail: "" });
        } else {
            res.redirect("/");
        }
    } catch {
        console.error(err);
        res.status(500).send('Error MMguitarEdit')
    }
})

// MMguitarEdit2 -> shops
app.post("/MMguitarEdit2/:id", async (req,res) => {
    try {
        if (req.cookies.level == 'user') {
            res.redirect("/");
        } else if (req.cookies.level == 'admin') {
            const data = {
                guitarname: req.body.guitarname,
                price: req.body.price,
                detail: req.body.detail
            };
            await axios.put(base_url + '/shops/' + req.params.id, data);

            const response = await axios.get(base_url + "/shops/" + req.params.id);
            res.redirect("/MMguitarView/" + req.params.id);
        } else {
            res.redirect("/");
        }
    } catch {
        console.error(err);
        res.status(500).send('Error MMguitarEdit')
    }
})

// MMguitarDelete -> shops
app.get('/MMguitarDelete/:id', async (req, res) => {
    try {
        if (req.cookies.level == 'user') {
            res.redirect("/");
        } else if (req.cookies.level == 'admin') {
            await axios.delete(base_url + '/shops/' + req.params.id);
            res.redirect("/management");
        } else {
            res.redirect("/");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error MMguitarDelete');
    }
});

// [PAGE] MMchord -> chords
app.get("/MMchord", async (req,res) => {
    try {
        if (req.cookies.level == 'user') {
            res.redirect("/");
        } else if (req.cookies.level == 'admin') {
            const response = await axios.get(base_url + "/chords");
            res.render("MMchord", { chords: response.data, level: req.cookies.level, username: req.cookies.username, Fail: "" });
        } else {
            res.redirect("/");
        }
    } catch {
        console.error(err);
        res.status(500).send('Error MMchord')
    }
})

// MMchordEdit -> chords
app.get("/MMchordEdit/:id", async (req,res) => {
    try {
        if (req.cookies.level == 'user') {
            res.redirect("/");
        } else if (req.cookies.level == 'admin') {
            const response = await axios.get(base_url + "/shops/" + req.params.id);
            res.render("MMguitarEdit", { shops: response.data, level: req.cookies.level, username: req.cookies.username, Fail: "" });
        } else {
            res.redirect("/");
        }
    } catch {
        console.error(err);
        res.status(500).send('Error MMguitarEdit')
    }
})

// [PAGE] MMuser -> accounts
app.get("/MMuser", async (req,res) => {
    try {
        if (req.cookies.level == 'user') {
            res.redirect("/");
        } else if (req.cookies.level == 'admin') {
            const response = await axios.get(base_url + "/accounts");
            res.render("MMuser", { accounts: response.data, level: req.cookies.level, username: req.cookies.username, Fail: "" });
        } else {
            res.redirect("/");
        }
    } catch {
        console.error(err);
        res.status(500).send('Error MMuser')
    }
})

// updateRole -> accounts
// app.post("/updateRole", async (req,res) => {
//     try {
//         if (req.body.username == '') {
//             return res.render("management", { Fail: "กรุณาใส่ชื่อ user", level: req.cookies.level, username: req.cookies.username});
//         }

//         const response = await axios.get(base_url + "/accounts");
//         const accounts = response.data;
//         let RoleFailed = true; 

//         for (const account of accounts) {
//             if (req.body.username === account.username) {
//                 RoleFailed = false; 
//                 const data = { level: req.body.role };
//                 await axios.put(base_url + '/accounts/' + account.id_account, data);
//                 return res.redirect("/");
//             }
//         }

//         if (RoleFailed) {
//             return res.render("management", { Fail: "ไม่สามารถเปลี่ยน Role ได้ username อาจไม่ถูกต้อง", level: req.cookies.level, username: req.cookies.username});
//         }
//     } catch {
//         console.error(err);
//         res.status(500).send('Error management')
//     }
// })

// createGuitar -> shops
// app.post('/createGuitar', guitar.single('guitarURL'), async (req, res) => {
//     try {
//         if (req.body.guitarname == '') {
//             return res.render("management", { Fail: "กรุณาใส่ชื่อ guitar", level: req.cookies.level, username: req.cookies.username});
//         } else if (req.body.price == '') {
//             return res.render("management", { Fail: "กรุณาใส่ price", level: req.cookies.level, username: req.cookies.username});
//         } else if (req.body.detail == '') {
//             return res.render("management", { Fail: "กรุณาใส่ detail", level: req.cookies.level, username: req.cookies.username});
//         } else if (!req.file || !req.file.filename) {
//             return res.render("management", { Fail: "กรุณาใส่รูปภาพ guitar", level: req.cookies.level, username: req.cookies.username});
//         }

//         const data = {
//             guitarURL: req.file.filename,
//             guitarname: req.body.guitarname,
//             price: req.body.price,
//             detail: req.body.detail
//         };

//         await axios.post(base_url + '/shops' , data);
//         return res.redirect("/");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error putIMG');
//     }
// });

// updateGuitar -> shops
// app.post('/updateGuitar', async (req, res) => {
//     try {
//         if (req.body.guitarname == '') {
//             return res.render("management", { Fail: "กรุณาใส่ชื่อ guitar", level: req.cookies.level, username: req.cookies.username});
//         } else if (req.body.new_guitarname == '') {
//             return res.render("management", { Fail: "กรุณาใส่ชื่อ guitar ใหม่", level: req.cookies.level, username: req.cookies.username});
//         } else if (req.body.price == '') {
//             return res.render("management", { Fail: "กรุณาใส่ price", level: req.cookies.level, username: req.cookies.username});
//         } else if (req.body.detail == '') {
//             return res.render("management", { Fail: "กรุณาใส่ detail", level: req.cookies.level, username: req.cookies.username});
//         }
        
//         const response = await axios.get(base_url + "/shops");
//         const shops = response.data;
//         let guitarFailed = true; 

//         for (const shop of shops) {
//             if (req.body.guitarname === shop.guitarname) {
//                 guitarFailed = false; 
//                 const data = {
//                     guitarname: req.body.new_guitarname != '' ? req.body.new_guitarname : req.body.guitarname,
//                     price: req.body.price,
//                     detail: req.body.detail
//                 };
//                 await axios.put(base_url + '/shops/' + shop.id_guitar, data);
//                 return res.redirect("/");
//             }
//         }

//         if (guitarFailed) {
//             return res.render("management", { Fail: "ไม่สามารถแก้ไขข้อมูล guitar ได้ guitarname อาจไม่ถูกต้อง", level: req.cookies.level, username: req.cookies.username});
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error putIMG');
//     }
// });

// deleteGuitar -> shops
// app.post('/deleteGuitar', async (req, res) => {
//     try {
//         if (req.body.guitarname == '') {
//             return res.render("management", { Fail: "กรุณาใส่ชื่อ guitar", level: req.cookies.level, username: req.cookies.username});
//         } 
        
//         const response = await axios.get(base_url + "/shops");
//         const shops = response.data;
//         let guitarFailed = true; 

//         for (const shop of shops) {
//             if (req.body.guitarname === shop.guitarname) {
//                 guitarFailed = false; 
//                 await axios.delete(base_url + '/shops/' + shop.id_guitar);
//                 return res.redirect("/");
//             }
//         }

//         if (guitarFailed) {
//             return res.render("management", { Fail: "ไม่สามารถลบ guitar ได้ guitarname อาจไม่ถูกต้อง", level: req.cookies.level, username: req.cookies.username});
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error putIMG');
//     }
// });

// createChord -> chords
// app.post('/createChord', chord.single('datachord'), async (req, res) => {
//     try {
//         if (req.body.chordname == '') {
//             return res.render("management", { Fail: "กรุณาใส่ชื่อ chord", level: req.cookies.level, username: req.cookies.username});
//         } else if (!req.file || !req.file.filename) {
//             return res.render("management", { Fail: "กรุณาใส่รูปภาพ chord", level: req.cookies.level, username: req.cookies.username});
//         } 

//         const data = {
//             chordname: req.body.chordname,
//             datachord: req.file.filename,
//         };

//         await axios.post(base_url + '/chords' , data);
//         return res.redirect("/");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error putIMG');
//     }
// });

// deleteChord -> chords
// app.post('/deleteChord', async (req, res) => {
//     try {
//         if (req.body.chordname == '') {
//             return res.render("management", { Fail: "กรุณาใส่ชื่อ chord", level: req.cookies.level, username: req.cookies.username});
//         } 
        
//         const response = await axios.get(base_url + "/chords");
//         const chords = response.data;
//         let chordFailed = true; 

//         for (const chord of chords) {
//             if (req.body.chordname === chord.chordname) {
//                 chordFailed = false; 
//                 await axios.delete(base_url + '/chords/' + chord.id_chord);
//                 return res.redirect("/");
//             }
//         }

//         if (chordFailed) {
//             return res.render("management", { Fail: "ไม่สามารถลบ chord ได้ chordname อาจไม่ถูกต้อง", level: req.cookies.level, username: req.cookies.username});
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error putIMG');
//     }
// });

// [PAGE] signUp
app.get("/signup", async (req, res) => {
    try {
        res.render("signup" , { Fail: "" })
    } catch {
        console.error(err);
        res.status(500).send('Error signup')
    }
});

// signup2 -> accounts
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

// [PAGE] login
app.get("/login", async (req, res) => {
    try {
        res.render("login", { Fail: ""})
    } catch {
        console.error(err);
        res.status(500).send('Error signup')
    }
});

// login2 -> accounts
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