var express = require('express');
var router = express.Router();

router.post('/',function(req,res){    
    req.session.destroy(function(err){  
        if(err){  
            console.log(err);  
        }  
        else  
        {  
            console.log(req.session);
            res.redirect('/');  
        }  
    });  

});

module.exports = router;