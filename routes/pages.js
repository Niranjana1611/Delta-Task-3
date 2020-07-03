const express = require('express');
const User = require('../core/user');
const router = express.Router();
const mysql = require('mysql');
const pool = require('../core/pool');

const user = new User();

var user_roll;
var user_name;

router.get('/', (req, res, next) => {
    res.render('login');
})

router.post('/login', (req, res, next) => {
    user.login(req.body.rollnumber, req.body.username, req.body.password, function(result) {
        user_roll = req.body.rollnumber;
        user_name = req.body.username;

        if(result){
            req.session.user = result;
            req.session.opp = 1;
            res.redirect('/home');
        }
        else{
            res.send('Username/Password incorrect!');
        }
    })
});

router.post('/register', (req, res, next) => {
    let userInput = {
        rollnumber: req.body.rollnumber,
        username: req.body.username,
        password: req.body.password
    };

    user_name = req.body.username;
    user_roll = req.body.rollnumber;
    
    user.create(userInput, function(lastId) {
        if(lastId){
            user.find(userInput, function(result) {
                req.session.user = result;
                req.session.opp = 0;
                res.redirect('/home');
            });
        }
        else{
            res.send('User already exists!');
        }
    });
});

router.get('/home', (req, res) => {
	let user = req.session.user;
    if(user) {
        res.render('invite',{
            name : user_name
        });
        return;
    }
    res.redirect('/');
});

router.get('/loggout', (req, res, next) => {
    delete req.session;
    res.redirect('/');
});

router.get('/create', (req, res) => {
    res.render("make");
});

router.post('/send_to', (req, res, next) => {
    res.render("send_to");
});

var inv_name;

var inv_header;
var head_face;
var head_size;

var inv_body;
var body_face;
var body_size;

var inv_footer;
var foot_face;
var foot_size;

router.post('/preview', (req, res) => { 

    inv_name = req.body.invitation_name;

    inv_header = req.body.Invitation_header;
    head_face = req.body.head_font_face;
    head_size = req.body.head_font_size;

    inv_body = req.body.Invitation_body;
    body_face = req.body.body_font_face;
    body_size = req.body.body_font_size;

    inv_footer = req.body.Invitation_footer;
    foot_face = req.body.foot_font_face;
    foot_size = req.body.foot_font_size;

    res.render("preview",{
            inv_h : inv_header,
            h_face : head_face,
            h_size : head_size,

            inv_b : inv_body,
            b_face : body_face,
            b_size : body_size,

            inv_f : inv_footer,
            f_face : foot_face,
            f_size : foot_size          
        });
});

router.post('/send', (req, res) => {     

    user.invite(inv_name, inv_header, head_face, head_size, inv_body, body_face, body_size, inv_footer, foot_face, foot_size, req.body.to_rollno, req.body.to_name, function(lastId) {
        if(lastId){
            console.log("inserted");
        }
        else{
            console.log("not inserted");
        } 
    });

    res.redirect("/redirect");
});

router.get('/redirect', (req,res) => {
    res.render("redirect");
})

router.get('/rec_invites', (req, res, next) => {
    
    pool.getConnection(function(err){
        if(err)
            throw err;

        var query = `SELECT * FROM details WHERE rec_rollno = `+user_roll;
        
        pool.query(query,function(err,data){
            if(err)
                throw err;
            else {
                res.render("dashboard",{
                    contacts: data
                });  
            }
        });
    });
});

router.get('/invitations', (req, res, next) => {
    
    pool.getConnection(function(err){
        if(err)
            throw err;

        var query = `SELECT * FROM details WHERE rollnumber = `+user_roll+` GROUP BY invitationname`;
        
        pool.query(query,function(err,data){
            if(err)
                throw err;
            else {
                res.render("card",{
                    contacts: data
                });  
            }
        });
    });
});

router.get('/sent_invites', (req, res, next) => {
    console.log(user_roll)
    pool.getConnection(function(err){
        if(err)
            throw err;

        var query = `SELECT * FROM details WHERE rollnumber = `+user_roll;
        
        pool.query(query,function(err,data){
            if(err)
                throw err;
            else {
                res.render("sent_invitation",{
                    contacts: data
                });  
            }
        });
    });
});

router.post('/accept', (req, res, next) => {
    user.accept(req.body.sender_rno, req.body.inv_name, function(result) {
        console.log("Updated");
    });
    res.redirect("/rec_invites");
});

router.post('/reject', (req, res, next) => {
    user.reject(req.body.sender_rno, req.body.inv_name, function(result) {
        console.log("Updated");
    });
    res.redirect("/rec_invites");
});

module.exports = router;