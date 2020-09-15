let code;
let lotNum;
let password;
let timeout = 5000;

codeInput.onchange = function (e) {
    code = e.target.value;
};
lotNumInput.onchange = function (e) {
    lotNum = e.target.value;
};
passwordInput.onchange = function (e) {
    password = e.target.value;
};
timeoutInput.onchange = function (e) {
    timeout = e.target.value;
};


startBtn.onclick = function () {
    if (!code || !lotNum || !password) return alert('不能为空！');
    const params = {
        method: 'run',
        code,
        lotNum,
        password,
        timeout
    };
    const q = new URLSearchParams();
    for (let key in params) {
        q.append(key, params[key]);
    }
    chrome.tabs.create({ url: `https://ipo.futuhk.com/apply?${q}`, active: false });
   /* chrome.tabs.query({
        url: 'https://ipo.futuhk.com/!*',
        currentWindow: true
    }, (tabs) => {
        if(tabs.length <= 0) {
            chrome.tabs.create({ url: `https://ipo.futuhk.com/apply?stockCode=${code}`, active: false }, (tab) => {
                chrome.tabs.sendMessage(tab.id, params);
            });
        } else {
            console.log('tabs', tabs);
            chrome.tabs.sendMessage(tabs[0].id, params);
        }
    });*/
};
