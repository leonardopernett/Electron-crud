const { app, BrowserWindow, Menu , ipcMain} = require('electron');
const url = require('url');
const path = require('path');

//electron reload
require('electron-reload')(__dirname);

//variable globales
let mainWindow;
let productWindow;

 // start window principal
app.on('ready', () => {
   
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        title: 'electron crud',
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }));
 

    //start menu
    const principal = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(principal);
    //end menu 

    //closed window principal
    mainWindow.on('closed', () => {
        app.quit();
    })

})
//end window principal


//start ventana segundaria
const createProduct = () => {
    productWindow = new BrowserWindow({
        width: 400,
        height: 400,
        title: 'product',
        webPreferences: {
            nodeIntegration: true
        }
    })
    productWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/product.html'),
        protocol: 'file',
        slashes: true
    }))

    //productWidow.setMenu(null);
    productWindow.on('close', () => {
        productWindow = null;
    })
    
   
}
//end ventana segundaria


//envia los datos de la ventana producto a la rpincipal 
ipcMain.on('productNew', (e, newProduct) =>{
    mainWindow.webContents.send('productNew', newProduct);
    productWindow.close();
})


//template menu
const template = [
    {
        label: 'file',
        submenu: [
            {
                label: 'new Product',
                accelerator: 'Ctrl + N',
                click() {
                    createProduct();
                }
            },
            {
                label:'remove all product',
                click(){
                   mainWindow.webContents.send('removeproduct');
                }
            },
            {
                label:'exit',
                accelerator:process.platform=='darwin' ? 'command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
        
            }
        ]
    }
    
]

//si estamos en plataforma mac
if(process.platform==='darwin'){
    template.unshift({
        label:app.getName()
    })
}


//ingresar new item template 
if(process.env.NODE_ENV != 'production'){
    template.push({
        label:'DevTools',
        submenu:[
             {
                label:'show/hide Dev Tools',
                accelerator:process.platform=='darwin'? 'command + D': 'Ctrl + D',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools()
                }
             },
             {
                role: 'reload'
             }
        ]
    })
}

