const express = require('express');
const bodyParser = require('body-parser');
var items = [];
var workSchedule = [];
const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));

app.get('/',function(req,res)
{
    var date = new Date();
    var options = {weekday:"long",month:"short",day:"numeric"};
    var day = date.toLocaleDateString('en',options);
    
    res.render('list',{kindOfDay:day, listItems:items});
    
});

app.get('/work',function(req,res)
{
    var date = new Date();
    var options = {weekday:"long",month:"short",day:"numeric"};
    var day = date.toLocaleDateString('en',options);
    
    res.render('work',{kindOfDay:'Work List', workItems:workSchedule});
});



app.post('/',function(req,res)
{
    var item = req.body.newItem;

    if ('personal' === getKeyByValue(req.body,'+'))
    {
        items.push(item);
        res.redirect('/');
    }
    else if('work' === getKeyByValue(req.body,'+'))
    {
        workSchedule.push(item);
        res.redirect('/work');
    }
    
});

function getKeyByValue(object, value) {
    
    return Object.keys(object).find(key => object[key] === value);
}



app.listen(3000,function()
{
    console.log('server is running on port 3000');
});