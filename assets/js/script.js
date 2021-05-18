const tabsBtn = document.querySelectorAll(".header__tab");
const tab = document.querySelectorAll(".tab");
const openModalAddTaskBtn = document.querySelector(".open-modal-btn");
const modalAddTask = document.querySelector(".add-task");
const addSubTask = document.querySelector(".add-task__subtasks-btn");
const addSubTasksWrapper = document.querySelector(
  ".add-task__subtasks-wrapper"
);
const tabs = document.querySelector(".tabs");
const addTasksBtn = document.querySelector(".add-task__btn");
const addTaskTitleInp = document.querySelector(".add-task__title");
const addTaskDateInp = document.querySelector(".add-task__date");
const addTaskTimeInp = document.querySelector(".add-task__time");
const tasksWrapper = document.querySelector("#tasks");
const pastTasksWrapper = document.querySelector("#past-tasks");
const searchInp = document.querySelector(".header__search-inp");
const status1 = document.querySelector("#status-1");
const status2 = document.querySelector("#status-2");
const voiceSearch = document.querySelector("#voice-search");
const cssHref = document.querySelector("#theme-style");

const themeMode = () => {
  if (cssHref.getAttribute("href") == "assets/css/dark.css") {
    cssHref.href = "assets/css/light.css";
  } else if (cssHref.getAttribute("href") == "assets/css/light.css") {
    cssHref.href = "assets/css/dark.css";
  }
};

status1.addEventListener("click", themeMode);

const timeValue = () => {
  let date = new Date();
  let fullDate = `${date.getFullYear()}-${
    date.getMonth() < 10
      ? "0" + parseInt(date.getMonth() + 1)
      : date.getMonth() + 1
  }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;

  addTaskDateInp.setAttribute("min", fullDate);
  addTaskDateInp.value = fullDate;

  let fullTime = `${
    date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
  }:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;

  addTaskTimeInp.value = fullTime;
};

timeValue();

setInterval(() => {
  if (!addTaskTitleInp.value) {
    timeValue();
  }
}, 4000);

let tasks;
let pastTasks;

if (!localStorage.tasks) {
  tasks = [];
} else {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  addHtmlTemplate();
}

if (!localStorage.pastTasks) {
  pastTasks = [];
} else {
  pastTasks = JSON.parse(localStorage.getItem("pastTasks"));
  addPastHtmlTemplate();
}

const openModalConfirm = (index) => {
  const confirm = document.querySelectorAll("#tasks-confirm");
  confirm[index].classList.toggle("confirm-active");
};

const removeTask = (index) => {
  tasks.splice(index, 1);
  addHtmlTemplate();
  addLocalStorage();
  status();
};

const removePastTask = (index) => {
  pastTasks.splice(index, 1);
  addPastHtmlTemplate();
  addLocalStorage();
  status();
};

const openSubTasks = (index) => {
  let subTasks = document.querySelectorAll("#subtasks");
  let opensubTasksBtn = document.querySelectorAll("#open-subtasks");
  subTasks[index].classList.toggle("tasks__task-subtasks-open");
  opensubTasksBtn[index].classList.toggle("tasks__task-open-btn-active");
};

const openPastSubTasks = (index) => {
  let subTasks = document.querySelectorAll("#past-subtasks");
  let opensubTasksBtn = document.querySelectorAll("#open-past-subtasks");
  subTasks[index].classList.toggle("tasks__task-subtasks-open");
  opensubTasksBtn[index].classList.toggle("tasks__task-open-btn-active");
};

const completedTask = (index) => {
  if (tasks[index].completedSubTasks.every((elem) => elem == true)) {
    pastTasks.push(tasks[index]);
    tasks.splice(index, 1);
    addPastHtmlTemplate();
    status();
  } else {
    tasks[index].completed = false;
    const messageError = document.querySelector(".message-error");
    messageError.classList.add("message-error_active");
    setTimeout(() => {
      messageError.classList.remove("message-error_active");
    }, 2500);
  }
  addHtmlTemplate();
  addLocalStorage();
};

const completedSubTask = (index, i) => {
  tasks[index].completedSubTasks[i] = !tasks[index].completedSubTasks[i];
  addLocalStorage();
};

const addLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("pastTasks", JSON.stringify(pastTasks));
};

function addHtmlTemplate() {
  tasksWrapper.innerHTML = "";
  tasks.forEach((item, index) => {
    tasksWrapper.innerHTML += `
    <div class="tasks__task">
    
       <div class="confirm" id="tasks-confirm">
         <div class="confirm-content">
            <p>Вы уверены ?</p>
            <div class="confirm-btns">
              <button onclick="openModalConfirm(${index})">Нет</button>
              <button onclick="removeTask(${index})">Да</button>
            </div>
         </div>
       </div>

       <div class="tasks__task-header">
         <input type="checkbox" id="task-1" class="completed" onclick="completedTask(${index})" />
         <a href="http://maps.google.com/maps?q=${item.loc.loc}" target="_blank"><img src="assets/icons/map.svg">${item.loc.city}</a>
         <button class="tasks__remove" onclick="openModalConfirm(${index})">+</button>
       </div>
       <h2 class="tasks__task-title">${item.title}</h2>
       <div class="tasks__task-open">
         <div class="tasks__task-open-btn" id="open-subtasks" onclick="openSubTasks(${index})">
           <p>Раскрыть</p>
           <img src="assets/icons/arrow.svg" alt="arrow" />
         </div>
         <div class="tasks__task-date">${item.date}</div>
       </div>
       <div class="tasks__task-subtasks" id="subtasks"></div>
  </div>
    `;
    console.log(item.loc);
    const addSubtasks = document.querySelectorAll("#subtasks");
    addSubtasks[index].innerHTML = "";
    item.subTasks.forEach((item, i) => {
      addSubtasks[index].innerHTML += `
        <div class="tasks__task-subtask">
          <p>${item}</p>
          <input type="checkbox" class="completed" onclick="completedSubTask(${index}, ${i})" ${
        tasks[index].completedSubTasks[i] ? "checked" : ""
      }/>
        </div>
        `;
    });
  });
}

function addPastHtmlTemplate() {
  pastTasksWrapper.innerHTML = "";
  pastTasks.forEach((item, index) => {
    pastTasksWrapper.innerHTML += `
    <div class="tasks__task">
       <div class="tasks__task-header">
         <a href="http://maps.google.com/maps?q=${item.loc.loc}" target="_blank"><img src="assets/icons/map.svg">${item.loc.city}</a>
         <button class="tasks__remove" onclick="removePastTask(${index})">+</button>
       </div>
       <h2 class="tasks__task-title">${item.title}</h2>
       <div class="tasks__task-open">
         <div class="tasks__task-open-btn" id="open-past-subtasks" onclick="openPastSubTasks(${index})">
           <p>Раскрыть</p>
           <img src="assets/icons/arrow.svg" alt="arrow" />
         </div>
         <div class="tasks__task-date">${item.date}</div>
       </div>
       <div class="tasks__task-subtasks" id="past-subtasks"></div>
  </div>
    `;

    const addSubtasks = document.querySelectorAll("#past-subtasks");
    addSubtasks[index].innerHTML = "";
    item.subTasks.forEach((item, i) => {
      addSubtasks[index].innerHTML += `
        <div class="tasks__task-subtask">
          <p>${item}</p>
        </div>
        `;
    });
  });
}

const status = () => {
  if (!tasks.length) {
    status1.textContent = "Задач пока нет";
  } else {
    status1.textContent = "Все задачи";
  }

  if (!pastTasks.length) {
    status2.textContent = "Выполененных пока нет";
  } else {
    status2.textContent = "Все выполененные задачи";
  }
};
status();

tabsBtn.forEach((item, index) => {
  item.addEventListener("click", () => {
    tab.forEach((item, index) => {
      item.classList.remove("tab-active");
      tabsBtn[index].classList.remove("header__tab-active");
    });
    tab[index].classList.add("tab-active");
    item.classList.add("header__tab-active");
  });
});

openModalAddTaskBtn.addEventListener("click", () => {
  openModalAddTaskBtn.classList.toggle("open-modal-btn-close");
  modalAddTask.classList.toggle("add-task-open");
  tabs.classList.toggle("tabs-none");
});

let indexInput = 0;
addSubTask.addEventListener("click", () => {
  indexInput++;
  const createDiv = document.createElement("div");
  const createInput = document.createElement("input");
  const createButton = document.createElement("button");
  createDiv.className = "add-task__subtasks-form";
  createInput.placeholder = `Подзадача`;
  createInput.className = "sub-task-inp";
  createButton.textContent = "+";
  createButton.className = "add-task__subtasks-remove";
  createDiv.append(createInput, createButton);
  addSubTasksWrapper.appendChild(createDiv);
  removeSubInp();
});

const removeSubInp = () => {
  const removeInpSubTasksBtn = document.querySelectorAll(
    ".add-task__subtasks-remove"
  );
  const removeInpSubTasks = document.querySelectorAll(
    ".add-task__subtasks-form"
  );
  removeInpSubTasksBtn.forEach((item, index) => {
    item.addEventListener("click", () => {
      removeInpSubTasks[index].remove();
    });
  });
};

const removeAllSubInp = () => {
  const removeInpSubTasks = document.querySelectorAll(
    ".add-task__subtasks-form"
  );
  removeInpSubTasks.forEach((item, index) => {
    removeInpSubTasks[index].remove();
  });
};

const search = () => {
  const tasksSearch = document.querySelectorAll(".tasks__task");
  tasksSearch.forEach((item, index) => {
    const title = item.querySelector(".tasks__task-title");
    const date = item.querySelector(".tasks__task-date");
    if (
      title.innerHTML.toUpperCase().indexOf(searchInp.value.toUpperCase()) >
        -1 ||
      date.innerHTML.indexOf(searchInp.value) > -1
    ) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
};

searchInp.addEventListener("input", search);

const voice = () => {
  let recognizer = new webkitSpeechRecognition();

  // Ставим опцию, чтобы распознавание началось ещё до того, как пользователь закончит говорить
  recognizer.interimResults = true;

  // Какой язык будем распознавать?
  recognizer.lang = "ru-Ru";

  // Используем колбек для обработки результатов
  recognizer.onresult = function (event) {
    let result = event.results[event.resultIndex];
    if (result.isFinal) {
      searchInp.value = result[0].transcript;
      if (
        result[0].transcript.toLowerCase() == "белый" ||
        result[0].transcript.toLowerCase() == "светлый" ||
        result[0].transcript.toLowerCase() == "белый фон" ||
        result[0].transcript.toLowerCase() == "светлый фон" ||
        result[0].transcript.toLowerCase() == "белый цвет" ||
        result[0].transcript.toLowerCase() == "светлый цвет"
      ) {
        cssHref.href = "assets/css/light.css";
      } else if (
        result[0].transcript.toLowerCase() == "чёрный" ||
        result[0].transcript.toLowerCase() == "тёмный" ||
        result[0].transcript.toLowerCase() == "чёрный фон" ||
        result[0].transcript.toLowerCase() == "тёмный фон" ||
        result[0].transcript.toLowerCase() == "чёрный цвет" ||
        result[0].transcript.toLowerCase() == "тёмный цвет"
      ) {
        cssHref.href = "assets/css/dark.css";
      } else {
        search();
      }
    } else {
      searchInp.value = result[0].transcript;
      console.log("Промежуточный результат: ", result[0].transcript);
    }
  };

  // Начинаем слушать микрофон и распознавать голос
  recognizer.start();
};

voiceSearch.addEventListener("click", voice);

let myLocation = "";
fetch("https://ipinfo.io/json?token=2637b2b72b92fe")
  .then((response) => response.json())
  .then((res) => {
    myLocation = res;
  });

addTasksBtn.addEventListener("click", () => {
  if (!addTaskTitleInp.value || addTaskTitleInp.value == " ") return;
  let task = {
    title: addTaskTitleInp.value,
    loc: myLocation,
    date: addTaskDateInp.value + " " + addTaskTimeInp.value,
    completed: false,
    subTasks: [],
    completedSubTasks: [],
  };

  const subTaskInp = document.querySelectorAll(".sub-task-inp");
  subTaskInp.forEach((item, index) => {
    task.subTasks.push(item.value);
    task.completedSubTasks.push(false);
    item.value = "";
  });
  tasks.push(task);
  addHtmlTemplate();
  addLocalStorage();
  status();
  openModalAddTaskBtn.classList.remove("open-modal-btn-close");
  modalAddTask.classList.remove("add-task-open");
  tabs.classList.remove("tabs-none");
  addTaskTitleInp.value = "";
  timeValue();
  removeAllSubInp();
});
