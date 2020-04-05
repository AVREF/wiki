const { app, BrowserWindow } = require('electron')
const electron = require('electron')
const {ipcMain} = require('electron')
const storage = require('electron-json-storage')
var fs = require('fs')

//connect to datafile
storage.get('catalog', function(error, data) {
  if (error) throw error;
  console.log("OK : database");
});

function createWindow () {
  // creates app's window
  let win = new BrowserWindow({
    width: 800,
    height: 1000,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // and load the index.html of the app.
  win.loadFile('view/search.html')
}

  // launch app when ready
  app.whenReady().then(createWindow)

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('add file'), (event, message) => {
    fs.copyFile(message, 'data/files/'+message, (err) => {
    if (err) throw err;
  });
  }


  app.on('activate', () => {
    // Sur macOS, il est commun de re-créer une fenêtre de l'application quand
    // l'icône du dock est cliquée et qu'il n'y a pas d'autres fenêtres d'ouvertes.
    if (win === null) {
      createWindow()
    }
  })

  /* functions for communication */

  /* database call */

  function search_file(value_array)
  {
    storage.getMany(value_array, function(error, data) {
      if (error) throw error;
      return data;
    });
  }
