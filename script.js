
let addBtn = document.querySelector(".add");

let body = document.querySelector("body");

let grid = document.querySelector('.grid');

let colors = ["pink", "blue", "green", "black"]

let allFiltersChildren = document.querySelectorAll(".filter div")

for (let i = 0; i < allFiltersChildren.length; i++) {
    allFiltersChildren[i].addEventListener('click', function (e) {
        let filterColor = e.currentTarget.classList[0];
        loadTasks(filterColor)
    })
}

let delBtn = document.querySelector(".delete");

let deleteMode = false;

if (!localStorage.getItem('allTickets')) {
    let allTickets = {};
    allTickets = JSON.stringify(allTickets);

    localStorage.setItem('allTickets', allTickets);
}

loadTasks()

addBtn.addEventListener("click", function () {

    delBtn.classList.remove('delete-selected');
    deleteMode = false;

    let preModal = document.querySelector('.modal')
    if (preModal != null) return;

    let div = document.createElement("div");
    div.classList.add("modal");
    div.innerHTML =
        `<div class="task-section">
        <div class="task-inner-container" contenteditable="true"></div>
    </div>
    <div class="priority-section">
        <div class="priority-inner-container">
            <div class="modal-priority pink"></div>
            <div class="modal-priority green"></div>
            <div class="modal-priority blue"></div>
            <div class="modal-priority black selected"></div>
        </div>
    </div>`

    let ticketColor = "black"
    
    let allFilters = div.querySelectorAll('.modal-priority');
    for (let i = 0; i < allFilters.length; i++) {
        allFilters[i].addEventListener('click', function (e) {
            for (let j = 0; j < allFilters.length; j++) {
                allFilters[j].classList.remove('selected')
            }
            e.currentTarget.classList.add('selected')
            ticketColor = e.currentTarget.classList[1];
        });
    }

    let taskInnerContainer = div.querySelector('.task-inner-container')
    taskInnerContainer.addEventListener('keypress', function (e) {
        if (e.key == "Enter") {

            let id = uuid();
            let task = e.currentTarget.innerText;

            //step1=> jo bhi data hai localStorage mai usko lekr aao;
            let allTickets = localStorage.getItem('allTickets');
            allTickets = JSON.parse(allTickets);

            //step2 => usko update kro;

            let ticketObj = {
                color: ticketColor,
                taskValue: task,
            }

            allTickets[id] = ticketObj;

            //step3=> wapis update object ko store krdo;

            localStorage.setItem("allTickets", JSON.stringify(allTickets));

            let ticketDiv = document.createElement('div');
            ticketDiv.classList.add('ticket')

            ticketDiv.setAttribute('data-id', id);

            ticketDiv.innerHTML =
                `<div data-id="${id}" class="ticket-color ${ticketColor}"></div>
                    <div class="ticket-id">
                    #${id}
                    </div>
                <div data-id="${id}" class="actual-task" contentEditable="true">${e.currentTarget.innerText}</div>`

            let ticketColorDiv = ticketDiv.querySelector('.ticket-color');
            ticketColorDiv.addEventListener('click', function (e) {
                let currColor = e.currentTarget.classList[1];

                let index = -1
                for (let i = 0; i < colors.length; i++) {
                    if (colors[i] == currColor) index = i;
                }

                index++;
                index = index % 4;

                let newColor = colors[index];

                ticketColorDiv.classList.remove(currColor);
                ticketColorDiv.classList.add(newColor);

                //color change in local storage
                let currId = e.currentTarget.getAttribute('data-id');
                let allTickets = JSON.parse(localStorage.getItem('allTickets'));
                allTickets[currId].color = newColor;
                localStorage.setItem('allTickets', JSON.stringify(allTickets));

            });

            let actualTaskDiv = ticketDiv.querySelector('.actual-task');
            actualTaskDiv.addEventListener('input', function (e) {
                let updatedTask = e.currentTarget.innerText;

                let currId = e.currentTarget.getAttribute('data-id')
                let allTickets = JSON.parse(localStorage.getItem('allTickets'));

                allTickets[currId].taskValue = updatedTask;
                localStorage.setItem('allTickets', JSON.stringify(allTickets));
            })

            ticketDiv.addEventListener('click', function (e) {
                if (deleteMode == true) {

                    let currId = e.currentTarget.getAttribute('data-id');

                    let allTickets = JSON.parse(localStorage.getItem('allTickets'));

                    delete allTickets[currId];

                    localStorage.setItem('allTickets', JSON.stringify(allTickets))
                    e.currentTarget.remove();
                }
            })
            grid.append(ticketDiv);
            div.remove();
        }
    })

    body.append(div);
});

delBtn.addEventListener('click', function (e) {
    if (e.currentTarget.classList.contains("delete-selected")) {
        e.currentTarget.classList.remove("delete-selected");
        deleteMode = false;
    } else {
        e.currentTarget.classList.add('delete-selected');
        deleteMode = true;
    }
});


function loadTasks(color) {

    let ticketsOnUi = document.querySelectorAll(".ticket")

    for (let i = 0; i < ticketsOnUi.length; i++) {
        ticketsOnUi[i].remove();
    }
    //1- fetch all tickets data
    let allTickets = JSON.parse(localStorage.getItem("allTickets"))

    //2- create ticket UI for each ticket obj
    //3- attach required listeners
    //4- add tickets in the grid section of ui
    for (x in allTickets) {
        let currTicketId = x;
        let singleTicketObj = allTickets[x];

        if (color && color != singleTicketObj.color) continue

        let ticketDiv = document.createElement('div');
        ticketDiv.classList.add('ticket')

        ticketDiv.setAttribute('data-id', currTicketId);

        ticketDiv.innerHTML =
            `<div data-id="${currTicketId}" class="ticket-color ${singleTicketObj.color}"></div>
                    <div class="ticket-id">
                    #${currTicketId}
                    </div>
                <div data-id="${currTicketId}" class="actual-task" contentEditable="true">${singleTicketObj.taskValue}</div>`

        let ticketColorDiv = ticketDiv.querySelector('.ticket-color');
        let actualTaskDiv = ticketDiv.querySelector('.actual-task');
        actualTaskDiv.addEventListener('input', function (e) {
            let updatedTask = e.currentTarget.innerText;

            let currId = e.currentTarget.getAttribute('data-id')
            let allTickets = JSON.parse(localStorage.getItem('allTickets'));

            allTickets[currId].taskValue = updatedTask;
            localStorage.setItem('allTickets', JSON.stringify(allTickets));
        })

        ticketColorDiv.addEventListener('click', function (e) {
            let currColor = e.currentTarget.classList[1];

            let index = -1
            for (let i = 0; i < colors.length; i++) {
                if (colors[i] == currColor) index = i;
            }

            index++;
            index = index % 4;

            let newColor = colors[index];

            ticketColorDiv.classList.remove(currColor);
            ticketColorDiv.classList.add(newColor);

            //color change in local storage
            let currId = e.currentTarget.getAttribute('data-id');
            let allTickets = JSON.parse(localStorage.getItem('allTickets'));
            allTickets[currId].color = newColor;
            localStorage.setItem('allTickets', JSON.stringify(allTickets));

        });

        ticketDiv.addEventListener('click', function (e) {
            if (deleteMode == true) {

                let currId = e.currentTarget.getAttribute('data-id');

                let allTickets = JSON.parse(localStorage.getItem('allTickets'));

                delete allTickets[currId];

                localStorage.setItem('allTickets', JSON.stringify(allTickets))
                e.currentTarget.remove();
            }
        })

        grid.append(ticketDiv);
    }
}