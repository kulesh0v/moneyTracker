const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const fsPromises = require('fs').promises;
const path = require('path')
const os = require('os')

const costsPath = path.join(__dirname, './costs.json');
const profitsPath = path.join(__dirname, './profits.json');
const categoriesPath = path.join(__dirname, './categories.json');

const getCosts = async (filter) => {
  return JSON.parse(await fsPromises.readFile(costsPath))
    .filter(cost => {
      if (filter && filter.searchText) {
        return cost.name.includes(filter.searchText);
      }
      return true;
    })
    .filter(cost => {
      if (filter && Array.isArray(filter.selectedCategories) && filter.selectedCategories.length) {
        return filter.selectedCategories.includes(cost.category);
      }
      return true;
    })
    .filter(cost => {
      if (filter && !!filter.dateFrom) {
        const dateFrom = new Date(filter.dateFrom);
        dateFrom.setHours(0);
        dateFrom.setMinutes(0);
        dateFrom.setSeconds(0);
        dateFrom.setMilliseconds(0);
        return dateFrom <= new Date(cost.date);
      }
      return true;
    })
    .filter(cost => {
      if (filter && filter.dateTo) {
        const dateTo = new Date(filter.dateTo);
        dateTo.setMinutes(0);
        dateTo.setSeconds(0);
        dateTo.setMilliseconds(0);
        dateTo.setHours(24);
        return dateTo > new Date(cost.date);
      }
      return true;
    })
    .sort((cost1, cost2) => {
      if (filter && filter.sortType) {
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
        if (filter) {
          return new Date(cost2.date) - new Date(cost1.date);
        } else {
          return cost1.key - cost2.key;
        }
      }
    });
}

ipcMain.handle('getCosts', async (event, filter) => {
  return getCosts(filter);
});

const getCategories = async () => {
  return JSON.parse(await fsPromises.readFile(categoriesPath));
}

ipcMain.handle('getCategories', async () => {
  return getCategories();
});

ipcMain.handle('editCategory', async (event, newCategory) => {
  try {
    const categories = await getCategories();
    const index = categories.findIndex(oldCategory => oldCategory.key === newCategory.key);
    newCategory.name = category.name.trim();
    categories.splice(index, 1, newCategory);
    await fsPromises.writeFile(categoriesPath, JSON.stringify(categories));
    return categories;
  } catch (e) {
    console.log(e);
    return [];
  }
});

ipcMain.handle('deleteCategory', async (event, newCategory) => {
  try {
    const categories = await getCategories();
    const index = categories.findIndex(oldCategory => oldCategory.key === newCategory.key);
    categories.splice(index, 1);
    await fsPromises.writeFile(categoriesPath, JSON.stringify(categories));
    return categories;
  } catch (e) {
    console.log(e);
    return [];
  }
});

ipcMain.handle('addCategory', async (event, category) => {
  try {
    const categories = await getCategories();
    const key = categories[categories.length - 1].key + 1;
    category.name = category.name.trim();
    if (!categories.some(c => c.name === category.name)) {
      categories.push({ ...category, key });
    }
    await fsPromises.writeFile(categoriesPath, JSON.stringify(categories));
    return categories;
  } catch (e) {
    console.log(e);
    return [];
  }
});

ipcMain.handle('addCost', async (event, cost, filter) => {
  try {
    const costsList = await getCosts();
    if (!cost.date) {
      cost.date = new Date();
    }
    const key = costsList[costsList.length - 1].key + 1;
    costsList.push({ ...cost, key });
    await fsPromises.writeFile(costsPath, JSON.stringify(costsList));
    return getCosts(filter)
  } catch (e) {
    console.log(e);
    return [];
  }
});

ipcMain.handle('editCost', async (event, cost, filter) => {
  try {
    const costsList = await getCosts();
    if (!cost.date) {
      cost.date = new Date();
    }
    const index = costsList.findIndex(oldCost => oldCost.key === cost.key);
    costsList.splice(index, 1, cost);
    await fsPromises.writeFile(costsPath, JSON.stringify(costsList));
    return getCosts(filter);
  } catch (e) {
    console.log(e);
    return [];
  }
});

ipcMain.handle('deleteCost', async (event, cost, filter) => {
  try {
    const costsList = JSON.parse(await fsPromises.readFile(costsPath));
    const index = costsList.findIndex(oldCost => oldCost.key === cost.key);
    costsList.splice(index, 1);
    await fsPromises.writeFile(costsPath, JSON.stringify(costsList));
    return getCosts(filter);
  } catch (e) {
    console.log(e);
    return [];
  }
});

ipcMain.handle('addProfit', async (event, profit, filter) => {
  try {
    const profitsList = await getProfits();
    if (!profit.date) {
      profit.date = new Date();
    }
    const key = profitsList[profitsList.length - 1].key + 1;
    profitsList.push({ ...profit, key });
    await fsPromises.writeFile(profitsPath, JSON.stringify(profitsList));
    return getProfits(filter);
  } catch (e) {
    console.log(e);
    return [];
  }
});

ipcMain.handle('editProfit', async (event, profit, filter) => {
  try {
    const profitsList = await getProfits();
    if (!profit.date) {
      profit.date = new Date();
    }
    const index = profitsList.findIndex(oldProfit => oldProfit.key === profit.key);
    profitsList.splice(index, 1, profit);
    await fsPromises.writeFile(profitsPath, JSON.stringify(profitsList));
    return getProfits(filter);
  } catch (e) {
    console.log(e);
    return [];
  }
});

ipcMain.handle('deleteProfit', async (event, profit, filter) => {
  try {
    const profitsList = await getProfits();
    const index = profitsList.findIndex(oldProfit => oldProfit.key === profit.key);
    profitsList.splice(index, 1);
    await fsPromises.writeFile(profitsPath, JSON.stringify(profitsList));
    return getProfits(filter);
  } catch (e) {
    console.log(e);
    return [];
  }
});

const getProfits = async (filter) => {
  return JSON.parse(await fsPromises.readFile(profitsPath))
    .filter(profit => {
      if (filter && filter.searchText) {
        return profit.name.includes(filter.searchText);
      }
      return true;
    })
    .filter(profit => {
      if (filter && !!filter.dateFrom) {
        const dateFrom = new Date(filter.dateFrom);
        dateFrom.setHours(0);
        dateFrom.setMinutes(0);
        dateFrom.setSeconds(0);
        dateFrom.setMilliseconds(0);
        return dateFrom <= new Date(profit.date);
      }
      return true;
    })
    .filter(profit => {
      if (filter && filter.dateTo) {
        const dateTo = new Date(filter.dateTo);
        dateTo.setMinutes(0);
        dateTo.setSeconds(0);
        dateTo.setMilliseconds(0);
        dateTo.setHours(24);
        return dateTo > new Date(profit.date);
      }
      return true;
    })
    .sort((profit1, profit2) => {
      if (filter && filter.sortType) {
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
        if (filter) {
          return new Date(profit2.date) - new Date(profit1.date);
        } else {
          return profit1.key - profit2.key;
        }
      }
    });
}

ipcMain.handle('getProfits', async (event, filter) => {
  return getProfits(filter);
});

ipcMain.handle('getBalance', async (event, args) => {
  const profits = await getProfits();
  const costs = await getCosts();
  let res = 0;
  profits.forEach(p => res += p.price);
  costs.forEach(c => res -= c.price);
  return res;
});

ipcMain.handle('getDiagramDatas', async (event, month) => {
  try {
    let costs = JSON.parse(await fsPromises.readFile(costsPath));
    const result = [];
    costs = costs.filter(cost => month ? (new Date(cost.date)).getMonth() === month : true);
    costs.forEach(cost => {
      if (!result.some(category => category.label === cost.category)) {
        result.push({ label: cost.category });
      }
    });
    return result.map(category => {
      category.value = 0;
      costs.filter(cost => cost.category === category.label)
        .forEach(cost => {
          category.value += cost.price
        });
      return category;
    });
  }
  catch (e) {
    console.log(e)
    throw e;
  }
});

app.on('ready', () => {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
    },
  });
  Menu.setApplicationMenu(null);
  //win.webContents.openDevTools();
  win.loadFile('../client/dist/index.html');
})