// https://stackoverflow.com/questions/49546645/clicking-buttons-on-a-website-with-a-chrome-extension
function search(){
    renameTabs();
    let input = "";
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        tabs.forEach(
            function(tab){
                if (tab.url.search("irslogics") != -1 || tab.url.search("logiqs") != -1){
                    input = document.getElementById("searchInput").value;
                    chrome.tabs.update(tab.id, {selected: true});
                    // https://stackoverflow.com/questions/22286495/change-active-window-chrome-tabs
                    // https://www.w3schools.com/js/js_htmldom_html.asp
                    chrome.tabs.executeScript(tab.id, {code: 'search_value = "' + input + '";document.getElementById("txtSearch").value = search_value;document.getElementById("btnSearch").click();' + 'setTimeout(function() {console.log(document.getElementById("iframeRuntime").contentWindow.document.getElementsByTagName("html")[0].innerHTML); if((document.getElementById("iframeRuntime").contentWindow.document.getElementsByTagName("html")[0].innerHTML.match(/' + input + '/g) || []).length >= 2){document.getElementsByTagName("title")[0].innerHTML = "FOUND";} }, 10000)'});
                }
            }
        );
    });
}

document.getElementById("searchButton").addEventListener('click', search);
