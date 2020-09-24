let stockCode;
let lotNum;
let password;
let timeout = 5000;

codeInput.onchange = function (e) {
    stockCode = e.target.value;
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

chrome.storage.sync.get(['stockCode', 'lotNum'], function (res) {
    // console.log('res', res);
    // 获取保存的间隔检查时间
    if (typeof res.stockCode !== 'undefined') {
        stockCode = res.stockCode;
        codeInput.value = res.stockCode;
    }
    if (typeof res.lotNum !== 'undefined') {
        lotNum = res.lotNum;
        lotNumInput.value = res.lotNum;
    }
});

startBtn.onclick = function () {
    if (!stockCode || !lotNum || !password) return alert('不能为空！');
    const params = {
        stockCode,
        method: 'run',
        lotNum,
        password,
        timeout
    };
    const q = new URLSearchParams();
    for (let key in params) {
        q.append(key, params[key]);
    }
    chrome.storage.sync.set({ stockCode, lotNum });
    chrome.tabs.create({ url: `https://ipo.futuhk.com/apply/detail?${q.toString()}`, active: false });
   /* chrome.tabs.query({
        url: 'https://ipo.futuhk.com/!*',
        currentWindow: true
    }, (tabs) => {
        if(tabs.length <= 0) {
            chrome.tabs.create({ url: `https://ipo.futuhk.com/apply?stockCode=${stockCode}`, active: false }, (tab) => {
                chrome.tabs.sendMessage(tab.id, params);
            });
        } else {
            console.log('tabs', tabs);
            chrome.tabs.sendMessage(tabs[0].id, params);
        }
    });*/
};
