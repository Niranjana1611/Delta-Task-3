const pool = require('./pool');
const bcrypt = require('bcrypt');

function User() {};

var user_rollno;
var user_name;
var invitation_name;

User.prototype = {
    find : function(user = null, callback)
    {
        if(user) {
            var field = "rollnumber";
        }

        let sql = `SELECT * FROM logged WHERE ${field} = ` + user.rollnumber;
        
        pool.query(sql, user, function(err, result) {
            if(err) throw err

            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    },

    create : function(body, callback) 
    {
        var pwd = body.password;
        user_rollno = body.rollnumber;
        user_name = body.username;
        
        body.password = bcrypt.hashSync(pwd,10);

        var input = {
            user_rollno : body.rollnumber,
            user_name : body.username
        }

        var bind = [];
        
        for(prop in body){
            bind.push(body[prop]);
        }
        
        var sql1 = `INSERT INTO logged(rollnumber, username, password) VALUES (?, ?, ?);`;

        pool.query(sql1, bind, function(err, result) {
            if(err){
                if (err.code === 'ER_DUP_ENTRY') {
                    callback(null);
                    return;
                }
            }
            callback(result.insertId);
        });
    },

    login : function(rollnumber, username, password, callback)
    {
        let userInput = {
        rollnumber: rollnumber,
        password: password
        };

        user_rollno = rollnumber;
        user_name = username;

        this.find(userInput, function(user) {
            if(user) {
                if(bcrypt.compareSync(password, user.password)) {
                    callback(user);
                    return;
                }  
            }
            callback(null);
        });
        
    },

    invite : function(invname, invheader, invheader_font, invheader_size, invbody, invbody_font, invbody_size, invfooter, invfooter_font, invfooter_size, rec_rollno, rec_name, callback){    

        let sql = `INSERT IGNORE INTO details (rollnumber,username,invitationname,invheader,invheader_font,invheader_size,invbody,invbody_font,invbody_size,invfooter,invfooter_font,invfooter_size,rec_rollno,rec_name,decision) VALUES (`+user_rollno+`,"`+user_name+`","`+invname+`","`+invheader+`","`+invheader_font+`",`+invheader_size+`,"`+invbody+`","`+invbody_font+`",`+invbody_size+`,"`+invfooter+`","`+invfooter_font+`",`+invfooter_size+`,`+rec_rollno+`,"`+rec_name+`","NULL");`;
        
        pool.query(sql, function(err, result) {
            if(err) throw err;
             callback(result.insertId);
        });

        
    },

    accept : function(sendrno, inv_name, callback){

        var sql = `UPDATE details SET decision = "Accepted" WHERE rec_rollno = `+user_rollno+ ` AND invitationname = "`+inv_name+`";`;
        
        pool.query(sql, function(err, result) {
            if(err){
                throw err
            } 

            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        callback(null);
        });
    },

    reject : function(sendrno, inv_name, callback){

        var sql = `UPDATE details SET decision = "Rejected" WHERE rec_rollno = `+user_rollno+ ` AND invitationname = "`+inv_name+`";`;

        pool.query(sql, function(err, result) {
            if(err){
                throw err
            } 

            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        callback(null);
        });
    },
};

module.exports = User;

