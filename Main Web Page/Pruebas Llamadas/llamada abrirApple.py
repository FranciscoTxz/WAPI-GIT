#Esto es lo que se agregara al boleto de apple 
import requests
import webbrowser




id_boleto = int(285)  # random

response = requests.get(
    f"https://abrirboletoapple-klapxs6vqa-uc.a.run.app?id={id_boleto}"
)

data = response

print(data)
