const {ipcRenderer} = require('electron')

(function () {
        var holder = document.getElementById('body');

        holder.ondragover = () => {
            return false;
        };

        holder.ondragleave = () => {
            return false;
        };

        holder.ondragend = () => {
            return false;
        };

        holder.ondrop = (e) => {
            e.preventDefault();

            for (let f of e.dataTransfer.files) {
                f.pathipcRenderer.send('add file', f.path)
            }

            return false;
        };
    })();
