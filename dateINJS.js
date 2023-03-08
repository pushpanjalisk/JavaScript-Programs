let stringDate = new Date("2023-03-04T11:47:12Z");
let stringDateOne = new Date("2023-03-04");
console.log(stringDate.getDate() + "-" + stringDate.toLocaleString('default', { month: 'short' }) + "-" + stringDate.getFullYear());
console.log(stringDateOne.getDate() + "-" + stringDateOne.toLocaleString('default', { month: 'short' }) + "-" + stringDateOne.getFullYear());