function simpleArraySum(arrNum) {
    // Write your code here
    var sum = 0;
    return "Sum: " + arrNum.reduce(((sum,index) => sum+=index),0);
}

var arrNum = [18, 25, 3, 4, 10, 11];
const result = simpleArraySum(arrNum);
console.log(result);