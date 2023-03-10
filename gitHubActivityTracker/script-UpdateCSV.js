//Function to read data from CSV file - and push each line into an Array 

// function updateCSVData(fileName){
//     console.log(fileName);

//     let fs = require('fs');
//     fs.readFile(fileName,function(err,data){
//         console.log(data.toString());
//         let dataINArray = data.toString().split('\r\n');
//         console.log(dataINArray);
//     });
// }

// updateCSVData("./Data/FSD02.csv");
//-----------------------------------------------------------------------------------------------------

//Function to update CSV file
function updateCSVData(fileName, newFileData) {
    let fs = require('fs');

    fs.writeFile(fileName, newFileData, function (err) {
        if (err) {
            console.log(err);
        }
        alert("File contents updated suceessfully!");
    });
}

export { updateCSVData };