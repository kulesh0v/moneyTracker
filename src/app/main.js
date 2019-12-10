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
      if (filter && filter.dateFrom) {
        return filter.dateFrom < cost.date;
      }
      return true;
    })
    .filter(cost => {
      if (filter && filter.dateTo) {
        return filter.dateTo > cost.date;
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
        return new Date(cost2.date) - new Date(cost1.date);
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

ipcMain.handle('addCategory', async (event, cost) => {
  try {
    const categories = await getCategories();
    const key = categories[categories.length - 1].key + 1;
    categories.push({ ...cost, key });
    await fsPromises.writeFile(categoriesPath, JSON.stringify(categories));
    return categories;
  } catch (e) {
    console.log(e);
    return [];
  }
});

ipcMain.handle('addCost', async (event, cost) => {
  try {
    const costsList = await getCosts();
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
    const costsList = await getCosts();
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
    const profitsList = await getProfits();
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
    const profitsList = await getProfits();
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
    const profitsList = await getProfits();
    const index = profitsList.findIndex(oldProfit => oldProfit.key === profit.key);
    profitsList.splice(index, 1);
    await fsPromises.writeFile(profitsPath, JSON.stringify(profitsList));
    return profitsList;
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
      if (filter && filter.dateFrom) {
        return filter.dateFrom < profit.date;
      }
      return true;
    })
    .filter(profit => {
      if (filter && filter.dateTo) {
        return filter.dateTo > profit.date;
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
        return new Date(profit2.date) - new Date(profit1.date);
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
})

ipcMain.handle('getDiagramDatas', async (event, month) => {
  try {
    const costs = JSON.parse(await fsPromises.readFile(costsPath));
    const result = [];
    costs.filter(cost => (new Date(cost.date).getMonth()) === month) // FIX: add year filter 
      .forEach(cost => {
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