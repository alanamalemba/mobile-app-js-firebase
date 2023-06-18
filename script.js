import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://mobile-app-js-firebase-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const itemsInDB = ref(database, "items");

const inputField = document.querySelector("#input-field");
const addButton = document.querySelector("#add-button");
const itemsList = document.querySelector(".items-list");

const infoButton = document.querySelector(".info-button");
const infoDiv = document.querySelector(".info-div");

infoButton.addEventListener("click", () => {
  infoDiv.classList.remove("hidden");
  setTimeout(() => {
    infoDiv.classList.add("hidden");
  }, 5000);
});

onValue(itemsInDB, (snapshot) => {
  if (!snapshot.exists()) {
    return (itemsList.textContent = "No items here... yet!");
  }

  let itemsArray = Object.entries(snapshot.val());

  clearItemsList();

  for (let i = 0; i < itemsArray.length; i++) {
    let currentItem = itemsArray[i];
    let currentItemID = currentItem[0];
    let currentItemName = currentItem[1];
    displayNewListItem(currentItem);
  }
});

addButton.addEventListener("click", () => {
  if (inputField.value === "") return;
  let inputValue = inputField.value;
  push(itemsInDB, inputValue);

  clearInputField();
});

function clearItemsList() {
  itemsList.innerHTML = "";
}

function clearInputField() {
  inputField.value = "";
}

function displayNewListItem(item) {
  const itemID = item[0];
  const itemName = item[1];

  const newItem = document.createElement("li");
  newItem.textContent = itemName;
  itemsList.appendChild(newItem);

  newItem.addEventListener("dblclick", () => {
    let referenceToItemInDB = ref(database, `items/${itemID}`);
    remove(referenceToItemInDB);
  });
}
