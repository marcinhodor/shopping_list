const fs = require("fs");
const input = require("prompt-sync")({ sigint: true });
const colors = require("colors");

interface Item {
  title: string;
  active: boolean;
}

const filePath = "./db/list.json";

const saveToJson = (list: Item[]) => {
  try {
    const json = JSON.stringify({ list });
    fs.writeFileSync(filePath, json, "utf8");
  } catch (error) {
    console.log("DB write error: ", error);
  }
};

const readFile = (): Item[] => {
  let items: Item[] = [];
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(data);
    items = jsonData.list;
  } catch (error) {
    console.log("DB read error: ", error);
  }
  return items;
};

const addItem = (title: string) => {
  let itemsList = readFile();
  itemsList = [...itemsList, { title, active: true }];
  saveToJson(itemsList);
};

const toggleItem = (title: string) => {
  const itemsList = readFile();
  let itemsTitleArray: string[] = [];
  itemsList.forEach(
    (item) => (itemsTitleArray = [...itemsTitleArray, item.title])
  );
  if (!checkIfArrayIncludes(title, itemsTitleArray)) {
    return;
  }
  console.log(`'${title}' toggled`);
  itemsList.map((item) =>
    item.title === title ? (item.active = !item.active) : item.active
  );
  saveToJson(itemsList);
};

const deleteItem = (title: string) => {
  const itemsList = readFile();
  let itemsTitleArray: string[] = [];
  itemsList.forEach(
    (item) => (itemsTitleArray = [...itemsTitleArray, item.title])
  );
  if (!checkIfArrayIncludes(title, itemsTitleArray)) {
    return;
  }
  console.log(`'${title}' deleted`);
  const newList = itemsList.filter((item) => item.title !== title);
  saveToJson(newList);
};

const checkIfArrayIncludes = (item: string, array: string[]): boolean => {
  if (!array.includes(item)) {
    console.log("Item doesn't exists in the list!");
    return false;
  }
  return true;
};

// App start
let appRunning = true;

while (appRunning) {
  const decision = input(
    "Choose an option: 1=Show 2=Add 3=Toggle active/inactive 4=Delete 0=Exit "
  );

  switch (decision) {
    case "0":
      appRunning = false;
      break;
    case "1":
      console.log("\n");
      readFile().forEach((item) =>
        item.active
          ? console.log(
              colors.bgBlack.blue(`${item.title}:`),
              " ",
              colors.green("active")
            )
          : console.log(
              colors.bgBlack.blue(`${item.title}:`),
              " ",
              colors.red("inactive")
            )
      );
      console.log("\n");
      break;
    case "2":
      var titleInput = input("Title: ");
      titleInput && addItem(titleInput);
      break;
    case "3":
      var titleInput = input("Title: ");
      titleInput && toggleItem(titleInput);
      break;
    case "4":
      var titleInput = input("Title: ");
      titleInput && deleteItem(titleInput);
      break;
    default:
      console.log("Provide a valid option.");
      break;
  }
}
