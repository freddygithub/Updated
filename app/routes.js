// TOP LEVEL ROUTES
var express = require('express');
var router = express.Router();

const mysql = require('mysql2/promise');

async function loadDb() {
    try {
        let conn = await mysql.createConnection({
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
    res.render('UserInfo');
});

router.get('/payment', async(req, res) => {
    res.render('SetUpYourPayment');
});

router.get('/card', async (req, res) => {
    res.render('card');
});

router.post('/card', async (req, res) => {
    res.render('FinishedSignUp');
});

router.get('/activationcode', async (req, res) => {
    res.render('ActivationCode');
});

module.exports = router;