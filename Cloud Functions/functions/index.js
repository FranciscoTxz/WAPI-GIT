//Libreberias extras
const cors = require("cors")({ origin: true });
const nodemailer = require('nodemailer'); //Para enviar correos
const axios = require('axios'); 
var fs2 = require('file-system');
const fs = require('fs');

//Pass kit generator para el Boleto Apple
const { PKPass } = require('passkit-generator');

// Servicio Firebase
const admin = require('firebase-admin');
const { initializeApp } = require("firebase-admin/app");
const { onRequest } = require("firebase-functions/v2/https");
const { getStorage, getDownloadURL } = require("firebase-admin/storage");
const { getFirestore } = require("firebase-admin/firestore");

//Para la autenticación y más
const { GoogleAuth } = require('google-auth-library');
const jwt = require('jsonwebtoken');

//inicializa la app firebase
initializeApp();

//API user token
const issuerId = '3388000000022328513';

//Clase del boleto a usar
const classId = `${issuerId}.clase_transito`;

const baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1';

const credentialsPath = 'prueba01-416514-c7ac038a6cfb.json';

// Carga las credenciales para el boleto de google desde el archivo
const credentials = JSON.parse(fs.readFileSync(credentialsPath));

// Crear un HTTP client usando GoogleAuth
const httpClient = new GoogleAuth({
  credentials: credentials,
  scopes: 'https://www.googleapis.com/auth/wallet_object.issuer'
});

//Funcion que crea el boleto de Google Wallet. Function tipo POST
exports.crearobjeto = onRequest(async (req, res) => {
  cors(req, res, async () => {
    // Parametros iniciales que recibe la funcion
    const id_boleto = req.query.id;
    const estado = req.query.e;
    const categoria = req.query.c;
    const usuario = req.query.u;
    const passengerNames = req.query.pn; 
    const seat = req.query.s;
    const id_viaje = req.query.iv;
    const purchaseReceiptNumber = req.query.prn;
    const cñ = req.query.cñ;

    //Saca todos los datos para crear el boleto
    //Sacar de tabla viajes con id_viaje
    const departureDateTime = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().departureDateTime; });
    const arrivalDateTime = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().arrivalDateTime; });
    const originStationCode = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().originStationCode; });
    const destinationStationCode = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().destinationStationCode; });
    const originName = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().originName; });
    const destinationName = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().destinationName; });
    const carriage = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().carriage; });
    const zone = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().zone; });
    const precio = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().precio; });

    //Sacar de tabla pagos con purchaseReceiptNumber
    const metodo_pago = await getFirestore().collection('pagos').doc(purchaseReceiptNumber).get().then(doc => { return doc.data().metodo_pago; });
    const token_facturacion = await getFirestore().collection('pagos').doc(purchaseReceiptNumber).get().then(doc => { return doc.data().token_facturacion; });

    //Regresar en caso que la contraseña sea incorrecta
    if (cñ != "Prueba1234") {
      res.json({ Error: `Clave incorrecta` });
      return;
    }

    //Instanciar el id del boleto
    let objectSuffix = `${id_boleto}`;
    let objectId = `${issuerId}.${objectSuffix}`;
    let response;
    let bandera;

    // Checar si el boleto existe
    try {
      response = await httpClient.request({
        url: `https://walletobjects.googleapis.com/walletobjects/v1/transitObject/${issuerId}.${objectSuffix}`,
        method: 'GET'
      });
      console.log(`Object ${issuerId}.${objectSuffix} already exists!`);
      bandera = 'true';
      //El boleto existe
    } catch (err) {
      if (err.response && err.response.status !== 404) {
        //Algo se salió mal ageno a que no existe
        console.log(`Object not found!`);
        console.log(err);
      }
      bandera = 'false';
      //El boleto no existe
    }

    //Json con todos los datos del boleto, json que se enviara para ser proesada por la API
    let ObjectT = {
      'id': `${objectId}`,
      'classId': classId,
      'state': 'ACTIVE',
      'textModulesData': [
        {
          'header': 'Metodo de pago',
          'body': `${metodo_pago}`,
          'id': 'METODO_PAGO'
        },
        {
          'header': 'Token de Facturación',
          'body': `${token_facturacion}`,
          'id': 'TOKEN_FACTURACION'
        },
        {
          'header': 'Categoria',
          'body': `${categoria}`,
          'id': 'CATEGORIA'
        },
        {
          'header': 'Estado del boleto',
          'body': `${estado}`,
          'id': 'ESTADO_BOLETO'
        },
      ],
      'barcode': {
        'type': 'QR_CODE',
        'value': `${id_boleto}`,
        "alternateText": `${id_boleto}`
      },
      "purchaseDetails": {
        "purchaseReceiptNumber": `${purchaseReceiptNumber}`,
        "ticketCost": {
          "purchasePrice": {
            "currencyCode": "MXN",
            "micros": `${precio}000000`,
          },
        }
      },
      'ticketNumber': `${id_boleto}`,
      'passengerType': 'SINGLE_PASSENGER',
      'passengerNames': `${passengerNames}`,
      'tripType': 'ONE_WAY',
      'ticketLeg': {
        'originStationCode': `${originStationCode}`,
        'originName': {
          'defaultValue': {
            'language': 'ES-419',
            'value': `${originName}`
          }
        },
        'destinationStationCode': `${destinationStationCode}`,
        'destinationName': {
          'defaultValue': {
            'language': 'ES-419',
            'value': `${destinationName}`
          }
        },
        'departureDateTime': `${departureDateTime}`,
        'arrivalDateTime': `${arrivalDateTime}`,
        "carriage": `${carriage}`,
        "zone": `${zone}`,
        "ticketSeats": [
          {
            "seat": `${seat}`,
          }
        ]
      }
    };

    // Crea la llamada firmada junto con los datos del boleto
    const claims = {
      iss: credentials.client_email,
      aud: 'google',
      origins: [],
      typ: 'savetowallet',
      payload: {
        transitObjects: [
          ObjectT
        ]
      }
    };

    // Crea el token firmado con las credenciales privadas
    const token = jwt.sign(claims, credentials.private_key, { algorithm: 'RS256' });

    // Crea el URL para guardar el boleto
    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;
    console.log('---Objeto creado---');

    //Agrega el boleto a la base de datos en caso que no exista el boleto
    if (bandera != 'true') {
      const writeResult = await getFirestore()
        .collection("boletos").doc(id_boleto)
        .set({ url: saveUrl, estado: estado, categoria: categoria, purchaseReceiptNumber: purchaseReceiptNumber, passengerNames: passengerNames, seat: seat, usuario: usuario, id_viaje: id_viaje });
    }
    //Regresa el URL del boleto en un json
    res.json({ LINK: `${saveUrl}` });
  });
});

//Funcion que actualiza el boleto de Google Wallet. Function tipo PUT
exports.actualizarobjeto = onRequest(async (req, res) => {
  cors(req, res, async () => {
    //Recibe los datos del boleto y la contraseña de operación
    const id_boleto = req.query.id;
    const cñ = req.query.cñ;

    //Regresa en caso que la contraseña sea incorrecta
    if (cñ != "Prueba1234") {
      res.json({ Error: `Clave incorrecta` });
      return;
    }

    //Saca todos los datos necesarios para actualizar el boleto
    //Sacar de tabla boletos con id_boletos
    const estado = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().estado; });
    const categoria = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().categoria; });
    const passengerNames = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().passengerNames; });
    const seat = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().seat; });
    const id_viaje = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().id_viaje; });
    const purchaseReceiptNumber = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().purchaseReceiptNumber; });

    //Sacar de tabla viajes con id_viajes
    const departureDateTime = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().departureDateTime; });
    const arrivalDateTime = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().arrivalDateTime; });
    const originStationCode = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().originStationCode; });
    const destinationStationCode = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().destinationStationCode; });
    const originName = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().originName; });
    const destinationName = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().destinationName; });
    const carriage = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().carriage; });
    const zone = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().zone; });
    const precio = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().precio; });

    //Sacar de tabla pagos con purchaseReceiptNumber
    const metodo_pago = await getFirestore().collection('pagos').doc(purchaseReceiptNumber).get().then(doc => { return doc.data().metodo_pago; });
    const token_facturacion = await getFirestore().collection('pagos').doc(purchaseReceiptNumber).get().then(doc => { return doc.data().token_facturacion; });

    //Instanciar el id del boleto
    let objectSuffix = `${id_boleto}`;
    let response;

    // Checar si el boleto existe y si si, guardar la informacion que recibe
    try {
      response = await httpClient.request({
        url: `https://walletobjects.googleapis.com/walletobjects/v1/transitObject/${issuerId}.${objectSuffix}`,
        method: 'GET'
      });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        res.json({ Error: `Object ${issuerId}.${objectSuffix} not found!` });
      } else {
        res.json({ Error: `${err}` });
      }
      console.log(err);
      return;
    }

    //Actualiza el boleto con los nuevos datos
    let updatedObject = response.data;
    updatedObject.textModulesData[0].body = `${metodo_pago}`;
    updatedObject.textModulesData[1].body = `${token_facturacion}`;
    updatedObject.textModulesData[2].body = `${categoria}`;
    updatedObject.textModulesData[3].body = `${estado}`;
    updatedObject.purchaseDetails.purchaseReceiptNumber = `${purchaseReceiptNumber}`;
    updatedObject.purchaseDetails.ticketCost.purchasePrice.micros = `${precio}000000`;
    updatedObject.passengerNames = `${passengerNames}`;
    updatedObject.ticketLeg.originStationCode = `${originStationCode}`;
    updatedObject.ticketLeg.originName.defaultValue.value = `${originName}`;
    updatedObject.ticketLeg.destinationStationCode = `${destinationStationCode}`;
    updatedObject.ticketLeg.destinationName.defaultValue.value = `${destinationName}`;
    updatedObject.ticketLeg.departureDateTime = `${departureDateTime}`;
    updatedObject.ticketLeg.arrivalDateTime = `${arrivalDateTime}`;
    updatedObject.ticketLeg.carriage = `${carriage}`;
    updatedObject.ticketLeg.zone = `${zone}`;
    updatedObject.ticketLeg.ticketSeat.seat = `${seat}`;

    //Envia la actualización del boleto
    const response2 = await httpClient.request({
      url: `https://walletobjects.googleapis.com/walletobjects/v1/transitObject/${issuerId}.${objectSuffix}`,
      method: 'PUT',
      data: updatedObject
    });

    //Regresa que el boleto fue actualizado
    res.json({ Todo_correcto: `---Actualizado---` });
  });
});

//Funcion que expira el boleto de Google Wallet. Function tipo PUT
exports.expirarobjeto = onRequest(async (req, res) => {
  cors(req, res, async () => {
    //Recibe los datos del boleto y la contraseña de operación
    const id_boleto = req.query.id;
    const cñ = req.query.cñ;

    //Identificación del boleto
    let objectSuffix = `${id_boleto}`;
    let response;

    //Regresa en caso que la contraseña sea incorrecta
    if (cñ != "Prueba1234") {
      res.json({ Error: `Clave incorrecta` });
      return;
    }

    // Checar si el boleto existe y si si, guardar la informacion que recibe
    try {
      response = await httpClient.request({
        url: `https://walletobjects.googleapis.com/walletobjects/v1/transitObject/${issuerId}.${objectSuffix}`,
        method: 'GET'
      });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.log(`Object not found!`);
        res.json({ Error: `Objeto no encontrado` });
      } else {
        // Error diferente
        console.log(err);
        res.json({ Error: `${err}` });
      }
      return;
    }
    //Toma el estado del boleto
    const estado = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().estado; });

    //Si el boleto esta vigente, lo cancela
    if (estado == 'Vigente') {
      let updatedObject = response.data;

      const tmd = updatedObject['textModulesData'];
      const objectX = tmd.find(item => item.id === 'ESTADO_BOLETO');
      objectX.body = 'Cancelado';

      updatedObject.state = 'EXPIRED';

      //Actualiza el boleto en Google Wallet
      response = await httpClient.request({
        url: `https://walletobjects.googleapis.com/walletobjects/v1/transitObject/${issuerId}.${objectSuffix}`,
        method: 'PUT',
        data: updatedObject
      });

      //Actualiza el estado del boleto en la base de datos
      try {
        const actualizarFirebase = await getFirestore().collection("boletos").doc(id_boleto).update({ estado: 'EXPIRADO' });
      } catch (err) {
        res.json({ Error: `${err}` });
      }

      console.log('---Cancelado---');
      res.json({ Todo_correcto: `---Cancelado---` });
    }
    //Si el boleto esta abordado, lo caduca
    else if (estado == 'Abordado') {
      let updatedObject = response.data;

      const tmd = updatedObject['textModulesData'];
      const objectX = tmd.find(item => item.id === 'ESTADO_BOLETO');
      objectX.body = 'Caducado';

      updatedObject.state = 'EXPIRED';

      //Actualiza el boleto en Google Wallet
      response = await httpClient.request({
        url: `https://walletobjects.googleapis.com/walletobjects/v1/transitObject/${issuerId}.${objectSuffix}`,
        method: 'PUT',
        data: updatedObject
      });

      //Actualiza el estado del boleto en la base de datos
      try {
        const actualizarFirebase = await getFirestore().collection("boletos").doc(id_boleto).update({ estado: 'EXPIRADO' });
      } catch (err) {
        res.json({ Error: `${err}` });
      }

      console.log('---Caducado---');
      res.json({ Todo_correcto: `---Caducado---` });
    }
  });
});

//Function que envia las notificaciones por MAIL. Function tipo POST
exports.mandarmail = onRequest(async (req, res) => {
  cors(req, res, async () => {
    //Recibe los datos del boleto y la contraseña de operación
    const id_boleto = req.query.id;
    const cñ = req.query.cñ;
    const tipo = req.query.tipo;

    //Regresa en caso que la contraseña sea incorrecta
    if (cñ != "Prueba1234") {
      res.json({ Error: `Clave incorrecta` });
      return;
    }

    //Datos del correo desde el que se va a enviar
    const senderEmail = "samaelxzx@gmail.com";
    const senderPassword = "arvg wqkl lrnq dsar"; //Contraseña de la cuenta de correo (token de gmail)

    //Obtener datos del usuario al que se le va a enviar el correo desde firebase
    const usuario = await getFirestore().collection('boletos').doc(id_boleto).get()
      .then(doc => { return doc.data().usuario; });
    if (usuario == null || usuario == undefined || usuario == "") {
      res.json({ Error: `Usuario no encontrado` });
      return;
    }
    //Obtener datos del boleto desde firebase
    const link = await getFirestore().collection('boletos').doc(id_boleto).get()
      .then(doc => { return doc.data().url; });
    const receiverEmail = await getFirestore().collection('usuarios').doc(usuario).get()
      .then(doc => { return doc.data().correo; });
    const id_viaje = await getFirestore().collection('boletos').doc(id_boleto).get()
      .then(doc => { return doc.data().id_viaje; });
    const origen = await getFirestore().collection('viajes').doc(id_viaje).get()
      .then(doc => { return doc.data().originName; });
    const destino = await getFirestore().collection('viajes').doc(id_viaje).get()
      .then(doc => { return doc.data().destinationName; });
    const fechaSalida = await getFirestore().collection('viajes').doc(id_viaje).get()
      .then(doc => { return doc.data().fechaSalida; });
    const fechaLlegada = await getFirestore().collection('viajes').doc(id_viaje).get()
      .then(doc => { return doc.data().fechaLlegada; });
    const horaSalida = await getFirestore().collection('viajes').doc(id_viaje).get()
      .then(doc => { return doc.data().horaSalida; });
    const horaLlegada = await getFirestore().collection('viajes').doc(id_viaje).get()
      .then(doc => { return doc.data().horaLlegada; });

    //Agrega el pdf del boleto
    const pdfAttachment = fs.readFileSync('Boleto.pdf');

    //Tipo 1: Notificación de creación de boleto
    if (tipo == "1") {
      //creacion de boleto
      const subject = '¡Gracias por tu compra! WAPI';
      //HTML del correo con la info y las variables obtenidas
      const htmlBody = `<!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Aviso de Boleto de Abordar</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
          }
      
          .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 800px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
      
          .content {
            flex-grow: 1;
            margin-right: 20px;
          }
      
          .success-message {
            color: green;
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 20px;
          }
      
          .yellow-section {
            background-color: yellow;
            padding: 20px;
            border-radius: 5px;
            flex-grow: 0;
          }

          @media (max-width: 767px) {
            .yellow-section {
              display: none;
              /* Oculta la sección en dispositivos móviles */
            }
          }
          
          .wapi{
            justify-content: center;
            font-size: 50px;
          }
          
          .title{
            text-align: center;
            font-size: 30px;
          }
          
          .sub{
            font-weight: bold;
          }
          
          .text{
            padding-left: 10px;
          }
          .button {
            display: inline-block;
            padding: 0px 30px;
            width: 100px;
            height: 50px;
            padding-bottom: 10px;
          }
          
          #button1 {
            background: url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Add_to_Google_Wallet_badge.svg/1024px-Add_to_Google_Wallet_badge.svg.png') no-repeat center center;
            background-size: contain;
          }
          
          #button2 {
            background: url('https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Add_to_Apple_Wallet_badge.svg/2560px-Add_to_Apple_Wallet_badge.svg.png') no-repeat center center;
            background-size: contain;
          }
          .botones{
            justify-content: center;
            align-items: center;
            text-align: center;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            max-width: 400px;
          }
      
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h1 class = "title">Aviso de Boleto de Abordar</h1>
            <p class="success-message">¡Gracias por tu compra!</p>
            <p class="sub">Se ha creado el boleto: ${id_boleto} </p>
            <p class="sub">Detalles del boleto:</p>
            <p class="text">Origen y Destino: ${origen}-${destino}</p>
            <p class="text">Fecha y hora de Salida: ${fechaSalida} ${horaSalida}</p>
            <p class="text">Fecha y hora de Llegada: ${fechaLlegada} ${horaLlegada}</p>
            <!-- Aquí puedes agregar los detalles del boleto -->
          </div>
          <div class="yellow-section">
            <h2 class="wapi">WAPI</h2>
          </div>
        </div>
        <div class="botones">
          <p style="font-weight: bold; padding: 10px;">¡Agrega tu boleto al Wallet!</p>
          <a href=${link} class="button" id="button1"></a>
          <a href='https://abrirboletoapple-klapxs6vqa-uc.a.run.app?id=${id_boleto}' class="button" id="button2"></a>
        </div>
      </body>
      </html>`;

      try {
        // Crear el transportador de correo 
        let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, 
          auth: {
            user: senderEmail,
            pass: senderPassword
          }
        });

        // Configurar datos del correo del que se envia
        let mailOptions = {
          from: senderEmail,
          to: receiverEmail,
          subject: subject,
          html: htmlBody,
          attachments: [
            {
              filename: 'boleto.pdf',
              content: pdfAttachment
            }
          ]
        };

        // Enviar correo con el objeto de transporte definido
        let info = await transporter.sendMail(mailOptions);
        //Avisa todo correcto
        res.json({ Todo_correcto: `${info.messageId}` });

      } catch (error) {
        //En caso de error, regresa el error
        res.json({ Error: `${error}` });
        return;
      }
    }
    //Tipo 2: Notificación de actualización de boleto
    else if (tipo == "2") {
      //Actualizacion de boleto
      const subject = '¡Hubo una actualización en tu boleto! WAPI';
      //HTML del correo con la info y las variables obtenidas
      const htmlBody = `<!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Aviso de Boleto de Abordar</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
          }
      
          .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 800px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
      
          .content {
            flex-grow: 1;
            margin-right: 20px;
          }
      
          .success-message {
            color: green;
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 20px;
          }
      
          .yellow-section {
            background-color: yellow;
            padding: 20px;
            border-radius: 5px;
            flex-grow: 0;
          }

          @media (max-width: 767px) {
            .yellow-section {
              display: none;
              /* Oculta la sección en dispositivos móviles */
            }
          }
          
          .wapi{
            justify-content: center;
            font-size: 50px;
          }
          
          .title{
            text-align: center;
            font-size: 30px;
          }
          
          .sub{
            font-weight: bold;
          }
          
          .text{
            padding-left: 10px;
          }
          .button {
            display: inline-block;
            padding: 0px 30px;
            width: 100px;
            height: 50px;
            padding-bottom: 10px;
          }
          
          #button1 {
            background: url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Add_to_Google_Wallet_badge.svg/1024px-Add_to_Google_Wallet_badge.svg.png') no-repeat center center;
            background-size: contain;
          }
          
          #button2 {
            background: url('https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Add_to_Apple_Wallet_badge.svg/2560px-Add_to_Apple_Wallet_badge.svg.png') no-repeat center center;
            background-size: contain;
          }
          .botones{
            justify-content: center;
            align-items: center;
            text-align: center;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            max-width: 400px;
          }
      
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h1 class = "title">Aviso de Boleto de Abordar</h1>
            <p class="success-message">¡Hubo una actualización en tu pase de abordar!, lamentamos los inconvenientes.</p>
            <p class="sub">Boleto actualizado: ${id_boleto}</p>
            <p class="sub">Detalles del boleto:</p>
            <p class="text">Origen y Destino: ${origen} - ${destino}</p>
            <p class="text">Fecha y hora de Salida: ${fechaSalida} ${horaSalida}</p>
            <p class="text">Fecha y hora de Llegada: ${fechaLlegada} ${horaLlegada}</p>
            <!-- Aquí puedes agregar los detalles del boleto -->
          </div>
          <div class="yellow-section">
            <h2 class="wapi">WAPI</h2>
          </div>
        </div>
        <div class="botones">
          <p style="font-weight: bold; padding: 10px;">¡Checa los detalles aquí!</p>
          <a href=${link} class="button" id="button1"></a>
          <a href='https://abrirboletoapple-klapxs6vqa-uc.a.run.app?id=${id_boleto}' class="button" id="button2"></a>
        </div>
      </body>
      </html>
      `;

      try {
        // Crear el transportador de correo
        let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: senderEmail,
            pass: senderPassword
          }
        });

        // Configurar la información del correo que envia
        let mailOptions = {
          from: senderEmail,
          to: receiverEmail,
          subject: subject,
          html: htmlBody,
          attachments: [
            {
              filename: 'boleto.pdf',
              content: pdfAttachment
            }
          ]
        };

        // Envia con el transporte definido
        let info = await transporter.sendMail(mailOptions);
        //Avisa que todo salio bien
        res.json({ Todo_correcto: `${info.messageId}` });

      } catch (error) {
        //En caso de error, regresa el error
        res.json({ Error: `${error}` });
        return;
      }
    }
    res.json({ FIN: `FIN` });
  });
});

//Function que crea o actualiza un viaje en la base de datos. Function tipo POST, PUT
exports.caviajes = onRequest(async (req, res) => {
  cors(req, res, async () => {

    //Recibe los datos del viaje y la contraseña de operación
    const id_viaje = req.query.id;
    const originStationCode = req.query.osc;
    const destinationStationCode = req.query.dsc;
    const originName = req.query.on;
    const destinationName = req.query.dn;
    const carriage = req.query.c;
    const zone = req.query.z;
    const horaSalida = req.query.hs;
    const horaLlegada = req.query.hl;
    const fechaSalida = req.query.fs;
    const fechaLlegada = req.query.fl;
    const precio = req.query.p;
    const cñ = req.query.cñ;

    //Regresa en caso que la contraseña sea incorrecta
    if (cñ != "Prueba1234") {
      res.json({ Error: `Clave incorrecta` });
      return;
    }

    //Crea el objeto de fecha y hora de salida y llegada
    const departureDateTime = `${fechaSalida}T${horaSalida}:00-06:00`;
    const arrivalDateTime = `${fechaLlegada}T${horaLlegada}:00-06:00`;

    try {
      //Crea o actualiza el viaje en la base de datos
      const final = await getFirestore().collection('viajes').doc(id_viaje)
        .set({ departureDateTime: departureDateTime, arrivalDateTime: arrivalDateTime, originStationCode: originStationCode, destinationStationCode: destinationStationCode, originName: originName, destinationName: destinationName, carriage: carriage, zone: zone, horaSalida: horaSalida, horaLlegada: horaLlegada, fechaSalida: fechaSalida, fechaLlegada: fechaLlegada, precio: precio });
      res.json({ Todo_correcto: `---Creado---` });
    }
    catch (err) {
      //En caso de error, regresa el error
      res.json({ Error: `Error al crear: ${err}` });
    }
  });
});

//Funcion que abre el link del boleto. Function tipo GET
exports.abrirlink = onRequest(async (req, res) => {
  cors(req, res, async () => {
    //Recibe el id del boleto
    const id_boleto = req.query.id;

    try {
      //Obtiene el link del boleto
      const LINK = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().url; });
      //Redirige al link del boleto
      res.redirect(`${LINK}`);
    }
    catch (err) {
      //En caso de error, regresa el error
      res.json({ Error: `Error al abrir link: ${err}` });
    }
  });
});

//Functions que mandan notificaciones por WhatsApp. Function tipo POST
exports.mandarwhats = onRequest(async (req, res) => {
  cors(req, res, async () => {
    const id_boleto = req.query.id;
    const tipo = req.query.tipo;
    const cñ = req.query.cñ;

    if (cñ != "Prueba1234") {
      res.json({ Error: `Clave incorrecta` });
      return;
    }
    //Permanente
    const token = 'EAANuAJBnLw0BO9lZAZAEtlVI5ZAvLmRDtv3eReZCSQkwUALEpnzC5Aymcvtjb3LtCUnKKOEf7YfPRUkj9a4ZAGToYzBVxNEBJO4ZAiDThOk17eDiqoCZBSFxhCY1jXl9TTtcUvoHc7ICV3TWxbOLv5OqzktLE4Op3ncBn0dGdeSrc3zqDsC0nWeOkvZCiND3VIYAz6lk71pGZBoRQ4H3FDYhXUUVz0j1TyDGTdvllWp06cJIIs4MjJRAN';
    const id_tel = '291233497397177'

    const headers = { //Se debe de actualizar cada 24 horas
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };

    try {
      const id_viaje = await getFirestore().collection('boletos').doc(id_boleto).get()
        .then(doc => { return doc.data().id_viaje; });
      if (id_viaje == null || id_viaje == undefined || id_viaje == "") {
        res.json({ Error: `Viaje no encontrado` });
        return;
      }
      const origen = await getFirestore().collection('viajes').doc(id_viaje).get()
        .then(doc => { return doc.data().originName; });
      const destino = await getFirestore().collection('viajes').doc(id_viaje).get()
        .then(doc => { return doc.data().destinationName; });
      const fechaSalida = await getFirestore().collection('viajes').doc(id_viaje).get()
        .then(doc => { return doc.data().fechaSalida; });
      const fechaLlegada = await getFirestore().collection('viajes').doc(id_viaje).get()
        .then(doc => { return doc.data().fechaLlegada; });
      const horaSalida = await getFirestore().collection('viajes').doc(id_viaje).get()
        .then(doc => { return doc.data().horaSalida; });
      const horaLlegada = await getFirestore().collection('viajes').doc(id_viaje).get()
        .then(doc => { return doc.data().horaLlegada; });
      const usuario = await getFirestore().collection('boletos').doc(id_boleto).get()
        .then(doc => { return doc.data().usuario; });
      const numero = await getFirestore().collection('usuarios').doc(usuario).get()
        .then(doc => { return doc.data().numero; });
      if (tipo == '1') {
        const body = {
          "messaging_product": "whatsapp",
          "to": `52${numero}`,
          "type": "template",
          "template": {
            "name": "avisarcreacion",
            "language": { "code": "es_MX" },
            "components": [
              {
                "type": "BODY",
                "parameters": [
                  { "type": "TEXT", "text": `${id_boleto}` },
                  { "type": "TEXT", "text": `${origen}` },
                  { "type": "TEXT", "text": `${destino}` },
                  { "type": "TEXT", "text": `${fechaSalida}` },
                  { "type": "TEXT", "text": `${horaSalida}` },
                  { "type": "TEXT", "text": `${fechaLlegada}` },
                  { "type": "TEXT", "text": `${horaLlegada}` }
                ]
              },
              {
                "type": "BUTTON",
                "sub_type": "url",
                "index": "0",
                "parameters": [
                  { "type": "TEXT", "text": `${id_boleto}` }
                ]
              },
              {
                "type": "BUTTON",
                "sub_type": "url",
                "index": "1",
                "parameters": [
                  { "type": "TEXT", "text": `${id_boleto}` }
                ]
              }
            ]
          }
        };
        axios.post(`https://graph.facebook.com/v18.0/${id_tel}/messages`, body, { headers })
          .then(response => {
            res.json({ Todo_correcto: `Mensaje enviado` });
          })
          .catch(error => {
            res.json({ Error: `Error al enviar mensaje: ${error}` });
            return;
          });
      }
      else if (tipo == '2') {
        const body = {
          "messaging_product": "whatsapp",
          "to": `52${numero}`,
          "type": "template",
          "template": {
            "name": "avisaractualizacion",
            "language": { "code": "es_MX" },
            "components": [
              {
                "type": "BODY",
                "parameters": [
                  { "type": "TEXT", "text": `${id_boleto}` },
                  { "type": "TEXT", "text": `${origen}` },
                  { "type": "TEXT", "text": `${destino}` },
                  { "type": "TEXT", "text": `${fechaSalida}` },
                  { "type": "TEXT", "text": `${horaSalida}` },
                  { "type": "TEXT", "text": `${fechaLlegada}` },
                  { "type": "TEXT", "text": `${horaLlegada}` }
                ]
              },
              {
                "type": "BUTTON",
                "sub_type": "url",
                "index": "0",
                "parameters": [
                  { "type": "TEXT", "text": `${id_boleto}` }
                ]
              },
              {
                "type": "BUTTON",
                "sub_type": "url",
                "index": "1",
                "parameters": [
                  { "type": "TEXT", "text": `${id_boleto}` },
                ]
              }
            ]
          }
        };
        axios.post(`https://graph.facebook.com/v18.0/${id_tel}/messages`, body, { headers })
          .then(response => {
            res.json({ Todo_correcto: `Mensaje enviado` });
          })
          .catch(error => {
            res.json({ Error: `Error al enviar mensaje: ${error}` });
            return;
          });
      }
      else if (tipo == '3') {
        const body = {
          "messaging_product": "whatsapp",
          "to": `52${numero}`,
          "type": "template",
          "template": {
            "name": "avisarabordado",
            "language": { "code": "es_MX" },
            "components": [
              {
                "type": "BODY",
                "parameters": [
                  { "type": "TEXT", "text": `${id_boleto}` },
                ]
              }
            ]
          }
        };
        axios.post(`https://graph.facebook.com/v18.0/${id_tel}/messages`, body, { headers })
          .then(response => {
            res.json({ Todo_correcto: `Mensaje enviado` });
          })
          .catch(error => {
            res.json({ Error: `Error al enviar mensaje: ${error}` });
            return;
          });
      }
    } catch (err) {
      res.json({ Error: `Error al enviar mensaje: ${err}` });
    }
  });
});

//Function que crea y actuaiza un boleto en la base de datos. Function tipo POST
exports.crearboletoapple = onRequest(async (req, res) => {
  cors(req, res, async () => {
    //Recibe los datos del boleto y la contraseña de operación
    const id_boleto = req.query.id;
    const cñ = req.query.cñ;

    //Regresa en caso que la contraseña sea incorrecta
    if (cñ != "Prueba1234") {
      res.json({ Error: `Clave incorrecta` });
      return;
    }

    //Sacar de tabla boletos con id_boletos
    const estado = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().estado; });
    const categoria = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().categoria; });
    const passengerNames = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().passengerNames; });
    const seat = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().seat; });
    const id_viaje = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().id_viaje; });
    const purchaseReceiptNumber = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().purchaseReceiptNumber; });

    //Sacar de tabla viajes con id_viajes
    const fechaSalida = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().fechaSalida; });
    const fechaLlegada = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().fechaLlegada; });
    const horaSalida = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().horaSalida; });
    const horaLlegada = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().horaLlegada; });
    const originStationCode = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().originStationCode; });
    const destinationStationCode = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().destinationStationCode; });
    const originName = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().originName; });
    const destinationName = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().destinationName; });
    const carriage = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().carriage; });
    const zone = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().zone; });
    const precio = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().precio; });

    //Sacar de tabla pagos con purchaseReceiptNumber
    const metodo_pago = await getFirestore().collection('pagos').doc(purchaseReceiptNumber).get().then(doc => { return doc.data().metodo_pago; });
    const token_facturacion = await getFirestore().collection('pagos').doc(purchaseReceiptNumber).get().then(doc => { return doc.data().token_facturacion; });

    //Crea una referencia al storage de firebase
    var storageRef = admin.storage().bucket();

    //Crea el boleto de Apple Wallet con la liberbia PassKit. Se ayuda de todos los datos obtenidos
    PKPass.from({
      model: './model/custom.pass',
      //Lee todos los certificados necesarios
      certificates: {
        wwdr: fs2.fs.readFileSync('./certs/wwdr.pem'),
        signerCert: fs2.fs.readFileSync('./certs/signerCert.pem'),
        signerKey: fs2.fs.readFileSync('./certs/signerKey.pem'),
        signerKeyPassphrase: 'talend',
      },
    },
      {
        authenticationToken: '123456789123456789',
        webServiceURL: 'https://actualizarapple-klapxs6vqa-uc.a.run.app',
        serialNumber: `${id_boleto}`,
        description: 'Boleto de autobus',
        logoText: 'WAPI',
        foregroundColor: "rgb(255,255,255)",
        backgroundColor: "rgb(139,27,27)",
        labelColor: "rgb(255,255,255)",
      },)
      .then(async (newPass) => {
        newPass.headerFields.push(
          {
            value: `${id_boleto}`,
            label: "Boleto",
            key: "id_boleto"
          }
        )
        newPass.auxiliaryFields.push(
          {
            value: `${horaSalida}`,
            label: "Hora Salida",
            key: "hora_salida",
            textAlignment: "PKTextAlignmentCenter"
          },
          {
            key: "fecha_salida",
            value: `${fechaSalida}`,
            label: "Fecha Salida",
            textAlignment: "PKTextAlignmentCenter"
          },
          {
            value: `${seat}`,
            label: "Asiento",
            key: "asiento",
            textAlignment: "PKTextAlignmentCenter"
          }
        )
        newPass.primaryFields.push(
          {
            label: `${originName}`,//completo
            value: `${originStationCode}`,//code
            key: "origen",
            textAlignment: "PKTextAlignmentLeft"
          },
          {
            value: `${destinationStationCode}`, //code
            label: `${destinationName}`, //completo
            key: "destino",
            textAlignment: "PKTextAlignmentRight"
          }
        ),
          newPass.secondaryFields.push(
            {
              value: `${passengerNames}`,
              label: "Pasajero(s)",
              key: "pasajeros",
              textAlignment: "PKTextAlignmentLeft"
            },
            {
              value: `${categoria}`,
              label: "Categoria",
              key: "categorias",
              textAlignment: "PKTextAlignmentRight"
            }
          )
        newPass.backFields.push(
          {
            key: "hora_llegada",
            value: `${horaLlegada}`,
            label: "Hora Llegada",
            textAlignment: "PKTextAlignmentCenter"
          },
          {
            key: "fecha_llegada",
            value: `${fechaLlegada}`,
            label: "Fecha Llegada",
            textAlignment: "PKTextAlignmentCenter"
          },
          {
            value: `${zone}`,
            label: "Zona",
            key: "zona",
            textAlignment: "PKTextAlignmentCenter"
          },
          {
            value: `${carriage}`,
            label: "Autobus",
            key: "carriage",
            textAlignment: "PKTextAlignmentCenter"
          },
          {
            value: `${purchaseReceiptNumber}`,
            label: "Número de recibo",
            key: "num_recibo",
            textAlignment: "PKTextAlignmentCenter"
          },
          {
            label: "Precio",
            value: `${precio}`,
            key: "precio",
            textAlignment: "PKTextAlignmentCenter"
          },
          {
            value: `${metodo_pago}`,
            label: "Metodo de Pago",
            key: "metodo_pago",
            textAlignment: "PKTextAlignmentCenter"
          },
          {
            value: `${token_facturacion}`,
            label: "Token de facturación",
            textAlignment: "PKTextAlignmentCenter",
            key: "token_facturacion"
          },
          {
            label: "Estado Boleto",
            value: `${estado}`,
            key: "estado",
            textAlignment: "PKTextAlignmentCenter"
          },
          {
            attributedValue: "https://www.wapi.com",
            key: "web",
            value: `WEB`,
            label: "Pagina WEB",
            textAlignment: "PKTextAlignmentCenter"
          }
        )
        newPass.setBarcodes(
          {
            message: `${id_boleto}`,
            format: "PKBarcodeFormatQR",
            messageEncoding: "iso-8859-1"
          }
        )

        //Guarda el boleto en storage, si existe lo sobreescribe (lo actualiza)
        const bufferData = newPass.getAsBuffer();
        storageRef.file(`passes/${id_boleto}A.pkpass`).save(bufferData, (error) => {
          if (error) {
            //En caso de error, regresa el error
            res.json({ Error_saving: `${error}` });
          } else {
            //Regresa que todo salio bien
            res.json({ Todo_correcto: `Guardado` });
          }
        })
      })
  });
});

//Function que abre el boleto de Apple Wallet. Function tipo GET
exports.abrirboletoapple = onRequest(async (req, res) => {
  cors(req, res, async () => {
    //Recibe el id del boleto
    const id = req.query.id;
    try {
      //Obtiene el link del boleto desde storage
      const fileRef = getStorage().bucket().file(`passes/${id}A.pkpass`);
      const downloadURL = await getDownloadURL(fileRef);
      //Redirige al link del boleto
      res.redirect(downloadURL);
    } catch (err) {
      //En caso de error, regresa el error
      res.json({ Error: `${err}` });
    }
  });
});