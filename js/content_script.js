let timer;

// 获取当前银行融资额度
function getCredits(params) {
  const { code, lotNum, password, timeout } = params;
  const _params = { ...params, _: new Date().getTime() };
  const q = new URLSearchParams();
  for (let key in _params) {
    q.append(key, _params[key]);
  }
  // 获取标的相关信息
  return fetch(`https://ipo.futuhk.com/api/getApplyBaseInformation?code=${code}&_=${new Date().getTime()}`).then(res => {
    if (res.status === 200) {
      return res.json()
    } else {
      throw Error()
    }
  }).then(res => {
    // console.log('res---getApplyBaseInformation', res);
    const { data: { accounts, stock: { stockId, stockCode, lotSize } } } = res;
    const accountId = accounts.find(item => item.isMargin).accountId;
    // 获取购买力
    return fetch(`https://ipo.futuhk.com/api/getPower?stockId=${stockId}&tid=0&accountId=${accountId}&stockCode=${stockCode}&_=${new Date().getTime()}`)
      .then(res => res.json()).then(res => {
        // console.log('res---getPower', res);
        const { data: { availableCash, lotInfo, maxApplyQty: { bank } } } = res;
        const { minAssetPower, minAssetPowerBase, stockPrice } = lotInfo.find(item => item.stockNum ===  lotNum * lotSize);
        if (availableCash < minAssetPowerBase) {
          console.log('可用现金不足');
          return alert('可用现金不足');
        }
        // minAssetPowerBase10倍融资需要的本金，minAssetPower最大融资需要的现金金额
        if (bank / lotSize > lotNum && minAssetPower === minAssetPowerBase) {
          // 可用融资手数大于期望的值且使用10倍融资，发起认购
          // 已知password采用md5加密
          // csrf的token存储在页面的meta标签中
          // request_id为时间戳加两位数字随机数
          const csrf = document.getElementsByTagName('meta')['csrf'].content;
          const request_id = `${new Date().getTime()}${Math.round(Math.random() * 100).toString()}`;
          // 获取token
          return fetch(`https://ipo.futuhk.com/api/r_token?_=${new Date().getTime()}`).then(res => res.json()).then(res => {
            const { data: { secret } } = res;
            return fetch(`https://ipo.futuhk.com/api/applyStock?request_id=${request_id}`, {
              method: 'POST',
              headers: {
                'content-type': 'application/json'
              },
              body: JSON.stringify({
                accountId,
                assetMargin: 0,
                buyAmount: stockPrice,
                buyCount: lotNum * lotSize,
                cashPart: minAssetPowerBase,
                csrf,
                isMarginIpo: 1,
                password: md5(password),
                r_token: secret,
                stockId,
                tid: 0
              })
            }).then(res => res.json()).then(res => {
              console.log('res---result', res);
              switch (res.code) {
                case 0:
                  console.log('认购成功');
                  timer && clearTimeout(timer);
                  break;
                case 500004:
                case 800004:
                  console.log(res.message);
                  timer && clearTimeout(timer);
                  break;
                default:
                  timer = setTimeout(() => getCredits(params), timeout);
              }
            })
          });
        } else {
          timer = setTimeout(() => getCredits(params), timeout);
        }
      })
  })
    .catch(err => { console.log(err) })
}


function run(params) {
  getCredits(params);
}

// init();
// 因为必须从页面的meta标签取csrf token，所以只能通过注入JS的方式实现
const searchParams = new URLSearchParams(window.location.search);
if (searchParams.has('method')) {
  const params = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  if (searchParams.get('method') === 'run') run(params);
}
/*chrome.runtime.onMessage.addListener(request => {
  if (request.method === 'run') run(request);
});*/





