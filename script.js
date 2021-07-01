
let addBtn = document.querySelector(".add");
let body = document.querySelector("body");

addBtn.addEventListener("click", function () {

    let preModal=document.querySelector('.modal')

    if(preModal!=null) return;
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
            console.log(e.currentTarget.innerText)
            console.log(ticketColor);
            div.remove()
        }
    })

    body.append(div);
});