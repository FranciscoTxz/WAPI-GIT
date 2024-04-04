#Se envia como parametro el id del boleto y la contraseña para expirar el objeto (boleto)
    #Lo hace tanto en la base de datos como en el boelet especifico
import requests

id_boleto = int(270)
cñ = 'Prueba1234' #contraseña

response = requests.get(f"https://expirarobjeto-klapxs6vqa-uc.a.run.app?id={id_boleto}&cñ={cñ}")

data = response.json()

print(data)