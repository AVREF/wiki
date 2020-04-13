const { app, BrowserWindow } = require('electron')
const electron = require('electron')
const {ipcMain} = require('electron')
var fs = require('fs')
var mammoth = require("mammoth");

let data_path = "data/data.json";
let win;
var db;
var html;

try {
  if (fs.existsSync(data_path)) {
    db= JSON.parse(fs.readFileSync(data_path));
  }
} catch(err) {
  console.error(err);
  db = "error : file not found";
}

function createWindow () {
  // creates app's window
 win = new BrowserWindow({
    width: 800,
    height: 800,
    useContentSize: true,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      devTools : true
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

ipcMain.on('upload-file', (event, arg) => {
  arg = JSON.parse(arg);
  fs.copyFile(arg.file_path, 'data/files/'+arg.file_name, (err) => {
    if (err) throw err
    console.log(db_add(arg));
  });

})

ipcMain.on('init', (event,arg) => {
  event.sender.send('init-data',db);
})

ipcMain.on('search-file',(event,arg) => {
 var result = db_search(arg);
 event.sender.send('init-data',result);
})

ipcMain.on('file-open',(event,arg) =>{
  let child = new BrowserWindow({
        parent: win,
        autoHideMenuBar: true,
        webPreferences: {
          nodeIntegration: true,
          devTools : true
        }

  });
  if(arg.includes(".docx"))
  {
    mammoth.convertToHtml({path: "data/files/"+arg})
      .then(function(result){
          html = result.value; // The generated HTML
          messages = result.messages; // Any messages, such as warnings during conversion
          child.loadFile("view/file.html");
      })
      .done();
  }else {
    console.log(arg + "=> unknown type");
  }
})

ipcMain.on('file-init',(event,arg) =>{
  event.sender.send('file-view',html);
})


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

}

function db_add(file){
  if(file.hasOwnProperty("title") && file.hasOwnProperty("file_name") && file.hasOwnProperty("meta1"))
  {
    db.push(file);
    fs.writeFile(data_path, JSON.stringify(db), (err) => {
      if (err) throw err;
      console.log('The file has been added');
    });
  }
}

function db_search(value){
  var result = [];

  for (var i = 0; i < db.length; i++){
    if (db[i].title.toLowerCase().includes(value.toLowerCase()) ||  db[i].meta1.toLowerCase().includes(value.toLowerCase()) || db[i].meta2.toLowerCase().includes(value.toLowerCase()) || db[i].meta3.toLowerCase().includes(value.toLowerCase())  || db[i].meta4.toLowerCase().includes(value.toLowerCase()) || db[i].meta5.toLowerCase().includes(value.toLowerCase())){
      result.push(db[i]);
    }
  }
  if(result.length > 0)
  {
    return result;
  }
  else {
    return "error: no match";
  }
}
