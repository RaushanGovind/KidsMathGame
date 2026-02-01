# Append Airport topic to Batch 7

content = """

✈️ AIRPORT – Kids Learning

An airport is a place where airplanes take off and land.
हवाई अड्डा वह जगह है जहाँ हवाई जहाज उड़ान भरते और उतरते हैं।

------------------------------------

🛫 Airplane (हवाई जहाज)
An airplane flies in the sky.
हवाई जहाज आसमान में उड़ता है।
It carries passengers and goods.
यह यात्रियों और सामान को ले जाता है।

🏢 Terminal (टर्मिनल)
The terminal is the main airport building.
टर्मिनल हवाई अड्डे की मुख्य इमारत होती है।
Passengers wait here before their flight.
यात्री उड़ान से पहले यहाँ इंतजार करते हैं।

🎟️ Ticket (टिकट)
We need a ticket to travel by airplane.
हवाई यात्रा के लिए टिकट ज़रूरी है।

🛄 Luggage (सामान)
Passengers carry bags and suitcases.
यात्री बैग और सूटकेस लेकर चलते हैं।
Luggage is checked before boarding.
उड़ान से पहले सामान की जाँच होती है।

🛂 Security Check (सुरक्षा जाँच)
Security officers check passengers and luggage.
सुरक्षा कर्मचारी यात्रियों और सामान की जाँच करते हैं।

🛬 Runway (रनवे)
Runway is the long road where planes take off and land.
रनवे लंबा रास्ता है जहाँ विमान उड़ान भरते और उतरते हैं।

👨✈️ Pilot (पायलट)
The pilot flies the airplane.
पायलट हवाई जहाज उड़ाता है।

------------------------------------

🌍 WHY AIRPORTS ARE IMPORTANT
हवाई अड्डे क्यों महत्वपूर्ण हैं

Airports help people travel to faraway places quickly.
हवाई अड्डे लोगों को दूर-दराज की जगहों तक जल्दी पहुँचने में मदद करते हैं।

------------------------------------

🎵 RHYME

Up in the sky the airplane goes,  
आसमान में उड़ता जहाज — everyone knows!

Ticket and bag, ready to fly,  
टिकट और बैग लेकर — off we fly!
"""

with open('backend/new_batch_7_data.txt', 'a', encoding='utf-8') as f:
    f.write(content)

print("Added Airport topic to Batch 7")
