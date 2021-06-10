const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
//
const app =express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 
//
//Mysql stuff
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "junkDb",
});

//get all notes
app.get('/',(req,res)=>{
    res.send({message: "please go to /notes"});
})

//To get all notes in the db
app.get('/notes',(req,res)=>{
    //gets a connection from the pool that is created above based on the db we have in phpmyadmin or mysqldb
    pool.getConnection((error,connection) => {
        if(error) res.send({error: `${error.message}`});
        console.log(`connected as id ${connection.threadId}`);
        //
        connection.query("SELECT * from junk", (error, rows)=>{
            connection.release();
            if(error) res.send({error: `${error.message}`});
            else res.send(rows);
        });
    });
});

//get note by id
app.get('/notes/:id',(req,res)=>{
    //gets a connection from the pool that is created above based on the db we have in phpmyadmin or mysqldb
    pool.getConnection((error,connection) => {
        if(error) res.send({error: `${error.message}`});
        console.log(`connected as id ${connection.threadId}`);
        //
        connection.query("SELECT * from junk WHERE id = ? ",[req.params.id], (error, rows)=>{
            connection.release();
            if(error) res.send({error: `${error.message}`});
            else res.send(rows);
        });
    });
});

//delete note by id
app.delete('/notes/:id',(req,res)=>{
    //gets a connection from the pool that is created above based on the db we have in phpmyadmin or mysqldb
    pool.getConnection((error,connection) => {
        if(error) res.send({error: `${error.message}`});
        console.log(`connected as id ${connection.threadId}`);
        //
        connection.query("DELETE from junk WHERE id = ? ",[req.params.id], (error, rows)=>{
            connection.release();
            if(error) res.send({error: `${error.message}`});
            else res.send({message: `note with id: ${req.params.id} has been deleted successully.`});
        });
    });
});

//create a new note
app.post('/notes',(req,res)=>{
    //gets a connection from the pool that is created above based on the db we have in phpmyadmin or mysqldb
    pool.getConnection((error,connection) => {
        if(error) res.send({error: `${error.message}`});
        console.log(`connected as id ${connection.threadId}`);
        //
        const newNote = req.body;

        connection.query('INSERT INTO junk SET ?', newNote , (error, rows)=>{
            connection.release();
            if(error) res.send({error: `${error.message}`});
            else res.send({message: `note with title: \'${newNote.noteTitle}\' has been created successully.`});
        });

        if(req.body != undefined) console.log(req.body);  
    });
});

//update a note
app.put('/notes',(req,res)=>{
    //gets a connection from the pool that is created above based on the db we have in phpmyadmin or mysqldb
    pool.getConnection((error,connection) => {
        if(error) res.send({error: `${error.message}`});
        console.log(`connected as id ${connection.threadId}`);
        //
        const { id,noteTitle, noteDescription } = req.body;

        connection.query('UPDATE junk SET noteTitle = ?, noteDescription = ? WHERE id = ?', [noteTitle , noteDescription , id] , (error, rows)=>{
            connection.release();
            if(error) res.send({error: `${error.message}`});
            else res.send({message: `note with title: \'${noteTitle}\' has been edited successully.`});
        });

        if(req.body != undefined) console.log(req.body);  
    });
});






//listner
const port = process.env.PORT || '3000';
app.listen(port,()=> console.log(`server started at \nhttp://localhost:${port}`));