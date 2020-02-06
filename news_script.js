const list = document.getElementById('image-list');
const formName = document.getElementById('formName');
const formUrl = document.getElementById('formUrl');
const addButton = document.getElementById('addButton');
let updateButton = document.getElementById('updateButton');

function getTrains() {
    fetch('http://localhost:3000/trains')
        .then(function (response) {
            response.json().then(function (trains) {
                appendTrainsToDOM(trains);
            });
        });
};

function postTrain() {
    const postObject = {
        name: formName.value,
        img: formUrl.value
    }

    fetch('http://localhost:3000/trains', {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(postObject)
    }).then(function () {
        getTrains();
        resetForm();
    });
}

function deleteTrain(id) {
    fetch(`http://localhost:3000/trains/${id}`, {
        method: 'DELETE',
    }).then(function () {
        getTrains();
    });
}

function updateTrain(id) {
    const putObject = {
        name: formName.value,
        img: formUrl.value
    }

    fetch(`http://localhost:3000/trains/${id}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(putObject)
    }).then(function () {
        getTrains();
        addButton.disabled = false;
        clearUpdateButtonEvents();
        resetForm();
    });
}

function editTrain(train) {
    formName.value = train.name;
    formUrl.value = train.img;
    
    addButton.disabled = true;

    clearUpdateButtonEvents();

    updateButton.disabled = false;
    updateButton.addEventListener('click', function () {
        updateTrain(train.id)
    });
}

function appendTrainsToDOM(trains) {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    for (let i = 0; i < trains.length; i++) {
        let img = document.createElement('img');
        console.log(trains[i].img);
        img.src = trains[i].img;
        img.className = "services-image";
        let name = document.createElement('span');
        name.innerText = trains[i].name;
        name.className = "services-span";

        let editButton = document.createElement('button');
        editButton.addEventListener('click', function () {
            editTrain(trains[i])
        });
        editButton.innerText = 'Edit';
        editButton.className = 'script-btn';
        let deleteButton = document.createElement('button')
        deleteButton.addEventListener('click', function () {
            deleteTrain(trains[i].id)
        });
        deleteButton.innerText = 'Delete';
        deleteButton.className = 'script-btn';
        
        let container = document.createElement('div');
        container.appendChild(img);
        container.appendChild(name);
        container.appendChild(editButton);
        container.appendChild(deleteButton);

        list.appendChild(container);
    }
}

function resetForm() {
    formName.value = '';
    formUrl.value = '';
}

function clearUpdateButtonEvents() {
    let newUpdateButton = updateButton.cloneNode(true);
    updateButton.parentNode.replaceChild(newUpdateButton, updateButton);
    updateButton = document.getElementById('updateButton');
}

addButton.addEventListener('click', postTrain);

getTrains();
