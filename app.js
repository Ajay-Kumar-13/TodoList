const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require("mongoose");
const { name } = require('ejs');
const _ = require('lodash');

// mongoose.connect('mongodb://localhost:27017/todolistDB');
mongoose.connect('mongodb+srv://Ajay-kumar:Ajaykumar$13@cluster0.ofmxz.mongodb.net/todolistDB');

const ItemSchema = new mongoose.Schema({
    name:String
});

const listSchema = new mongoose.Schema(
    {
        name:String,
        items:[ItemSchema]
    });

const List = mongoose.model('list',listSchema);

const Item = mongoose.model('item',ItemSchema);

const item1 = new Item(
    {
        name:'Welcome to TodoList!'
    })
const item2 = new Item(
    {
        name:'Hit + icon to save the data'
    })
const item3 = new Item(
    {
        name:'<-- Hit this to remove the data'
    })

defaultItems = [item1,item2,item3]





app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));

app.get('/',function(req,res)
{
    Item.find(function(err,results)
    {
        if (err)
        {
            console.log(err)
        }
        else
        {
            if (results.length === 0 )
            {
                Item.insertMany(defaultItems,function(err)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        res.redirect('/')
                    }
                })
                // res.redirect('/')
            }
            else
            {
                res.render('list',{kindOfDay:'Today', listItems:results});
            }
        }
    })
});

app.get('/:customlist',function(req,res)
{
    const customListName = _.capitalize(req.params.customlist);
    if (customListName != 'favicon.ico')
    {
        List.find({name:customListName},function(err,results)
        {
            if(results.length === 0 )
            {
                const list = new List({
                    name:customListName,
                    items:defaultItems
                })
                list.save();
                res.redirect('/'+customListName);
            }
            else
            {
                res.render('list',{kindOfDay:customListName,listItems:results[0].items});
            }
        })
    }
    
})


app.post('/delete',function(req,res)
{
    const checkedbox = req.body.checkbox;
    const listName = req.body.listname;

    if (listName == 'Today')
    {
        Item.deleteOne({_id:checkedbox},function(err)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                res.redirect('/')    
            }
        })
    }
    else
    {
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedbox}}},function(err,results)
        {
            if (!err)
            {
                res.redirect('/'+listName);
            }
        })
    }
    
    
})




app.post('/',function(req,res)
{
    const to = req.body.value;

    const item = new Item(
        {
            name:req.body.newItem
        }
    )

    if (to === 'Today')
    {
        item.save();
        res.redirect('/')
    }
    else
    {
        List.findOne({name:to},function(err,foundList)
        {
            if(!err)
            {
                foundList.items.push(item);
                foundList.save()
                res.redirect('/'+to);
            }
        })
    }

    
});



app.listen(3000,function()
{
    console.log('server started and running on port 3000');
})


