# Append Electricity topic to Batch 7

content = """

⚡ ELECTRICITY – Kids Learning

Electricity is a form of energy that makes many things work.
बिजली ऊर्जा का एक रूप है जो कई चीज़ों को चलाती है।

------------------------------------

💡 WHAT ELECTRICITY DOES (बिजली क्या करती है)

Electricity gives us light.
बिजली हमें रोशनी देती है।

Electricity runs fans, TVs, and computers.
बिजली पंखा, टीवी और कंप्यूटर चलाती है।

------------------------------------

🔋 WHERE ELECTRICITY COMES FROM (बिजली कहाँ से आती है)

Electricity is made in power stations.
बिजली बिजलीघरों में बनाई जाती है।

It can be made using water, wind, sun, and coal.
बिजली पानी, हवा, सूरज और कोयले से बनाई जा सकती है।

------------------------------------

🔌 SIMPLE ELECTRIC CIRCUIT (सरल विद्युत परिपथ)

A circuit is a path through which electricity flows.
परिपथ वह रास्ता है जिससे बिजली बहती है।

Battery → Wire → Bulb = Light
बैटरी → तार → बल्ब = रोशनी

------------------------------------

⚠️ SAFETY RULES (सुरक्षा नियम)

Do not touch switches with wet hands.
गीले हाथों से स्विच न छुएँ।

Do not put fingers into electric sockets.
बिजली के सॉकेट में उंगली न डालें।

------------------------------------

🎯 WHY ELECTRICITY IS IMPORTANT
बिजली क्यों ज़रूरी है

Electricity makes our life easy and comfortable.
बिजली हमारे जीवन को आसान और आरामदायक बनाती है।

------------------------------------

🎵 RHYME

Flip the switch and light will glow,  
स्विच दबाओ — bulb will glow!

Fans will spin and TV play,  
पंखा चले, टीवी बजे — electricity saves the day!
"""

with open('backend/new_batch_7_data.txt', 'a', encoding='utf-8') as f:
    f.write(content)

print("Added Electricity topic to Batch 7")
