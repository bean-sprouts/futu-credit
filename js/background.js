chrome.runtime.onMessage.addListener(request => {
  if(request.type === 'alert') {
    chrome.notifications.create('', {
      type: 'basic',
      iconUrl: 'image/icon128.png',
      title: '提示',
      message: request.message
    })
  }
});
