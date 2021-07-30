const express = require('express')

const app = express();

app.use(express.urlencoded())
app.use(express.json());

const fs = require('firebase-admin');
const serviceAccount = require('./crud-firebase-node-321406-df4b63e2f799.json');

// App Initilization
fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
   });

// Database Initialization   
const db = fs.firestore();

//get users collection
const users = db.collection('users')

// create user
app.post('/data', async(req,res)=>{
    try{
        const docRef=users.doc(req.body.user.name)
        await docRef.set({
            hobby: req.body.user.hobby,
            age: req.body.user.age
        })
        res.status(201).json({
            success: true,
            message: "User added successfuly"
        })  
    }
    catch(e){
        console.log(e);
    }   
})

// update user
app.post('/update', async(req,res) => {
    try{
        const docRef = users.doc(req.body.user.name)
        await docRef.update({
            hobby : req.body.user.hobby,
            age : req.body.user.age
        })
        res.status(200).json({
            success: true,
            message: "User updated successfully"
        })
    }
    catch(e){
        console.log(e);
    }
  })

// get users
app.get('/get', async(req, res) => {
    try{
        const listOfUsers = []
        const result = await users.get()
        if (result.docs.length) {
            for (const user of result.docs) {
                listOfUsers.push(user.data())
            }
        }
        res.status(200).json({
            success: true,
            message: "These are the users",
            users : listOfUsers
        })
    }
    catch(e){
        console.log(e)
    }

})  

// delete user
app.post('/delete', async(req,res) => {
    try{
        await users.doc(req.body.user.name).delete()
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    }
    catch(e){
        console.log(e);
    }
})  


app.get('/welcome', async(req,res)=>{
    res.send('hello');
})

app.get('*',(req,res) => {
	res.status(404).send('Page Not Found');
});


app.listen(8080, (req,res) => {
    console.info(`Running on 8080`)
})

