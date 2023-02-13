`use strict`;
class ToDoApp {
    static id = 0;
    static dataKey = "formData";

    static form = document.querySelector("#todoForm");
    static todoItems = document.querySelector("#todoItems");

    static renderToDoItems(item) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("col-4");
        wrapper.setAttribute("data-id", item.id);
        wrapper.innerHTML = `
      <div class="taskWrapper">
        <div class="taskHeading">${item.title}</div>
        <div class="taskDescription">${item.description}</div>
      </div>
    `;
        ToDoApp.todoItems.prepend(wrapper);
        return wrapper;
    }

    static init() {
        ToDoApp.form.addEventListener("submit", (evt) => {
            evt.preventDefault();
            evt.stopPropagation();

            const formData = Array.from(evt.target.elements)
                .reduce((accumulator, item) => {
                    accumulator[item.name] = item.value;
                    return accumulator;
                }, {});

            formData.id = ++ToDoApp.id;

            const storageData =
                localStorage.getItem(ToDoApp.dataKey) &&
                JSON.parse(localStorage.getItem(ToDoApp.dataKey)).length
                    ? JSON.parse(localStorage.getItem(ToDoApp.dataKey))
                    : [];

            storageData.push(formData);
            localStorage.setItem(ToDoApp.dataKey, JSON.stringify(storageData));
            ToDoApp.renderToDoItems(formData);
        });

        document.addEventListener("DOMContentLoaded", () => {
            if (!localStorage.getItem(ToDoApp.dataKey)) return;

            const storageData = JSON.parse(localStorage.getItem(ToDoApp.dataKey));
            storageData.forEach((item) => ToDoApp.renderToDoItems(item));
        });

        ToDoApp.todoItems.addEventListener("click", (evt) => {
            evt.stopPropagation();
            const currentItem = evt.target.closest("[data-id]");
            if (currentItem === null) return;
            const currentItemId = +currentItem.getAttribute("data-id");
            const filteringItem = JSON.parse(
                localStorage.getItem(ToDoApp.dataKey)
            ).filter((item) => item.id !== currentItemId);
            localStorage.setItem(ToDoApp.dataKey, JSON.stringify(filteringItem));
            currentItem.remove();
        });
    }
}

ToDoApp.init();
