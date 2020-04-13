$(document).ready(function(){
    console.log("youhouuu");

    const {ipcRenderer} = require('electron');

    ipcRenderer.on('file-view', (event,arg) =>{
      console.log(arg);
      $("body").html(arg);
    })
    
    ipcRenderer.send('file-init');
})
