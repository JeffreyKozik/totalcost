function urlToName(tab){
    let tabUrl = tab.url;
    let name = "";
    let start = 0;
    let slashesCount = 0;
    for (var i = 0; i < tabUrl.length; i++){
        if (tabUrl.charAt(i) == "/"){
            slashesCount++;
            if (slashesCount == 2){
                start = i;
            }
        }
        if (tabUrl.charAt(i) == "."){
            name = tabUrl.slice(start + 1, i);
            break;
        }
    }
    return name;
    console.log("Name: " + name);
}

function renameTabs(){
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        tabs.forEach(
            function(tab){
                let subdomainName = urlToName(tab);
                if (tab.url.search("irslogics") != -1 || tab.url.search("logiqs") != -1){
                    chrome.tabs.executeScript(tab.id, {code: "document.getElementsByTagName('title')[0].innerHTML = '" + subdomainName + "';"});
                }
            }
        );
    });
}
