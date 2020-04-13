var table;

$(document).ready(function(){

  const {ipcRenderer} = require('electron');
  var input = document.getElementById("search");

  ipcRenderer.send('init','');

  ipcRenderer.on('init-data', (event,arg) =>{
    console.log(arg);

    table = $('#content').DataTable( {
      data: arg,
      columns : [
        { "data" : "title"},
        {"data" : "file_name",
        "render" : function(data){
          return "<button class='file_name' id='file' >"+data+"</button>"
        }},
        { "data" : "meta1" },
        { "data" : "meta2" },
        { "data" : "meta3" },
        { "data" : "meta4" },
        { "data" : "meta5" }
      ],
      paging:   false,
      ordering: false,
      info:     false,
      scrollY:  "600px",
      scrollCollapse: true
    } );


  })

  input.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      table.search($('#search').val()).draw();
    }
  });

  $(".upload-popup").hide();

  $(".upload").click(function(){
    $(".upload-popup").fadeToggle();
  });

  $(".close").click(function(){
    $(".upload-popup").fadeOut();
  });

  $("input[name='submit']").click(function(){
    var file_path =  document.getElementById("file").files[0].path;
    var file_name =  document.getElementById("file").files[0].name;
    var title = $("input[name='title']").val();
    var meta1 = $("input[name='meta1']").val();
    var meta2 = $("input[name='meta2']").val();
    var meta3 = $("input[name='meta3']").val();
    var meta4 = $("input[name='meta4']").val();
    var meta5 = $("input[name='meta5']").val();

    if(file_path != "" && title != "" && meta1 != "" && meta2 != "" && meta3 != "" && meta4 != "" && meta5 != "")
    {
      let file =
      {
        id : Math.floor(Math.random() * Math.floor(10000000)),
        file_path : file_path,
        file_name : file_name,
        title : title,
        meta1 : meta1,
        meta2 : meta2,
        meta3 : meta3,
        meta4 : meta4,
        meta5 : meta5
      }
      ipcRenderer.send('upload-file', JSON.stringify(file));
    }
    else
    {
      //do nothing
    }

  })

$('#content').on('click', '.file_name', function() {
  console.log($(this).html());
    open_file($(this).html());
  })

  function open_file(file){
    console.log("pouet pouet");
    ipcRenderer.send('file-open',file);
  }

  $(".tag").click(function(){
    search_files($(this).val());
  });

  function search_files(value)
  {
    console.log("searching");
    ipcRenderer.send('search-file',value);
  }

});
