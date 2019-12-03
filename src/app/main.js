const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const fsPromises = require('fs').promises;
const path = require('path')
const os = require('os')

const costsPath = path.join(__dirname, './costs.json');
const profitsPath = path.join(__dirname, './profits.json');
const categoriesPath = path.join(__dirname, './categories.json');

ipcMain.handle('getCosts', async (event, filter) => {
  return JSON.parse(await fsPromises.readFile(costsPath))
    .filter(cost => {
      if (filter.searchText) {
        return cost.name.includes(filter.searchText);
      }
      return true;
    })
    .filter(cost => {
      if (Array.isArray(filter.selectedCategories) && filter.selectedCategories.length) {
        return filter.selectedCategories.includes(cost.category);
      }
      return true;
    })
    .filter(cost => {
      if (filter.dateFrom) {
        return filter.dateFrom < cost.date;
      }
      return true;
    })
    .filter(cost => {
      if (filter.dateTo) {
        return filter.dateTo > cost.date;
      }
      return true;
    })
    .sort((cost1, cost2) => {
      if (filter.sortType) {
        if (filter.sortType === 'priceUp') {
          return cost1.price - cost2.price;
        }
        if (filter.sortType === 'priceDown') {
          return cost2.price - cost1.price;
        }
        if (filter.sortType === 'dateUp') {
          return new Date(cost1.date) - new Date(cost2.date);
        }
        if (filter.sortType === 'dateDown') {
          return new Date(cost2.date) - new Date(cost1.date);
        }
      } else {
        return cost2.key - cost1.key;
      }
    });
});

ipcMain.handle('getCategories', async () => {
  return JSON.parse(await fsPromises.readFile(categoriesPath));
});

ipcMain.handle('addCost', async (event, cost) => {
  try {
    const costsList = JSON.parse(await fsPromises.readFile(costsPath));
    if (!cost.date) {
      cost.date = new Date();
    }
    const key = costsList[costsList.length - 1].key + 1;
    costsList.push({ ...cost, key });
    await fsPromises.writeFile(costsPath, JSON.stringify(costsList));
    return costsList;
  } catch (e) {
    console.log(e);
    return [];
  }
});

ipcMain.handle('editCost', async (event, cost) => {
  try {
    const costsList = JSON.parse(await fsPromises.readFile(costsPath));
    if (!cost.date) {
      cost.date = new Date();
    }
    const index = costsList.findIndex(oldCost => oldCost.key === cost.key);
    costsList.splice(index, 1, cost);
    await fsPromises.writeFile(costsPath, JSON.stringify(costsList));
    return costsList;
  } catch (e) {
    console.log(e);
    return [];
  }
});

ipcMain.handle('deleteCost', async (event, cost) => {
  try {
    const costsList = JSON.parse(await fsPromises.readFile(costsPath));
    const index = costsList.findIndex(oldCost => oldCost.key === cost.key);
    costsList.splice(index, 1);
    await fsPromises.writeFile(costsPath, JSON.stringify(costsList));
    return costsList;
  } catch (e) {
    console.log(e);
    return [];
  }
});

ipcMain.handle('addProfit', async (event, profit) => {
  try {
    const profitsList = JSON.parse(await fsPromises.readFile(profitsPath));
    if (!profit.date) {
      profit.date = new Date();
    }
    const key = profitsList[profitsList.length - 1].key + 1;
    profitsList.push({ ...profit, key });
    await fsPromises.writeFile(profitsPath, JSON.stringify(profitsList));
    return profitsList;
  } catch (e) {
    console.log(e);
    return [];
  }
});

ipcMain.handle('editProfit', async (event, profit) => {
  try {
    const profitsList = JSON.parse(await fsPromises.readFile(profitsPath));
    if (!profit.date) {
      profit.date = new Date();
    }
    const index = profitsList.findIndex(oldProfit => oldProfit.key === profit.key);
    profitsList.splice(index, 1, profit);
    await fsPromises.writeFile(profitsPath, JSON.stringify(profitsList));
    return profitsList;
  } catch (e) {
    console.log(e);
    return [];
  }
});

ipcMain.handle('deleteProfit', async (event, profit) => {
  try {
    const profitsList = JSON.parse(await fsPromises.readFile(profitsPath));
    const index = profitsList.findIndex(oldProfit => oldProfit.key === profit.key);
    profitsList.splice(index, 1);
    await fsPromises.writeFile(profitsPath, JSON.stringify(profitsList));
    return profitsList;
  } catch (e) {
    console.log(e);
    return [];
  }
});


ipcMain.handle('getProfits', async (event, filter) => {
  return JSON.parse(await fsPromises.readFile(profitsPath))
    .filter(profit => {
      if (filter.searchText) {
        return profit.name.includes(filter.searchText);
      }
      return true;
    })
    .filter(profit => {
      if (filter.dateFrom) {
        return filter.dateFrom < profit.date;
      }
      return true;
    })
    .filter(profit => {
      if (filter.dateTo) {
        return filter.dateTo > profit.date;
      }
      return true;
    })
    .sort((profit1, profit2) => {
      if (filter.sortType) {
        if (filter.sortType === 'priceUp') {
          return profit1.price - profit2.price;
        }
        if (filter.sortType === 'priceDown') {
          return profit2.price - profit1.price;
        }
        if (filter.sortType === 'dateUp') {
          return new Date(profit1.date) - new Date(profit2.date);
        }
        if (filter.sortType === 'dateDown') {
          return new Date(profit2.date) - new Date(profit1.date);
        }
      } else {
        return profit2.key - profit1.key;
      }
    });
});

app.on('ready', () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
    },
  });
  //Menu.setApplicationMenu(null);
  win.webContents.openDevTools();
  win.loadFile('../client/dist/index.html');
})