let arrNums = [12, 42, 23, 74, 135, 66, 47, 18, 9, 50];

// Approach 1: Traversing each array element: 
min = arrNums[0];
max = arrNums[0];

for (let i = 0; i < arrNums.length; i++) {
    min = (min < arrNums[i]) ? min : arrNums[i];
    max = (max > arrNums[i]) ? max : arrNums[i];
}

console.log("\nApproach 1: Traversing each array element: ");
console.log("Min: " + min + " | Max: " + max);

// Approach 2: using Math.min and Math.max Functions:
var min = Math.min(...arrNums);
var max = Math.max(...arrNums);

console.log("\nApproach 2: using Math.min and Math.max Methods: ");
console.log("Min: " + min + " | Max: " + max);


// Approach 3: using Array.Reduce Method:
min = arrNums.reduce(((minNum, index) => (minNum < index) ? minNum : index), arrNums[0]);
max = arrNums.reduce(((maxNum, index) => (maxNum > index) ? maxNum : index), arrNums[0]);

console.log("\nApproach 3: using Array.Reduce Method: ");
console.log("Min: " + min + " | Max: " + max);

// Approach 4: using Array.sort Method:
arrNums.sort((a, b) => (a - b));
min = arrNums[0];
max = arrNums[arrNums.length - 1];
console.log("\nApproach 4: using Array.sort Method: ");
console.log("Min: " + min + " | Max: " + max);
console.log(arrNums);