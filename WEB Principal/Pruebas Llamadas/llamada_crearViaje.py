# Se crea o actualiza el viaje, esto con lo que se le envia en la URL
    # Nota ...
import requests
from datetime import datetime

id_viaje = '104'
originStationCode = 'AGS'
destinationStationCode = 'GDL'
originName = 'Aguascalientes'
destinationName = 'Guadalajara'
carriage = '321'
zone = 'Anden 5'
horaSalida = '10:00'    #Debe de ser afuerzas asi '13:00' 'MM:SS'
horaLlegada = '14:00'   #Debe de ser afuerzas asi '16:00' 'MM:SS'
fechaSalida = '2024-04-05' #Debe ser afuerzas asi '2024-03-28' 'YYYY-MM-DD'
fechaLlegada = '2024-04-05' #Debe ser afuerzas asi '2024-03-28' 'YYYY-MM-DD'
precio = '500'
cñ = 'Prueba1234'

response = requests.get(f"https://caviajes-klapxs6vqa-uc.a.run.app?id={id_viaje}&osc={originStationCode}&dsc={destinationStationCode}&on={originName}&dn={destinationName}&c={carriage}&z={zone}&hs={horaSalida}&hl={horaLlegada}&fs={fechaSalida}&fl={fechaLlegada}&p={precio}&cñ={cñ}")

data = response.json()

print(data)