#Esto sirve para enviar un mensaje de whatsapp a un usuario, el usuario se saca en base al boleto 
import requests
from datetime import datetime

id_boleto = '28380'
#tipo = '1' #Tipo 1: Boleto que avisa de la creacion de este boleto
tipo = '2' #Tipo 2: Boleto que avisa de la actualizacion de este boleto
#tipo = '3' #Tipo 3: Boleto que avisa de la culminacion de este boleto
cñ = 'Prueba1234'

response = requests.get(f"https://mandarwhats-klapxs6vqa-uc.a.run.app?id={id_boleto}&tipo={tipo}&cñ={cñ}")

data = response.json()

print(data)
