#Sirve para enviar un mensaje al dueño del boleto, ya sea que se haya creado o actualizado
#Se envia el id del boleto y la contraseña, toma el correo del usuario guardado en el boleto
import requests

id_res = int(285)
cñ = 'Prueba1234' #contraseña
t = '1' #Tipo se creo pase (envia un mensaje que se ha creado el pase)
#t = '2' #tipo se actualizo pase (envia un mensaje que se ha actualizado el pase)

response = requests.get(f"https://mandarmail-klapxs6vqa-uc.a.run.app?id={id_res}&cñ={cñ}&tipo={t}")

data = response.json()

print(data)