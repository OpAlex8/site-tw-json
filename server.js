const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuidv1 = require('uuid/v1');
const fs = require("fs");
const app = express();

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());

app.post("/trains", (req, res) => {
    const TrainList = readJSONFile();
    const newTrain = req.body;
    newTrain.id = uuidv1();
    TrainList.push(newTrain);
    writeJSONFile(TrainList);
    res.json(newTrain);
});

app.post("/users", (req, res) => {
    const userList = readUsers();
    const newUser = req.body;
    newUser.id = uuidv1();
    userList.push(newUser);
    writeUsers(userList);
    res.json(newUser);
});

app.get("/trains/:id", (req, res) => {
    const TrainList = readJSONFile();
    const id = req.params.id;
    let flag = false;
    let Train;

    TrainList.forEach(currentTrain => {
        if (id == currentTrain.id) {
            flag = true;
            Train = currentTrain;
        }
    });

    if (flag) {
        res.json(Train);
    } else {
        res.status(404).send('Train ${id} was not found');
    }
});

app.get("/trains", (req, res) => {
    const TrainList = readJSONFile();
    res.json(TrainList);
});

app.get("/users", (req, res) => {
    const userList = readUsers();
    res.json(userList);
});

app.put("/trains/:id", (req, res) => {
    const TrainList = readJSONFile();
    const id = req.params.id;
    const newTrain = req.body;

    newTrain.id = id;
    let flag = false;

    const newTrainList = TrainList.map((Train) => {
        if (Train.id == id) {
            flag = true;
            return newTrain;
        }
        return Train;
    });

    writeJSONFile(newTrainList);

    if (flag == true) {
        res.json(newTrain);
    } else {
        res.status(404).send('Train ${id} was not found');
    }
});

app.delete("/trains/:id", (req, res) => {
    const TrainList = readJSONFile();
    const id = req.params.id;
    const newTrainList = TrainList.filter((Train) => Train.id != id);

    if (TrainList.length !== newTrainList.length) {
        res.status(200).send('Train ${id} was removed');
        writeJSONFile(newTrainList);
    } else {
        res.status(404).send('Train ${id} was not found');
    }
});

function readJSONFile() {
    return JSON.parse(fs.readFileSync("db.json"))["trains"];
}

function readUsers() {
    return JSON.parse(fs.readFileSync("login.json"))["users"];
}

function writeJSONFile(content) {
    fs.writeFileSync(
        "db.json",
        JSON.stringify({trains: content}),
        "utf8",
        err => {
            if (err) {
                console.log(err);
            }
        }
    );
}

function writeUsers(content) {
    fs.writeFileSync(
        "login.json",
        JSON.stringify({users: content}),
        "utf8",
        err => {
            if (err) {
                console.log(err);
            }
        }
    );
}

app.listen("3000", () =>
    console.log("Server started at: http://localhost:3000")
);
