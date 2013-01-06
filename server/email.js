var nodemailer = require("nodemailer"),
    secret     = require(__dirname + "/secret.js"),
    fs         = require("fs"),
    jade       = require("jade");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Mandrill",
    auth: secret.email // {user,pass}
});

exports.send = function sendMail(to, info, temp, cb) {
    // send mail with defined transport object
    if(info == null || to == null) return;
    var template = jade.compile(fs.readFileSync(__dirname+'/email/' + temp, 'utf8'));
    var html = template(info);

    var opts = {
        from: "Tulip Noir <no-reply@tulipnoircafe.com>", // sender address
        replyTo: to.reply,
        to: to.email, // list of receivers
        subject: to.subject, // Subject line
        html: html, // html body
        generateTextFromHTML: true
    }
    console.log(opts);

    // send the email
    smtpTransport.sendMail(opts, function(error, response){
        if(error){
            cb(error);
        } else {
            var msg = "Message sent: " + response.message;
            cb(msg);
        }
    });
};
