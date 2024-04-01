// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { onRequest } = require("firebase-functions/v2/https");
const cors = require("cors")({ origin: true });
const nodemailer = require('nodemailer');
const axios = require('axios');

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

//Para la autenticación y más
const { GoogleAuth } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { type } = require("os");

initializeApp();

// TODO: Define Issuer ID
const issuerId = '3388000000022328513';

// TODO: Define Class ID
const classId = `${issuerId}.clase_transito`;

const baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1';

const credentialsPath = 'prueba01-416514-c7ac038a6cfb.json';

// Carga las credenciales desde el archivo
const credentials = JSON.parse(fs.readFileSync(credentialsPath));

const httpClient = new GoogleAuth({
  credentials: credentials,
  scopes: 'https://www.googleapis.com/auth/wallet_object.issuer'
});

// Take the text parameter passed to this HTTP endpoint and insert it into
exports.crearobjeto = onRequest(async (req, res) => {
  cors(req, res, async () => {
    // Parametros iniciales
    const id_boleto = req.query.id; //se queda
    const estado = req.query.e;//se queda
    const categoria = req.query.c;//se queda
    const usuario = req.query.u;//se queda
    const passengerNames = req.query.pn; //se queda
    const seat = req.query.s;//se queda
    const id_viaje = req.query.iv;
    const purchaseReceiptNumber = req.query.prn;//se queda
    const cñ = req.query.cñ;//se queda

    //sacar de tabla viajes con id_viajes
    const departureDateTime = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().departureDateTime; });
    const arrivalDateTime = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().arrivalDateTime; });
    const originStationCode = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().originStationCode; });
    const destinationStationCode = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().destinationStationCode; });
    const originName = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().originName; });
    const destinationName = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().destinationName; });
    const carriage = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().carriage; });
    const zone = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().zone; });
    const precio = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().precio; });

    //sacar de tabla pagos con purchaseReceiptNumber
    const metodo_pago = await getFirestore().collection('pagos').doc(purchaseReceiptNumber).get().then(doc => { return doc.data().metodo_pago; });
    const token_facturacion = await getFirestore().collection('pagos').doc(purchaseReceiptNumber).get().then(doc => { return doc.data().token_facturacion; });
    

    if (cñ != "Prueba1234") {
      res.json({ Error: `Clave incorrecta` });
      return;
    }

    let objectSuffix = `${id_boleto}`;
    let objectId = `${issuerId}.${objectSuffix}`;
    let response;
    let bandera;

    // Check if the object exists
    try {
      response = await httpClient.request({
        url: `https://walletobjects.googleapis.com/walletobjects/v1/transitObject/${issuerId}.${objectSuffix}`,
        method: 'GET'
      });
      console.log(`Object ${issuerId}.${objectSuffix} already exists!`);
      bandera = 'true';
    } catch (err) {
      if (err.response && err.response.status !== 404) {
        // Something else went wrong...
        console.log(`Object not found!`);
        console.log(err);
      }
      bandera = 'false';
    }

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

    // TODO: Create the signed JWT and link
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

    const token = jwt.sign(claims, credentials.private_key, { algorithm: 'RS256' });
    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;
    console.log('---Objeto creado---');

    // Push the new message into Firestore using the Firebase Admin SDK.
    if (bandera != 'true') {
      const writeResult = await getFirestore()
        .collection("boletos").doc(id_boleto)
        .set({ url: saveUrl, estado: estado, categoria: categoria, purchaseReceiptNumber: purchaseReceiptNumber, passengerNames: passengerNames, seat: seat, usuario: usuario, id_viaje: id_viaje });
    }
    res.json({ LINK: `${saveUrl}` });
  });
});

exports.actualizarobjeto = onRequest(async (req, res) => {
  cors(req, res, async () => {
    const id_boleto = req.query.id;
    const cñ = req.query.cñ;

    //sacar de tabla boletos con id_boletos
    const estado = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().estado; });
    const categoria = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().categoria; });
    const passengerNames = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().passengerNames; });
    const seat = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().seat; });
    const id_viaje = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().id_viaje; });
    const purchaseReceiptNumber = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().purchaseReceiptNumber; });

    //sacar de tabla viajes con id_viajes
    const departureDateTime = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().departureDateTime; });
    const arrivalDateTime = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().arrivalDateTime; });
    const originStationCode = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().originStationCode; });
    const destinationStationCode = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().destinationStationCode; });
    const originName = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().originName; });
    const destinationName = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().destinationName; });
    const carriage = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().carriage; });
    const zone = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().zone; });
    const precio = await getFirestore().collection('viajes').doc(id_viaje).get().then(doc => { return doc.data().precio; });

    //sacar de tabla pagos con purchaseReceiptNumber
    const metodo_pago = await getFirestore().collection('pagos').doc(purchaseReceiptNumber).get().then(doc => { return doc.data().metodo_pago; });
    const token_facturacion = await getFirestore().collection('pagos').doc(purchaseReceiptNumber).get().then(doc => { return doc.data().token_facturacion; });

    if (cñ != "Prueba1234") {
      res.json({ Error: `Clave incorrecta` });
      return;
    }

    let objectSuffix = `${id_boleto}`;

    let response;
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

    const response2 = await httpClient.request({
      url: `https://walletobjects.googleapis.com/walletobjects/v1/transitObject/${issuerId}.${objectSuffix}`,
      method: 'PUT',
      data: updatedObject
    });



    res.json({ Todo_correcto: `---Actualizado---` });
  });
});

exports.expirarobjeto = onRequest(async (req, res) => {
  cors(req, res, async () => {
    const id_boleto = req.query.id;
    const cñ = req.query.cñ;
    let objectSuffix = `${id_boleto}`;
    let response;

    if (cñ != "Prueba1234") {
      res.json({ Error: `Clave incorrecta` });
      return;
    }

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
        // Something else went wrong...
        console.log(err);
        res.json({ Error: `${err}` });
      }
      return;
    }

    let updatedObject = response.data;

    const tmd = updatedObject['textModulesData'];
    const objectX = tmd.find(item => item.id === 'ESTADO_BOLETO');
    objectX.body = 'EXPIRADO';

    updatedObject.state = 'EXPIRED';

    response = await httpClient.request({
      url: `https://walletobjects.googleapis.com/walletobjects/v1/transitObject/${issuerId}.${objectSuffix}`,
      method: 'PUT',
      data: updatedObject
    });

    try {
      const actualizarFirebase = await getFirestore().collection("boletos").doc(id_boleto).update({ estado: 'EXPIRADO' });
    } catch (err) {
      res.json({ Error: `${err}` });
    }

    console.log('---Expirado---');
    res.json({ Todo_correcto: `---Expirado---` });
  });
});

exports.mandarmail = onRequest(async (req, res) => {
  cors(req, res, async () => {
    const id_boleto = req.query.id;
    const cñ = req.query.cñ;
    const tipo = req.query.tipo;

    if (cñ != "Prueba1234") {
      res.json({ Error: `Clave incorrecta` });
      return;
    }

    const senderEmail = "samaelxzx@gmail.com";
    const senderPassword = "arvg wqkl lrnq dsar";

    const usuario = await getFirestore().collection('boletos').doc(id_boleto).get()
      .then(doc => { return doc.data().usuario; });
    if (usuario == null || usuario == undefined || usuario == "") {
      res.json({ Error: `Usuario no encontrado` });
      return;
    }
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

    const pdfAttachment = fs.readFileSync('Boleto.pdf');

    if (tipo == "1") {
      //creacion de boleto
      const subject = '¡Gracias por tu compra! WAPI';
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
          <a href="https://apple-wapi.web.app" class="button" id="button2"></a>
        </div>
      </body>
      </html>`;

      try {
        // Create transporter object using SMTP
        let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: senderEmail,
            pass: senderPassword
          }
        });

        // Setup email data
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

        // Send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);
        res.json({ Todo_correcto: `${info.messageId}` });

      } catch (error) {
        res.json({ Error: `${error}` });
        return;
      }
    }
    else if (tipo == "2") {
      //Actualizacion de boleto
      const subject = '¡Hubo una actualización en tu boleto! WAPI';
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
            <p class="success-message">¡Hubo una actualización en tu pase de abordar!</p>
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
          <a href="https://apple-wapi.web.app" class="button" id="button2"></a>
        </div>
      </body>
      </html>
      `;

      try {
        // Create transporter object using SMTP
        let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: senderEmail,
            pass: senderPassword
          }
        });

        // Setup email data
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

        // Send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);
        res.json({ Todo_correcto: `${info.messageId}` });

      } catch (error) {
        res.json({ Error: `${error}` });
        return;
      }
    }
    res.json({ FIN: `FIN` });
  });
});

exports.caviajes = onRequest(async (req, res) => {
  cors(req, res, async () => {
    const id_viaje = req.query.id;
    /*     const departureDateTime = req.query.ddt;
        const arrivalDateTime = req.query.adt; */
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

    if (cñ != "Prueba1234") {
      res.json({ Error: `Clave incorrecta` });
      return;
    }

    const departureDateTime = `${fechaSalida}T${horaSalida}:00-06:00`;
    const arrivalDateTime = `${fechaLlegada}T${horaLlegada}:00-06:00`;

    try {
      const final = await getFirestore().collection('viajes').doc(id_viaje)
        .set({ departureDateTime: departureDateTime, arrivalDateTime: arrivalDateTime, originStationCode: originStationCode, destinationStationCode: destinationStationCode, originName: originName, destinationName: destinationName, carriage: carriage, zone: zone, horaSalida: horaSalida, horaLlegada: horaLlegada, fechaSalida: fechaSalida, fechaLlegada: fechaLlegada, precio: precio });
      res.json({ Todo_correcto: `---Creado---` });
    }
    catch (err) {
      res.json({ Error: `Error al crear: ${err}` });

    }
  });
});

exports.abrirlink = onRequest(async (req, res) => {
  cors(req, res, async () => {
    const id_boleto = req.query.id;
    try {
      const LINK = await getFirestore().collection('boletos').doc(id_boleto).get().then(doc => { return doc.data().url; });
      res.redirect(`${LINK}`);
    }
    catch (err) {
      res.json({ Error: `Error al abrir link: ${err}` });
    }
  });
});

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
        res.json({ Error: `No encontrado` });
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
                  { "type": "TEXT", "text": `${fechaLlegada}`},
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
                  { "type": "TEXT", "text": `${fechaLlegada}`},
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