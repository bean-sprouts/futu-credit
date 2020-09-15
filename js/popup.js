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

chrome.storage.sync.get(['code', 'lotNum'], function (res) {
    // console.log('res', res);
    // 获取保存的间隔检查时间
    if (typeof res.code !== 'undefined') {
        code = res.code;
        codeInput.value = res.code;
    }
    if (typeof res.lotNum !== 'undefined') {
        lotNum = res.lotNum;
        lotNumInput.value = res.lotNum;
    }
});

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
    chrome.storage.sync.set({ code, lotNum });
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
