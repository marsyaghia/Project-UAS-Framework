const API_URL = "http://127.0.0.1:8000/api/task/";
const TOKEN = "120e859567d04fc11a519777ff5148cd211fb366"; // tanpa kata Token

function showDivisionsWithDelay() {
  const cardDivisions = document.querySelectorAll(".cardtemp");
  const delay = 300;
  cardDivisions.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = 1;
    }, (index + 1) * delay);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const deadlineEl = document.getElementById("deadline");
  if (deadlineEl) deadlineEl.value = new Date().toISOString().slice(0, 16);

  const taskContainer = document.getElementById("TaskContainer");
  const addButton = document.querySelector(".bx-plus");
  const titleInput = document.getElementById("title");
  const deadlineInput = document.getElementById("deadline");
  const descriptionInput = document.getElementById("description");
  const statusSelect = document.getElementById("status");
  const titleLink = document.getElementById("header_title");
  const thisWeekLink = document.getElementById("o1");
  const thisMonthLink = document.getElementById("o2");
  const otherLink = document.getElementById("o3");

  async function getTasksFromAPI() {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Token 120e859567d04fc11a519777ff5148cd211fb366`,
      },
    });
    return await response.json();
  }

  async function getDetailTasksFromAPI(id) {
    const response = await fetch(`http://127.0.0.1:8000/api/task/${id}`, {
      headers: {
        Authorization: `Token 120e859567d04fc11a519777ff5148cd211fb366`,
      },
    });
    return await response.json();
  }

  async function saveData() {
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const deadlineVal = deadlineInput.value;
    const statusVal = statusSelect.value || "pending";

    if (!title) {
      swal({
        title: "Error",
        text: "Please enter a task title!",
        icon: "error",
      });
      return;
    }

    const payload = {
      title,
      description,
      deadline: deadlineVal ? new Date(deadlineVal).toISOString() : null,
      status: statusVal,
    };

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token 120e859567d04fc11a519777ff5148cd211fb366`,
      },
      body: JSON.stringify(payload),
    });

    titleInput.value = "";
    descriptionInput.value = "";
    deadlineInput.value = "";
    statusSelect.value = "pending";

    displayTasks(currentSection);
  }

  addButton.addEventListener("click", saveData);

  function isToday(dateString) {
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
  }

  const displayTasks = async (section) => {
    if (!section.match(/^\d+$/)) {
      currentSection = section;

      const response = await getTasksFromAPI();
      const tasks = response.results || response;
      let filtered = tasks || [];

      switch (section) {
        case "thisWeek":
          titleLink.textContent = "Current Week";
          const now = new Date();
          const day = now.getDay();
          const start = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - day
          );
          const end = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - day + 6,
            23,
            59,
            59
          );
          filtered = filtered.filter(
            (t) =>
              t.deadline &&
              new Date(t.deadline) >= start &&
              new Date(t.deadline) <= end
          );
          break;
        case "thisMonth":
          titleLink.textContent = "Current Month";
          filtered = filtered.filter(
            (t) =>
              t.deadline &&
              new Date(t.deadline).getMonth() === new Date().getMonth()
          );
          break;
        default:
          titleLink.textContent = "All Tasks";
      }

      if (taskContainer) {
        taskContainer.innerHTML = filtered
          .map((task) => {
            const done = task.status === "done";
            const dateLabel = task.deadline
              ? isToday(task.deadline)
                ? "Today"
                : `<i class='bx bx-calendar-alt'></i> ${task.deadline.replace(
                    "T",
                    " "
                  )}`
              : "";

            return `
                <div class="cardtemp align detailtask" data-task-id="${
                  task.id
                }">
                    <input type="checkbox" ${done ? "checked" : ""} />
                    <div class="${done ? "marker done" : "marker"}">
                        <span>${task.title}</span>
                        <p class="date">${dateLabel}</p>
                    </div>
                    <i class="bx bx-trash-alt"></i>
                </div>
                `;
          })
          .join("");

        showDivisionsWithDelay();
      }
    } else {
      const response = await getDetailTasksFromAPI(section);
      const tasks = response.results || response;
      let filtered = tasks || [];
      titleLink.textContent = "Detail Task " + response.title;

      if (taskContainer) {
        const task = filtered;
        const done = task.status === "done";
        const dateLabel = task.deadline
          ? isToday(task.deadline)
            ? "Today"
            : `<i class='bx bx-calendar-alt'></i> ${task.deadline.replace(
                "T",
                " "
              )}`
          : "";

        const logs = task.logs || [];
        const logHTML =
          logs.length === 1
            ? (taskContainer.innerHTML = `
          <div class="cardtemp align detailtask" data-task-id="${logs[0].id}">
            <input type="checkbox" ${done ? "checked" : ""} />
            <div class="${done ? "marker done" : "marker"}">
              <span>${logs[0].message}</span>
              <p class="date">${dateLabel}</p>
            </div>
            <i class="bx bx-trash-alt"></i>
          </div>
        `)
            : (taskContainer.innerHTML = logs
                .map((detailtask) => {
                  const done = task.status === "done";
                  const dateLabel = task.deadline
                    ? isToday(task.deadline)
                      ? "Today"
                      : `<i class='bx bx-calendar-alt'></i> ${task.deadline.replace(
                          "T",
                          " "
                        )}`
                    : "";

                  return `
                <div class="cardtemp align detailtask" data-task-id="${
                  detailtask.id
                }">
                    <input type="checkbox" ${done ? "checked" : ""} />
                    <div class="${done ? "marker done" : "marker"}">
                        <span>${detailtask.message}</span>
                        <p class="date">${dateLabel}</p>
                    </div>
                    <i class="bx bx-trash-alt"></i>
                </div>
                `;
                })
                .join(""));

        showDivisionsWithDelay();
      }
    }
  };

  if (taskContainer) {
    taskContainer.addEventListener("click", async (event) => {
      if (event.target.classList.contains("bx-trash-alt")) {
        const taskId = event.target.closest(".cardtemp").dataset.taskId;
        swal({
          title: "Delete this task?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then(async (willDelete) => {
          if (willDelete) {
            await fetch(`${API_URL}${taskId}/`, {
              method: "DELETE",
              headers: {
                Authorization: `Token 120e859567d04fc11a519777ff5148cd211fb366`,
              },
            });
            swal("Poof! Your task has been deleted!", {
              icon: "success",
            });
            displayTasks(currentSection);
          }
        });
      }

      if (event.target.classList.contains("detailtask")) {
        const taskId = event.target.closest(".cardtemp").dataset.taskId;
        currentSection = taskId;
        swal({
          title: "Lihat detail task ini?",
          icon: "info",
          buttons: true,
          dangerMode: true,
        }).then(async (willDetail) => {
          if (willDetail) {
            displayTasks(currentSection);
          }
        });
      }
    });
  }

  thisWeekLink.addEventListener("click", () => displayTasks("thisWeek"));
  thisMonthLink.addEventListener("click", () => displayTasks("thisMonth"));
  otherLink.addEventListener("click", () => displayTasks("other"));

  let currentSection = "other";
  displayTasks(currentSection);
});
