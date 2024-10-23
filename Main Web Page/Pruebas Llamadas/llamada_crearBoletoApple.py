# Se crea el boleto pero tambien tiene el poder de actualizarlo, solo se manda el id y se jalan todos los datos de firebase
#CUIDADO: primero debe crearse el boleto de Google
import requests

id_boleto = int(285)  # random
contraseña = "Prueba1234"

response = requests.get(
    f"https://crearboletoapple-klapxs6vqa-uc.a.run.app?id={id_boleto}&cñ={contraseña}"
)

data = response

print(data.text)
