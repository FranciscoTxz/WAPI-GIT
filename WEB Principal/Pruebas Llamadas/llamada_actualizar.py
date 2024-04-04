#Actualiza el boleto pero para esto, toma todos los valores de la base de datos y los actualiza en el boleto
#Nota: Primero hay que actualizar la base de datos y depsues se llama esto
import requests

id_boleto = int(275)
contraseña = 'Prueba1234'

response = requests.get(f"https://actualizarobjeto-klapxs6vqa-uc.a.run.app?id={id_boleto}&cñ={contraseña}")
#response = requests.get(f"http://127.0.0.1:5001/wapi-cansado/us-central1/actualizarobjeto?id={id_boleto}&cñ={contraseña}")

data = response.json()

print(data)

