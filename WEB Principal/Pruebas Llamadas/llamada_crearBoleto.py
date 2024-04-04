# Se crea el boleto, recibe los parametros necesarios para crear un boleto y se crea el boleto y al mismo tiempo se guarda en la base de datos
import requests
import webbrowser


def abrir_enlace(enlace):
    webbrowser.open(enlace)


id_boleto = int(285)  # random
estado = "Vigente"
categoria = "Completo"
usuario = "197914"
passengerNames = "Angel Francisco Torres Vázquez"
seat = "2C"
id_viaje = "105"
purchaseReceiptNumber = "654321"  # random
contraseña = "Prueba1234"

response = requests.get(
    f"https://crearobjeto-klapxs6vqa-uc.a.run.app?id={id_boleto}&e={estado}&c={categoria}&u={usuario}&pn={passengerNames}&s={seat}&iv={id_viaje}&prn={purchaseReceiptNumber}&cñ={contraseña}"
)

data = response.json()

if "LINK" in data:
    enlace = data["LINK"]
    abrir_enlace(enlace)
