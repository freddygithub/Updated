// TOP LEVEL ROUTES
var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

var conn;
async function loadDb() {
    try {
        conn = await mysql.createConnection({
            host     : process.env.ENDPOINT,
            database : process.env.DATABASE,
            user     : process.env.USERNAME,
            password : process.env.PASSWORD,
            typeCast: function (field, next) {
            if (field.type === 'DATETIME') {
            return new Date(`${field.string()}Z`) // can be 'Z' for UTC or an offset in the form '+HH:MM' or '-HH:MM'
            }
            return next();
        }
        });
    } catch (e) {
        console.warn(e);
    }
}

loadDb();

// check route
router.get('/', async (req, res) => {
    res.render('ChooseYourPlan');
});

router.get('/plans', async (req, res) => {
    res.render('Plans');
});

router.get('/createaccount', async (req, res) => {
    res.render('CreateYourAccount');
});

router.get('/account', async (req, res) => {
    res.render('Account');
});

router.get('/userinfo', async(req, res) => {
    let boundary = "R^F^B";
    let udata = req.query.email + boundary + req.query.psw;
    let buff = new Buffer(udata);
    let uinfo = buff.toString('base64');

    res.locals.uinfo = uinfo;
    res.render('UserInfo');
});

router.get('/payment', async(req, res) => {
    let boundary = "R^F^B";
    let udata = req.query.age + boundary + req.query.weight + boundary + req.query.height + boundary + req.query.gender;
    let buff = new Buffer(udata);
    let uinfo = buff.toString('base64');

    res.locals.uinfo = req.query.uinfo;
    res.locals.uinfo2 = uinfo;
    res.render('SetUpYourPayment');
});

router.get('/card', async (req, res) => {
    res.locals.uinfo = req.query.uinfo;
    res.locals.uinfo2 = req.query.uinfo2;
    res.render('card');
});

router.post('/card', async (req, res) => {
    let boundary = "R^F^B";

    let buff1 = new Buffer(req.body.uinfo, 'base64');
    let buff2 = new Buffer(req.body.uinfo2, 'base64');

    let info1 = buff1.toString('ascii');
    let info2 = buff2.toString('ascii');

    let infoArr1 = info1.split(boundary);
    let infoArr2 = info2.split(boundary);

    console.log(`
        UINFO1 = ${req.body.uinfo}
        UINFO2 = ${req.body.uinfo2}
        INFO1 = ${info1}
        INFO2 = ${info2}
    `);

    console.log(req.body);

    let email = infoArr1[0];
    let pword = bcrypt.hashSync(infoArr1[1], bcrypt.genSaltSync(8));
    let age = infoArr2[0];
    let weight = infoArr2[1];
    let height = infoArr2[2];
    let gender = infoArr2[3];
    let name = req.body.name;

    let fname = req.body.name.split(' ')[0];
    let lname = req.body.name.slice(fname.length+1);

    let addr = req.body.addr;
    let state = req.body.state;
    let city = req.body.city;
    let zip = req.body.zip;
    let phone = req.body.phone;

    let query = `INSERT INTO users (firstName, lastName, email, password, address, city, state, postalCode, phone, age, weight, height) VALUES (${conn.escape(fname)}, ${conn.escape(lname)}, ${conn.escape(email)}, '${pword}', ${conn.escape(addr)}, ${conn.escape(city)}, ${conn.escape(state)}, ${conn.escape(zip)}, ${conn.escape(phone)}, ${conn.escape(age)}, ${conn.escape(weight)}, ${conn.escape(height)})`

    try {
        await conn.query(query);
    } catch (e) {
        console.warn(e);
    }

    console.log(`
        EMAIL = ${email}
        PWORD = ${pword}
        AGE = ${age}
        WEIGHT = ${weight}
        HEIGHT = ${height}
        GENDER = ${gender} 
    `);

    res.render('FinishedSignUp');
});

router.get('/activationcode', async (req, res) => {
    res.render('ActivationCode');
});

module.exports = router;