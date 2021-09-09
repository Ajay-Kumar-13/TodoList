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

app.post('/',function(req,res)
{
    console.log(req.body)
    var Personalitem = req.body.newItem;

    if (Personalitem.length > 0)
    {
        items.push(Personalitem);
        res.redirect('/');
    }
    
});

app.get('/work',function(req,res)
{
    var date = new Date();
    var options = {weekday:"long",month:"short",day:"numeric"};
    var day = date.toLocaleDateString('en',options);
    
    res.render('work',{kindOfDay:day, workItems:workSchedule});
});

app.post('/work',function(req,res)
{
    console.log(req.body)
    var workitem = req.body.newItem;

    if (workitem.length > 0)
    {
        workSchedule.push(workitem);
        res.redirect('/work');
    }
    
});


app.listen(3000,function()
{
    console.log('server is running on port 3000');
});