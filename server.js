import mongoose from 'mongoose';
import express from 'express';

mongoose.connect('mongodb://localhost:27017/cats', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

// Express server for routing, logic
const server = express();
server.use(express.json());


//Cat model (as defined in mongoose)
const Cat = mongoose.model('Cat', { name: String, fur: String, age: Number});

//Express routes
server.get('/', (request,response) => {
    response.json({status : 'alive'});
});

server.get('/cats', (req,res)=>{
    Cat.find().then((cats => res.json(cats)))
});

server.get('/cats/:kittyName',(req,res)=>{
    const { kittyName} = req.params;
    Cat.find({ name:kittyName}).then(cat => res.json(cat));
})


server.post('/cats/:kittyName', (req,res) =>{
    const { kittyName } = req.params;
    const kitty = new Cat({ name: kittyName });// constructor -> creates a new cat
    kitty.save().then(() => res.json(kittyName + ' says meow'));
});

server.patch('/cats/:kittyName', (req,res) => {
    const { kittyName } = req.params;
    const updatedCat = req.body;
    Cat.findOneAndUpdate({ name: kittyName},updatedCat,{ new:true })
    .then(myNewData => res.json(myNewData))
    .catch(error => {
        console.error(error);
        res.json({error: 'an unexpected error occured'})
    })
})



// kitty.save().then(() => console.log('meow'));

const port = 4000;

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})