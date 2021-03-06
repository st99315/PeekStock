setInterval(updateStock, 3500);

function addStock(stockID) {
  if (stockID) {
    chrome.storage.local.get(stockID, function (data) {
      if (typeof data[stockID] == 'undefined') {
        var defaultValue = {name: stockID, currentPrice: "-", change: "-", time: "-"};
        data[stockID] = defaultValue;
        chrome.storage.local.set(data);
      }
      else {
        alert(stockID + " already exists! ");
      }
    });
  }
}

function removeStock(stockID) {
  chrome.storage.local.remove(stockID);
}

function updateStock() {
  chrome.storage.local.get(null, function (stockList) {
    let queryUrl = "http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=";
    for (stockID in stockList) {
      queryUrl += "tse_" + stockID + ".tw|"
    }

    $.ajax({
      type: 'GET',
      url: queryUrl,
      success: function (data) {
        let stockArray = JSON.parse(data);
        let stockData = {};

        if (stockArray.msgArray != undefined) {
          console.log(stockArray.queryTime)

          $.each(stockArray.msgArray, function (index, stock) {
            if (stock.z != '-') {
              let changePercent = (stock.z == stock.y) ? 0.0 : (stock.z - stock.y) / stock.y * 100;
              let updateValue = {name: stock.n, currentPrice: stock.z, change: String(changePercent.toFixed(2)), time: stock.t};
              stockData[stock.c] = updateValue;
            }
          });
          chrome.storage.local.set(stockData);
        }
      }
    });
  });
  chrome.runtime.sendMessage({action: "refresh"});
}

function clearLocalStorage() {
  chrome.storage.local.clear(function () {
    var error = chrome.runtime.lastError;
    if (error) {
      alert(error);
    }
  });
}
