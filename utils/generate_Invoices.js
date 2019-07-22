var fs = require('fs');
var path = require('path');
var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');
var dateTime = require('node-datetime');
const docx = require("@nativedocuments/docx-wasm");



exports.createDocx = function(data,sup,cust,ba, callback){


    createInvoice1(data,sup,cust);
    createInvoice2(4000,sup,ba);
    createInvoice3(4000,ba,cust);
   
    callback(true);
}

exports.createPDF = function(data, callback){
    docx.init({
        ND_DEV_ID: "42MTM7UUPD62SFQI4EE1NKQL0B",    // goto https://developers.nativedocuments.com/ to get a dev-id/dev-secret
        ND_DEV_SECRET: "145NKAITU88NVDMT75A3E4B4RP", // you can also set the credentials in the enviroment variables
        ENVIRONMENT: "NODE", // required
        LAZY_INIT: true      // if set to false the WASM engine will be initialized right now, usefull pre-caching (like e.g. for AWS lambda)
    }).catch( function(e) {
        console.error(e);
    });
    
    async function convertHelper(document, exportFct) {
        const api = await docx.engine();
        await api.load(document);
        const arrayBuffer = await api[exportFct]();
        await api.close();
        return arrayBuffer;
    }

    convertHelper("./invoices/invoice1.docx", "exportPDF").then((arrayBuffer) => {
        fs.writeFileSync("./public/pdf/invoice1.pdf", new Uint8Array(arrayBuffer));
    }).catch((e) => {
        console.error(e);
    });
    convertHelper("./invoices/invoice2.docx", "exportPDF").then((arrayBuffer) => {
        fs.writeFileSync("./public/pdf/invoice2.pdf", new Uint8Array(arrayBuffer));
    }).catch((e) => {
        console.error(e);
    });
    convertHelper("./invoices/invoice3.docx", "exportPDF").then((arrayBuffer) => {
        fs.writeFileSync("./public/pdf/invoice3.pdf", new Uint8Array(arrayBuffer));
    }).catch((e) => {
        console.error(e);
    });
    fs.watchFile("./public/pdf/invoice1.pdf", (curr,prev)=>{
        callback(true);
    })
    
};

function createInvoice1(data,sup,cust){
    var itemsSubT = 0;
    var quantity = 1;
    var invoice_items = [];
    for(var i=0; i<data.length;i++){
        invoice_items[i] = [{
                pDescription: data[i][0],
                pCode: data[i][1],
                pQuan:data[i][2],
                pPrice: data[i][3],
                pTotal: data[i][3] * data[i][2]
            },
        ];
        itemsSubT = itemsSubT + (data[i][3] * data[i][2]);
    }
    // console.log(data);
    // console.log(invoice_items);
    var content = fs
        .readFileSync(path.resolve(__dirname, '../templates/DS_invoice.docx'), 'binary');

    var zip = new JSZip(content);
    var doc = new Docxtemplater();
    var dt = dateTime.create().format('Y-m-d'); 
    
    doc.loadZip(zip);
    //set the templateVariables
    doc.setData({
        sName: sup.SupplierName,
        sRegNo: sup.Supp_CompRegNo,
        sAddressNum: sup.Addr_Number,
        sStreet: sup.Addr_Street,
        sCity: sup.Addr_City,
        invNo:'inv7007',
        date: dt,
        custAccNo: "SA75001Vxx",
        terms:'',
        rName: cust.Cust_Name,
        rAddressNum:cust.Addr_Number,
        rStreet:cust.Addr_Street,
        rCity: cust.Addr_City,
        rCountry: cust.Addr_Country,
        cName : cust.Pers_ContactName,
        cNum: cust.Pers_Number,
        cEmail: cust.Pers_Email,
        items: invoice_items,
        subT: itemsSubT,
        vat:'',
        shipHan:'',
        disc:'',
        total:itemsSubT,
        footNote:sup.InvoiceFootNote,
    });
    try {
        // render the document ie replace the variables
        doc.render()
    }
    catch (error) {
        var e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        }
        console.log(JSON.stringify({error: e}));
        throw error;
    }
    
    var buf = doc.getZip()
                 .generate({type: 'nodebuffer'});
    fs.writeFileSync(path.resolve(__dirname, '../invoices/invoice1.docx'), buf);
}

function createInvoice2(data,sup,cust){
    var content = fs
    .readFileSync(path.resolve(__dirname, '../templates/DS_invoice1.docx'), 'binary');

var zip = new JSZip(content);
var doc = new Docxtemplater();
var dt = dateTime.create().format('Y-m-d'); 


doc.loadZip(zip);
//set the templateVariables
doc.setData({
    sName: sup.SupplierName,
    sRegNo: sup.Supp_CompRegNo,
    sAddressNum: sup.Addr_Number,
    sStreet: sup.Addr_Street,
    sCity: sup.Addr_City,
    invNo:'inv7007',
    date: dt,
    custAccNo: "SA75001Vxx",
    terms:'',
    rName: cust.Cust_Name,
    rAddressNum:cust.Addr_Number,
    rStreet:cust.Addr_Street,
    rCity: cust.Addr_City,
    rCountry: cust.Addr_Country,
    cName : cust.Pers_ContactName,
    cNum: cust.Pers_Number,
    cEmail: cust.Pers_Email,
    pDescription:'Ferari Licence Management, SPecification Management &',
    pCode: 'N/A',
    pQuan: 'N/A',
    pPrice: 'N/A',
    pTotal: data,
    ordering: 'ordering',
    invNo: 'INV7007',
    custAcc:'SA75001Vxx',
    subT: data,
    vat:'',
    shipHan:'',
    disc:'',
    total:data,
    footNote:sup.invoiceNote
});

try {
    // render the document ie replace the variables
    doc.render()
}
catch (error) {
    var e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
    }
    console.log(JSON.stringify({error: e}));
    throw error;
}

var buf = doc.getZip()
             .generate({type: 'nodebuffer'});
fs.writeFileSync(path.resolve(__dirname, '../invoices/invoice2.docx'), buf);
}
function createInvoice3(data,sup,cust){
    var content = fs
    .readFileSync(path.resolve(__dirname, '../templates/DS_invoice1.docx'), 'binary');

var zip = new JSZip(content);
var doc = new Docxtemplater();
var dt = dateTime.create().format('Y-m-d');

doc.loadZip(zip);
//set the templateVariables
doc.setData({
    sName: sup.SupplierName,
    sRegNo: sup.Supp_CompRegNo,
    sAddressNum: sup.Addr_Number,
    sStreet: sup.Addr_Street,
    sCity: sup.Addr_City,
    invNo:'inv7007',
    date: dt,
    custAccNo: "SA75001Vxx",
    terms:'',
    rName: cust.Cust_Name,
    rAddressNum:cust.Addr_Number,
    rStreet:cust.Addr_Street,
    rCity: cust.Addr_City,
    rCountry: cust.Addr_Country,
    cName : cust.Pers_ContactName,
    cNum: cust.Pers_Number,
    cEmail: cust.Pers_Email,
    pDescription:'Buying Agent Services',
    pCode: 'N/A',
    pQuan: 'N/A',
    pPrice: 'N/A',
    pTotal: data,
    ordering: '(Incl. registration and management of Ferari Contact Club membership)',
    invNo: 'INV7007',
    subT: data,
    vat:'',
    shipHan:'',
    disc:'',
    total:data,
    footNote:sup.invoiceNote
});

try {
    // render the document ie replace the variables
    doc.render()
}
catch (error) {
    var e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
    }
    console.log(JSON.stringify({error: e}));
    throw error;
}

var buf = doc.getZip()
             .generate({type: 'nodebuffer'});
fs.writeFileSync(path.resolve(__dirname, '../invoices/invoice3.docx'), buf);
}