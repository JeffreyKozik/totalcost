// REFACTOR ALL OF THE CODE

// https://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript
Date.prototype.today = function(){
    return (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + "/" + ((this.getDate() < 10)?"0":"") + this.getDate() + "/" + this.getFullYear();
}
Date.prototype.timeNow = function(){
    return ((this.getHours() < 10)?"0":"") +
           ((this.getHours()>12)?(this.getHours()-12):this.getHours()) + ":"+
           ((this.getMinutes() < 10)?"0":"") + this.getMinutes() + ":" +
           ((this.getSeconds() < 10)?"0":"") + this.getSeconds() +
           ((this.getHours()>12)?('PM'):'AM');
}

function extractSingleTotal(subdomainName, tab){
    // let totalPaymentString = postRequestTest(subdomainName);
    // subdomainName = "'" + subdomainName + "'";
    // setTimeout(function() {
    //     chrome.storage.sync.set({subdomainName: totalPaymentString}, function() { });
    // }, 10000);
    // chrome.tabs.reload(tab.id);
    // setTimeout(function() {
    // }, 0); //previously 10000
    // chrome.tabs.executeScript(tab.id, {code: "pageTree = document.getElementById('page-tree'); unorderedList = pageTree.firstChild; dashboardBullet = unorderedList.firstChild; dashboardDiv = dashboardBullet.firstChild; dashboardSpan = dashboardDiv.firstChild; dashboardLink = dashboardSpan.firstChild; dashboardLink.click(); setTimeout(function() {document.getElementById('iframeRuntime').contentWindow.document.getElementById('btnRefresh').click(); setTimeout(function() {gridDailyNumbers = document.getElementById('iframeRuntime').contentWindow.document.getElementById('gridDailyNumbers'); console.log('gridDailyNumbers: ' + gridDailyNumbers); table = gridDailyNumbers.children[0]; console.log('table: ' + table); rowGroup = table.children[2]; console.log('rowGroup: ' + rowGroup); totalPaymentTr = rowGroup.children[0]; console.log('totalPaymentTr: ' + totalPaymentTr); totalPayment = totalPaymentTr.children[7]; console.log('totalPayment: ' + totalPayment); totalPaymentString = totalPayment.textContent; console.log('totalPaymentString: ' + totalPaymentString); chrome.storage.sync.set({'" + subdomainName + "': totalPaymentString}, function() { }); }, 10000);}, 10000);"});
}
// https://www.w3schools.com/jsref/prop_node_childnodes.asp

function updateSingleTotal(subdomainRow){
    let subdomainName = subdomainRow.id;
    let loading = document.getElementById("status");
    loading.innerHTML = "Loading...";
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        tabs.forEach(
            function(tab){
                if (tab.url.search(subdomainName) != -1){
                    extractSingleTotal(subdomainName, tab);
                }
            }
        )
    });
    setTimeout(function() {
        chrome.storage.sync.get(subdomainName, function(subdomainTotal) {
            console.log("Subdomain name: " + subdomainName);
            document.getElementById(subdomainName).childNodes[0].innerHTML = subdomainName + ": " + subdomainTotal[subdomainName];
            // https://codeburst.io/how-to-position-html-elements-side-by-side-with-css-e1fae72ddcc
            // https://www.w3schools.com/Jsref/prop_style_display.asp
            // https://www.w3schools.com/jsref/met_document_createelement.asp
            console.log("Subdomain total: " + subdomainTotal[subdomainName]);
            document.getElementById(subdomainName).childNodes[2].innerHTML = "Last refreshed: " + new Date().today() + " @ " + new Date().timeNow();;
        });
        loading.innerHTML = "Loaded";
        renameTabs();
    }, 30000);
}

function buildOptionsPage(subdomainRow, subdomainName, paymentsStringinnerHTML, btnInnerHTML, buttonEventListener){
    let paymentsString = document.createElement("div");
    paymentsString.innerHTML = paymentsStringinnerHTML;
    paymentsString.style.display = "inline-block";
    let refreshBtn = document.createElement("BUTTON");
    refreshBtn.style.display = "inline-block";
    refreshBtn.innerHTML = btnInnerHTML;
    refreshBtn.addEventListener('click', buttonEventListener);
    let timeDiv = document.createElement("div");
    timeDiv.style.display = "inline-block";
    timeDiv.innerHTML = "Last refreshed: " + new Date().today() + " @ " + new Date().timeNow();
    subdomainRow.appendChild(paymentsString);
    subdomainRow.appendChild(refreshBtn);
    subdomainRow.appendChild(timeDiv);
}

let subdomainArray = []
function constructOptions(){
    let paymentsRows = document.getElementById("paymentsRows");
    paymentsRows.innerHTML = '';
    let loading = document.getElementById("status");
    loading.innerHTML = "Loading...";
    subdomainArray = [];
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        tabs.forEach(
            function(tab){
                if (tab.url.search("irslogics") != -1){
                    subdomainArray.push({subdomainName: urlToName(tab), subdomainTab: tab});
                }
            }
        );
    });
    let subdomainCount = 0;
    let subdomainName = "";
    let subdomainTotal = 0;
    let subdomainTotals = [];
    let timerId = setInterval(function() {
        if (subdomainCount >= subdomainArray.length){
            let total = 0;
            for(let i = 0; i < subdomainTotals.length; i++){
                let subdomainTotal = subdomainTotals[i];
                // https://www.delftstack.com/howto/javascript/javascript-remove-substring-from-string/#:~:text=on%20your%20machine.-,JavaScript%20replace()%20Method%20to%20Remove%20Specific%20Substring%20From%20a,leaves%20the%20original%20string%20unchanged.
                subdomainTotal = subdomainTotal.replace(/,/g, "");
                subdomainTotal = subdomainTotal.replace("$", "");
                // https://stackoverflow.com/questions/1133770/how-to-convert-a-string-to-an-integer-in-javascript
                subdomainTotal = parseFloat(subdomainTotal);
                total += subdomainTotal;
            }
            let subdomainRow = document.createElement("div");
            paymentsRows.appendChild(subdomainRow);
            buildOptionsPage(subdomainRow, subdomainName, "Total: $" + total, "REFRESH ALL", constructOptions);
            // https://stackoverflow.com/questions/17505883/exiting-setinterval-method-in-javascript/17505905
            clearInterval(timerId);
            loading.innerHTML = "Loaded";
            renameTabs();
            return;
        }
        subdomainName = subdomainArray[subdomainCount].subdomainName;
        let subdomainTab = subdomainArray[subdomainCount].subdomainTab;
        console.log("Subdomain name: " + subdomainName);
        // extractSingleTotal(subdomainName, subdomainTab);
        let subdomainRow = document.createElement("div");
        subdomainRow.id = subdomainName;
        paymentsRows.appendChild(subdomainRow);
        function subdomainButtonFunction(){
            updateSingleTotal(subdomainRow);
        }
        // buildOptionsPage(subdomainRow, subdomainName, subdomainName + ": " + subdomainTotal, "REFRESH", subdomainButtonFunction);
        let subdomainTotal = postRequestTest(subdomainRow, subdomainName, "REFRESH", subdomainButtonFunction);
        // setTimeout(function(){
            // chrome.storage.sync.get(subdomainName, function(subdomainTotalResponse) {
                // subdomainTotal = subdomainTotalResponse[subdomainName];
                // subdomainTotal = totalPaymentString;
                // console.log("Subdomain total: " + subdomainTotal);
                // subdomainTotals.push(subdomainTotal);

            // });
            subdomainCount++;
            console.log("Subdomain Count: " + subdomainCount);
        // }, 15000);
    }, 20000);
}

function postRequestTest(name){
    // https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    let ddToday = String(today.getDate()).padStart(2, '0');
    var mmToday = String(today.getMonth() + 1).padStart(2, '0');
    var yyyyToday = today.getFullYear();
    today = yyyyToday + "-" + mmToday + "-" + ddToday;
    todayLength = today.length;
    let ddYesterday = String(yesterday.getDate()).padStart(2, '0');
    var mmYesterday = String(yesterday.getMonth() + 1).padStart(2, '0');
    var yyyyYesterday = yesterday.getFullYear();
    yesterday = yyyyYesterday + "-" + mmYesterday + "-" + ddYesterday;
    console.log("yesterday: " + yesterday);
    async function postData(url = '', data={}) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        })
        return response.json();
    }

    postData('https://' + name + '.irslogics.com/Reports/Dashboard.aspx/getchartdata', {"chartdata":{"StartDate": yesterday + "T00:00:00.000Z","EndDate": today + "T00:00:00.000Z","TeamID":0,"SOID":"0"}})
    .then(data => {
        let d = data["d"];
        console.log(d);
        let index = 0;
        while (index <= data["d"].length - todayLength){
            let potentialDay = "";
            let tempIndex = 0;
            while(tempIndex < todayLength){
                potentialDay += data["d"][index + tempIndex];
                tempIndex++;
            }
            if(potentialDay == today){
                console.log(potentialDay + index);
                break;
            }
            index++;
        }
        while (index <= data["d"].length - todayLength){
            let potentialPaymentTotal = "";
            let tempIndex = 0;
            while(tempIndex < 16){
                potentialPaymentTotal += data["d"][index + tempIndex];
                tempIndex++;
            }
            if(potentialPaymentTotal == '"Payment_Total":'){
                console.log(potentialPaymentTotal + index);
                break;
            }
            index++;
        }
        index += 16;
        let paymentTotal = "";
        while(data["d"][index] != ","){
            console.log(data["d"][index]);
            paymentTotal += data["d"][index];
            index++;
        }
        console.log(paymentTotal);
        buildOptionsPage(subdomainRow, subdomainName, subdomainName + ": " + paymentTotal, "REFRESH", subdomainButtonFunction);

        // return(paymentTotal);
    });
    // fetch("https://honest.irslogics.com/Reports/Dashboard.aspx/getchartdata")
    //     .then(response => response.json())
    //     .then(data => console.log(data));
}

document.getElementById("generatePaymentInfo").addEventListener('click', constructOptions);
