var bg = chrome.extension.getBackgroundPage();

$(document).ready(function () {
  refreshStockUI();
});

document.addEventListener('click', function (e) {
  switch (e.target.id) {
    case 'add':
      bg.addStock(document.getElementById("stockID").value);
      break;
    case 'remove':
      bg.removeStock(e.target.value);
      location.reload();
  }
});

chrome.runtime.onMessage.addListener(function () {
  refreshStockUI();
});

function getColor(change) {
  if (change > 0.)
    return "red";
  else if (change < 0.)
    return "green";
  else if (change == 0.)
    return "orange";
  else
    return"black";
}

function refreshStockUI() {
  chrome.storage.local.get(null, function (items) {
    let stockData = "";
    for (key in items) {
      let color = getColor(items[key].change);
      stockData +=
        `<tr align='center'>
          <td>${items[key].name}</td>
          <td>${items[key].currentPrice}</td>
          <td><font color="${color}">${items[key].change}</td>
          <td>${items[key].time}</td>
          <td><button class="btn btn-outline-danger btn-sm" id='remove' value="${key}">Remove</button></td>
        </tr>`;
    }
    document.getElementById("table_body").innerHTML = stockData;
  });
}

// chrome.storage.onChanged.addListener(function (changes, areaName) {
//   console.log(Date.now(), changes, areaName);
//   refreshStockUI();
// });
