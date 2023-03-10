var totalPushCountsPerUser = 0;
var totalPushCountsPerRepo = 0;
var currentGitUserName = "";
var currentFileName = "";
var currentBatchData = new Array();

function getBatchDetails(fileName) {
    setDIVVisibility("userDetails", fileName);
    setResultTableToInit("userResultTable");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let fileData = this.responseText
            let dataINArray = fileData.toString().split('\r\n');

            for (let i = 0; i < dataINArray.length; i++) {
                let splitedArray = dataINArray[i].split(',');
                addRowTOResultTable("userResultTable", splitedArray, i);
                calculateAggregateData(splitedArray[0], splitedArray[1], i);
            }
        }
    };
    xhttp.open('GET', fileName, true);
    xhttp.send();
}

function getUserDetails(gitUserName) {
    setDIVVisibility("repoDetails");
    var totalPushCount = 0;
    var objectRepoTable = document.getElementById('repoResultTable');

    gitUserName = gitUserName.trim();
    var url = `https://api.github.com/users/${gitUserName}/repos`;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            var outputData = JSON.parse(this.responseText);

            setResultTableToInit("repoResultTable");
            //sort User Repositories on basis of recent Push-Dates
            for (let i = 0; i < outputData.length; i++) {
                for (let j = 0; j < outputData.length; j++) {
                    if (outputData[i].pushed_at > outputData[j].pushed_at) {
                        var tmp = outputData[i];
                        outputData[i] = outputData[j];
                        outputData[j] = tmp;
                    }
                }
            }

            //Display data on table
            for (let i = 0; i < outputData.length; i++) {
                var repoPushCounts = getRepoDetails(outputData[i].commits_url, i);
                totalPushCount += repoPushCounts;
                var columnData = [];

                columnData.push(outputData[i].name);
                columnData.push(displaytDateOnly(outputData[i].created_at));
                columnData.push(displaytDateOnly(outputData[i].pushed_at));
                columnData.push(repoPushCounts);
                addRowTOResultTable("repoResultTable", columnData, i);
            }
        } else if (this.status == 404) {
            alert(`Inalid User Name! - ${gitUserName}`);
        } else if (this.status == 403) {
            alert(`API access limit is exceeded!`);
        }
    }
    xhr.send();
}

function displaytDateOnly(stringDate) {
    stringDate = new Date(stringDate);
    return (stringDate.getDate() + "-" + stringDate.toLocaleString('default', { month: 'short' }) + "-" + stringDate.getFullYear());
    // return (String(stringDate).substring(0, (String(stringDate).search("T"))));
}

function getRepoDetails(stringCommitURL, index) {
    var pushCounts = 0;
    stringCommitURL = String(stringCommitURL).substring(0, String(stringCommitURL).search("{/sha}"))

    var xhrRepoData = new XMLHttpRequest();
    xhrRepoData.open("GET", stringCommitURL, true);
    xhrRepoData.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            var outputData = JSON.parse(this.responseText);

            outputData.forEach(repoData => {
                pushCounts++;
            });
            let outputPushCounts = document.getElementById("pushCount" + index);
            outputPushCounts.innerHTML = pushCounts;
        } else if (this.status == 404) {
            alert(`Inalid Repository!`);
        } else if (this.status == 403) {
            alert(`API access limit is exceeded!`);
        }
    }
    xhrRepoData.send();
}

function setDIVVisibility(displayDIVID, fileName) {

    var objectUserDIV = document.getElementById('userDetails');
    var objectRepoDIV = document.getElementById('repoDetails');
    var objectHomeDIV = document.getElementById('homeMessage');
    var objectUploadCSV = document.getElementById('updateCSVDataButton');
    var objectFileName = document.getElementById('fileName');
    var objectCSVUpdatedDate = document.getElementById('CSVUpdatedDate');
    currentFileName = fileName;

    if (displayDIVID == "userDetails") {
        objectUserDIV.style.visibility = "visible";
        objectRepoDIV.style.visibility = "hidden";
        objectHomeDIV.style.visibility = "hidden";
        objectFileName.innerHTML = "File Name: " + fileName;
        objectCSVUpdatedDate.innerHTML = "CSV Files last updated on : " + getFileUpdateDate(fileName);
        objectUploadCSV.style.pointerEvents = "auto";
        objectUploadCSV.style.backgroundColor = "";


    } else if (displayDIVID == "repoDetails") {
        objectUserDIV.style.visibility = "hidden";
        objectRepoDIV.style.visibility = "visible";
        objectHomeDIV.style.visibility = "hidden";
        objectUploadCSV.style.pointerEvents = "none";
        objectUploadCSV.style.backgroundColor = "#f0ecec";
    }
}

function setResultTableToInit(resultTableID) {
    var objectResultTable = document.getElementById(resultTableID);

    if (resultTableID == "userResultTable") {
        objectResultTable.innerHTML = "<thead><tr><td style='width: 26%; border-radius: 5px 0 0 0'><h4>Learner Name</h4></td>"
            + "<td style='width: 26%; border-radius: 0 0 0 0'><h4>GitHub UserName</h4></td>"
            + "<td style='width: 16%; border-radius: 0 0 0 0'><h4>Total Repositories</h4></td>"
            + "<td style='width: 16%; border-radius: 0 0 0 0'><h4>Last Commit Date</h4></td>"
            + "<td style='width: 16%; border-radius: 0 5px 0 0'><h4>Total Push Counts</h4></td></tr></thead>"

    } else if (resultTableID == "repoResultTable") {
        objectResultTable.innerHTML = "<thead><tr><td style='width: 30%; border-radius: 5px 0 0 0'><h4>Repository Name</h4></td>"
            + "<td style='width: 20%; border-radius: 0 0 0 0'><h4>Created Date</h4></td>"
            + "<td style='width: 20%; border-radius: 0 0 0 0'><h4>Recent Push Date</h4></td>"
            + "<td style='width: 30%; border-radius: 0 5px 0 0'><h4>Total Push Counts</h4></td></thead></tr>";
    }
}

function addRowTOResultTable(resultTableID, columnData, index) {
    var objectResultTable = document.getElementById(resultTableID);
    if (resultTableID == "userResultTable") {
        objectResultTable.innerHTML += `<tr><td id='userName${index}'><h4 style='font-weight: normal;'><a style='text-decoration: underline; cursor:pointer; color:blue;' onclick="getUserDetails(' ${columnData[1]} ')"> ${columnData[0]} </a></h4></td>`
            + `<td id='userGitAcc${index}'><h4 style='font-weight: normal;'> ${columnData[1]}</h4></td>`
            + `<td id='repoCount${index}'><h4 style='font-weight: normal;'>${columnData[2]}</h4></td>`
            + `<td id='recentCommitDate${index}'><h4 style='font-weight: normal;'>${columnData[3]}</h4></td>`
            + `<td id='totalPushCount${index}'><h4 style='font-weight: normal;'>${columnData[4]}</h4></td></tr>`;
    } if (resultTableID == "repoResultTable") {
        objectResultTable.innerHTML += `<tr><td id='repoName${index}' ><h4 style='font-weight: normal;'><a style='text-decoration: underline; cursor:pointer; color:blue;' > ${columnData[0]} </a></h4></td>`
            + `<td id='createdDate${index}'><h4 style='font-weight: normal;'> ${columnData[1]}</h4></td>`
            + `<td id='updatedDate${index}> <h4 style='font-weight: normal;'> ${columnData[2]} </h4></td>`
            + `<td id='pushCount${index}'><h4 style='font-weight: normal;'>${columnData[3]} </h4></td><tr>`
    }
}

function calculateAggregateData(learnerName, gitUserName, index) {
    var totalPushCount = 0;
    var totalRepoCount = 0;
    var currentUserData = new Array();
    var objectTotalPushCount = document.getElementById('totalPushCount' + index);
    var objectRecentPushDate = document.getElementById('recentCommitDate' + index);
    var objectTotalRepoCount = document.getElementById('repoCount' + index);

    currentUserData.push(learnerName);
    currentUserData.push(gitUserName);
    currentGitUserName = gitUserName.trim();
    var url = `https://api.github.com/users/${gitUserName}/repos`;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            var outputData = JSON.parse(this.responseText);

            //Display recent Push-Date
            var recentPushDate = outputData[0].pushed_at;
            for (let i = 0; i < outputData.length; i++)
                recentPushDate = (recentPushDate > outputData[i].pushed_at) ? recentPushDate : outputData[i].pushed_at;


            //Display total Push-Count
            for (let i = 0; i < outputData.length; i++) {
                totalRepoCount++;
                fetchRepoDetails(outputData[i].commits_url, i);
                totalPushCount += totalPushCountsPerRepo;
            }
            currentUserData.push(totalRepoCount);
            currentUserData.push(displaytDateOnly(recentPushDate));
            currentUserData.push(totalPushCount);
            currentBatchData.push(currentUserData);

            console.log(currentGitUserName = " - Total Rpos: " + totalRepoCount + "recent Push: " + displaytDateOnly(recentPushDate) + "Total Push counts: " + totalPushCount);
            objectTotalPushCount.innerHTML = totalPushCount;
            objectRecentPushDate.innerHTML = displaytDateOnly(recentPushDate);
            objectTotalRepoCount.innerHTML = totalRepoCount;

        } else if (this.status == 404) {
            alert(`Inalid User Name! - ${currentGitUserName}`);
        } else if (this.status == 403) {
            alert(`API access limit is exceeded!`);
        }
    }
    xhr.send();
}

function getFileUpdateDate(fileName) {


}

function fetchRepoDetails(stringCommitURL, index) {
    var pushCounts = 0;
    stringCommitURL = String(stringCommitURL).substring(0, String(stringCommitURL).search("{/sha}"))

    var xhrRepoData = new XMLHttpRequest();
    xhrRepoData.open("GET", stringCommitURL, true);
    xhrRepoData.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            var outputData = JSON.parse(this.responseText);

            outputData.forEach(repoData => {
                pushCounts++;
            });
            totalPushCountsPerRepo = pushCounts;
            console.log("fetchRepo: " + pushCounts);
        } else if (this.status == 404) {
            alert(`Inalid Repository!`);
        } else if (this.status == 403) {
            alert(`API access limit is exceeded!`);
        }
    }
    xhrRepoData.send();

}

function updateCSVData(fileName){
    console.log("Current File Name: " + currentFileName);
    console.log(currentBatchData);
}