let USERNAME_CONSTANT = ""
let PASSWORD_CONSTANT = ""

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

function extractSingleTotalOld(subdomainName, tab){
    let totalPaymentString = 0;
    getTotal(subdomainName, totalPaymentString);
    // subdomainName = "'" + subdomainName + "'";
    // setTimeout(function() {
    //     chrome.storage.sync.set({subdomainName: totalPaymentString}, function() { });
    // }, 10000);
    // chrome.tabs.reload(tab.id);
    setTimeout(function() {
        console.log("timeout is over");
        chrome.tabs.executeScript(tab.id, {code: "chrome.storage.sync.set({'" + subdomainName + "': '" + totalPaymentString + "'});"});
    }, 10000); //previously 10000
    // chrome.tabs.executeScript(tab.id, {code: "pageTree = document.getElementById('page-tree'); unorderedList = pageTree.firstChild; dashboardBullet = unorderedList.firstChild; dashboardDiv = dashboardBullet.firstChild; dashboardSpan = dashboardDiv.firstChild; dashboardLink = dashboardSpan.firstChild; dashboardLink.click(); setTimeout(function() {document.getElementById('iframeRuntime').contentWindow.document.getElementById('btnRefresh').click(); setTimeout(function() {gridDailyNumbers = document.getElementById('iframeRuntime').contentWindow.document.getElementById('gridDailyNumbers'); console.log('gridDailyNumbers: ' + gridDailyNumbers); table = gridDailyNumbers.children[0]; console.log('table: ' + table); rowGroup = table.children[2]; console.log('rowGroup: ' + rowGroup); totalPaymentTr = rowGroup.children[0]; console.log('totalPaymentTr: ' + totalPaymentTr); totalPayment = totalPaymentTr.children[7]; console.log('totalPayment: ' + totalPayment); totalPaymentString = totalPayment.textContent; console.log('totalPaymentString: ' + totalPaymentString); chrome.storage.sync.set({'" + subdomainName + "': totalPaymentString}, function() { }); }, 10000);}, 10000);"});
}
// https://www.w3schools.com/jsref/prop_node_childnodes.asp

function updateSingleTotal(subdomainRow){
    let subdomainName = subdomainRow.id;
    let loading = document.getElementById("status");
    loading.innerHTML = "Loading...";

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
    postData('https://' + subdomainName + '.irslogics.com/API/Login/GetLogin', {"username":USERNAME_CONSTANT,"password":PASSWORD_CONSTANT,"HiddentUTCOffset":-5,"RememberMe":false,"captchacode":"","LoadTime":24,"LocalIP":""})
    .then(data => {
        console.log(data);
        extractSingleTotal(subdomainName, 1);
    });

    setTimeout(function() {
        chrome.storage.sync.get(subdomainName + "paymentTotal", function(subdomainTotal) {
            console.log("Subdomain name: " + subdomainName);
            document.getElementById(subdomainName).childNodes[3].innerHTML = "$" + parseFloat(subdomainTotal[subdomainName + "paymentTotal"]).toFixed(2);
            // https://codeburst.io/how-to-position-html-elements-side-by-side-with-css-e1fae72ddcc
            // https://www.w3schools.com/Jsref/prop_style_display.asp
            // https://www.w3schools.com/jsref/met_document_createelement.asp
            console.log("Subdomain total: " + subdomainTotal[subdomainName + "paymentTotal"]);
            document.getElementById(subdomainName).childNodes[5].innerHTML = "Last refreshed: " + new Date().today() + " @ " + new Date().timeNow();;
        });
        chrome.storage.sync.get(subdomainName + "paymentInitial", function(subdomainInitial) {
            console.log("Subdomain name: " + subdomainName);
            document.getElementById(subdomainName).childNodes[1].innerHTML = "$" + parseFloat(subdomainInitial[subdomainName + "paymentInitial"]).toFixed(2);
            // https://codeburst.io/how-to-position-html-elements-side-by-side-with-css-e1fae72ddcc
            // https://www.w3schools.com/Jsref/prop_style_display.asp
            // https://www.w3schools.com/jsref/met_document_createelement.asp
            console.log("Subdomain initial: " + subdomainInitial[subdomainName + "paymentInitial"]);
        });
        chrome.storage.sync.get(subdomainName + "paymentRecurring", function(subdomainRecurring) {
            console.log("Subdomain name: " + subdomainName);
            document.getElementById(subdomainName).childNodes[2].innerHTML = "$" + parseFloat(subdomainRecurring[subdomainName + "paymentRecurring"]).toFixed(2);
            // https://codeburst.io/how-to-position-html-elements-side-by-side-with-css-e1fae72ddcc
            // https://www.w3schools.com/Jsref/prop_style_display.asp
            // https://www.w3schools.com/jsref/met_document_createelement.asp
            console.log("Subdomain recurring: " + subdomainRecurring[subdomainName + "paymentRecurring"]);
        });
        loading.innerHTML = "Loaded";
        renameTabs();
    }, 10000);
}

function buildOptionsPage(subdomainRow, subdomainName, paymentsStringinnerHTML, initialStringinnerHTML, recurringStringinnerHTML, btnInnerHTML, buttonEventListener){
    let subdomainNameString = document.createElement("td");
    subdomainNameString.innerHTML = subdomainName;
    let initialString = document.createElement("td");
    initialString.innerHTML = initialStringinnerHTML;
    let recurringString = document.createElement("td");
    recurringString.innerHTML = recurringStringinnerHTML;
    let paymentsString = document.createElement("td");
    paymentsString.innerHTML = paymentsStringinnerHTML;
    // paymentsString.style.display = "inline-block";
    let refreshBtnTD = document.createElement("td");
    let refreshBtn = document.createElement("BUTTON");
    refreshBtnTD.appendChild(refreshBtn);
    // refreshBtn.style.display = "inline-block";
    refreshBtn.innerHTML = btnInnerHTML;
    refreshBtn.addEventListener('click', buttonEventListener);
    let timeDiv = document.createElement("td");
    // timeDiv.style.display = "inline-block";
    timeDiv.innerHTML = "Last refreshed: " + new Date().today() + " @ " + new Date().timeNow();
    subdomainRow.appendChild(subdomainNameString);
    subdomainRow.appendChild(initialString);
    subdomainRow.appendChild(recurringString);
    subdomainRow.appendChild(paymentsString);
    subdomainRow.appendChild(refreshBtnTD);
    subdomainRow.appendChild(timeDiv);
}

let subdomainArray = []
let waitingTime = 8000;
function constructOptions(how){
    let paymentsRows = document.getElementById("paymentsRows");
    paymentsRows.innerHTML = '';
    let tr = document.createElement("tr");
    let subdomainHeader = document.createElement("th");
    // subdomainHeader.style.display = "inline-block";
    subdomainHeader.innerHTML = "Subdomain";
    let initialPaymentHeader = document.createElement("th");
    // initialPaymentHeader.style.display = "inline-block";
    initialPaymentHeader.innerHTML = "Initial Payment";
    let recurringPaymentHeader = document.createElement("th");
    // recurringPaymentHeader.style.display = "inline-block";
    recurringPaymentHeader.innerHTML = "Recurring Payment";
    let totalPaymentHeader = document.createElement("th");
    // totalPaymentHeader.style.display = "inline-block";
    totalPaymentHeader.innerHTML = "Total Payment";
    let refreshHeader = document.createElement("th");
    // refreshHeader.style.display = "inline-block";
    refreshHeader.innerHTML = "Refresh";
    let lastRefreshedHeader = document.createElement("th");
    // lastRefreshedHeader.style.display = "inline-block";
    lastRefreshedHeader.innerHTML = "Last Refreshed";
    tr.appendChild(subdomainHeader);
    tr.appendChild(initialPaymentHeader);
    tr.appendChild(recurringPaymentHeader);
    tr.appendChild(totalPaymentHeader);
    tr.appendChild(refreshHeader);
    tr.appendChild(lastRefreshedHeader);
    paymentsRows.appendChild(tr);
    let loading = document.getElementById("status");
    loading.innerHTML = "Loading...";
    subdomainArray = [];
    if(how == "open tabs"){
        chrome.tabs.query({currentWindow: true}, function(tabs) {
            tabs.forEach(
                function(tab){
                    if (tab.url.search("irslogics") != -1 || tab.url.search("logiqs") != -1){
                        subdomainArray.push({subdomainName: urlToName(tab), subdomainTab: tab});
                    }
                }
            );
        });
    } else {
        let typingNamesSubdomain = document.getElementById("TypedNames").value;
        chrome.storage.sync.set({typedNames: document.getElementById("TypedNames").value}, function() {
            console.log('Value is set to ' + document.getElementById("TypedNames").value);
        });

        console.log(typingNamesSubdomain);
        let typingNamesSubdomainArray = typingNamesSubdomain.split(" ")
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
        for(let i = 0; i < typingNamesSubdomainArray.length; i++){
            postData('https://' + typingNamesSubdomainArray[i] + '.irslogics.com/API/Login/GetLogin', {"username":USERNAME_CONSTANT,"password":PASSWORD_CONSTANT,"HiddentUTCOffset":-5,"RememberMe":false,"captchacode":"","LoadTime":24,"LocalIP":""})
            .then(data => {
                console.log(data);
            });
            subdomainArray.push({subdomainName: typingNamesSubdomainArray[i], subdomainTab: i});
            console.log(typingNamesSubdomainArray[i]);
        }
    }

    let subdomainCount = 0;
    let subdomainName = "";
    let subdomainTotal = 0;
    let subdomainTotals = [];
    let subdomainInitials = [];
    let subdomainRecurrings = [];
    let timerId = setInterval(function() {
        // if (subdomainCount > 0){
        //     waitingTime = 2000;
        // }
        if (subdomainCount >= subdomainArray.length){
            let total = 0;
            for(let i = 0; i < subdomainTotals.length; i++){
                let subdomainTotal = subdomainTotals[i];
                console.log("subdomainTotal: " + subdomainTotal);
                // https://www.delftstack.com/howto/javascript/javascript-remove-substring-from-string/#:~:text=on%20your%20machine.-,JavaScript%20replace()%20Method%20to%20Remove%20Specific%20Substring%20From%20a,leaves%20the%20original%20string%20unchanged.
                // subdomainTotal = subdomainTotal.replace(/,/g, "");
                // subdomainTotal = subdomainTotal.replace("$", "");
                // https://stackoverflow.com/questions/1133770/how-to-convert-a-string-to-an-integer-in-javascript
                subdomainTotal = parseFloat(subdomainTotal);
                total += subdomainTotal;
            }
            let initial = 0;
            for(let i = 0; i < subdomainInitials.length; i++){
                let subdomainInitial = subdomainInitials[i];
                // https://www.delftstack.com/howto/javascript/javascript-remove-substring-from-string/#:~:text=on%20your%20machine.-,JavaScript%20replace()%20Method%20to%20Remove%20Specific%20Substring%20From%20a,leaves%20the%20original%20string%20unchanged.
                // subdomainInitial = subdomainInitial.replace(/,/g, "");
                // subdomainInitial = subdomainInitial.replace("$", "");
                // https://stackoverflow.com/questions/1133770/how-to-convert-a-string-to-an-integer-in-javascript
                subdomainInitial = parseFloat(subdomainInitial);
                initial += subdomainInitial;
            }
            let recurring = 0;
            for(let i = 0; i < subdomainRecurrings.length; i++){
                let subdomainRecurring = subdomainRecurrings[i];
                // https://www.delftstack.com/howto/javascript/javascript-remove-substring-from-string/#:~:text=on%20your%20machine.-,JavaScript%20replace()%20Method%20to%20Remove%20Specific%20Substring%20From%20a,leaves%20the%20original%20string%20unchanged.
                // subdomainRecurring = subdomainRecurring.replace(/,/g, "");
                // subdomainRecurring = subdomainRecurring.replace("$", "");
                // https://stackoverflow.com/questions/1133770/how-to-convert-a-string-to-an-integer-in-javascript
                subdomainRecurring = parseFloat(subdomainRecurring);
                recurring += subdomainRecurring;
            }
            let subdomainRow = document.createElement("tr");
            paymentsRows.appendChild(subdomainRow);
            buildOptionsPage(subdomainRow, "Total", "$" + total.toFixed(2), "$" + initial.toFixed(2), "$" + recurring.toFixed(2), "REFRESH ALL", typingNamesInfo);
            // https://stackoverflow.com/questions/17505883/exiting-setinterval-method-in-javascript/17505905
            clearInterval(timerId);
            loading.innerHTML = "Loaded";
            renameTabs();
            return;
        }
        subdomainName = subdomainArray[subdomainCount].subdomainName;
        let subdomainTab = subdomainArray[subdomainCount].subdomainTab;
        console.log("Subdomain name: " + subdomainName);
        extractSingleTotal(subdomainName, subdomainTab);
        setTimeout(function(){
            let subdomainInitial = "";
            chrome.storage.sync.get(subdomainName + "paymentInitial", function(subdomainInitialResponse){
                subdomainInitial = subdomainInitialResponse[subdomainName + "paymentInitial"];
                console.log("Subdomain initial: " + subdomainInitial);
                subdomainInitials.push(subdomainInitial);
            });
            let subdomainRecurring = "";
            chrome.storage.sync.get(subdomainName + "paymentRecurring", function(subdomainRecurringResponse){
                subdomainRecurring = subdomainRecurringResponse[subdomainName + "paymentRecurring"];
                console.log("Subdomain recurring: " + subdomainRecurring);
                subdomainRecurrings.push(subdomainRecurring);
            });
            chrome.storage.sync.get(subdomainName + "paymentTotal", function(subdomainTotalResponse) {
                subdomainTotal = subdomainTotalResponse[subdomainName + "paymentTotal"];
                console.log("Subdomain total: " + subdomainTotal);
                subdomainTotals.push(subdomainTotal);
                let subdomainRow = document.createElement("tr");
                subdomainRow.id = subdomainName;
                paymentsRows.appendChild(subdomainRow);
                function subdomainButtonFunction(){
                    updateSingleTotal(subdomainRow);
                }
                buildOptionsPage(subdomainRow, subdomainName, "$" + parseFloat(subdomainTotal).toFixed(2), "$" + parseFloat(subdomainInitial).toFixed(2), "$" + parseFloat(subdomainRecurring).toFixed(2), "REFRESH", subdomainButtonFunction);
            });
            subdomainCount++;
            console.log("Subdomain Count: " + subdomainCount);
        }, waitingTime);
    }, waitingTime + 2000);
}

function extractSingleTotal(name, tab){
    // https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    // yesterday.setDate(yesterday.getDate() - 1);
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
        let foundIt = false;
        while (index <= data["d"].length - todayLength){
            let potentialDay = "";
            let tempIndex = 0;
            while(tempIndex < todayLength){
                potentialDay += data["d"][index + tempIndex];
                // console.log("potentialDay: " + potentialDay);
                tempIndex++;
            }
            if(potentialDay == today){
                console.log("FOUND IT" + potentialDay + index);
                foundIt = true;
                break;
            }
            index++;
        }
        if(foundIt == false){
            index = 0;
        }
        let paymentInitial = "";
        let paymentRecurring = "";
        let paymentTotal = "";
        while (index <= data["d"].length - todayLength){
            let potentialPaymentTotal = "";
            let potentialPaymentRecurring = "";
            let potentialPaymentInitial = "";
            let tempIndex1 = 0;
            while(tempIndex1 < 16){
                potentialPaymentTotal += data["d"][index + tempIndex1];
                tempIndex1++;
            }
            let tempIndex2 = 0;
            while(tempIndex2 < 18){
                potentialPaymentInitial += data["d"][index + tempIndex2];
                tempIndex2++;
            }
            let tempIndex3 = 0;
            while(tempIndex3 < 20){
                potentialPaymentRecurring += data["d"][index + tempIndex3];
                tempIndex3++;
            }
            if(potentialPaymentInitial == '"Payment_Initial":'){
                console.log(potentialPaymentInitial + index);
                index += 18;
                while(data["d"][index] != ","){
                    console.log(data["d"][index]);
                    paymentInitial += data["d"][index];
                    index++;
                }
                console.log("paymentInitial: " + paymentInitial);
            }
            if(potentialPaymentRecurring == '"Payment_Recurring":'){
                console.log(potentialPaymentRecurring + index);
                index += 20;
                while(data["d"][index] != ","){
                    console.log(data["d"][index]);
                    paymentRecurring += data["d"][index];
                    index++;
                }
                console.log("paymentRecurring: " + paymentRecurring);
            }
            if(potentialPaymentTotal == '"Payment_Total":'){
                console.log(potentialPaymentTotal + index);
                break;
            }
            index++;
        }
        index += 16;
        while(data["d"][index] != ","){
            paymentTotal += data["d"][index];
            index++;
        }
        console.log("paymentTotal: " + paymentTotal);
        // buildOptionsPage(subdomainRow, subdomainName, subdomainName + ": " + paymentTotal, "REFRESH", subdomainButtonFunction);

        chrome.storage.sync.set({[name + "paymentInitial"]: [paymentInitial]});
        chrome.storage.sync.set({[name + "paymentRecurring"]: [paymentRecurring]});
        chrome.storage.sync.set({[name + "paymentTotal"]: [paymentTotal]});
        // chrome.tabs.executeScript(tab.id, {code: "chrome.storage.sync.set({'" + name + "paymentInitial': '" + paymentInitial + "'});"});
        // chrome.tabs.executeScript(tab.id, {code: "chrome.storage.sync.set({'" + name + "paymentRecurring': '" + paymentRecurring + "'});"});
        // chrome.tabs.executeScript(tab.id, {code: "chrome.storage.sync.set({'" + name + "paymentTotal': '" + paymentTotal + "'});"});
    });
}

function openTabsInfo(){
    constructOptions("open tabs");
}

function typingNamesInfo(){
    constructOptions("typing names");
}

document.getElementById("generatePaymentInfoOpenTabs").addEventListener('click', openTabsInfo);
document.getElementById("generatePaymentInfoTypingNames").addEventListener('click', typingNamesInfo);

chrome.storage.sync.get(['typedNames'], function(result) {
    console.log('Value currently is ' + result.key);
    if(result.typedNames != null){
        document.getElementById("TypedNames").value = result.typedNames;
    } else {
        document.getElementById("TypedNames").value = "";
    }
});
