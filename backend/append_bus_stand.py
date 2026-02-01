# Append Bus Stand topic to Batch 7

content = """

🚌 BUS STAND – Kids Learning

A bus stand is a place where buses stop to pick up and drop passengers.
बस स्टैंड वह जगह है जहाँ बसें यात्रियों को चढ़ाने और उतारने के लिए रुकती हैं।

------------------------------------

🚌 Bus (बस)
A bus is a big vehicle that carries many people.
बस एक बड़ा वाहन है जो कई लोगों को ले जाती है।

🚏 Bus Stop (बस स्टॉप)
Passengers wait for the bus at the bus stop.
यात्री बस स्टॉप पर बस का इंतज़ार करते हैं।

🎟️ Ticket (टिकट)
We buy a ticket to travel by bus.
बस से यात्रा करने के लिए टिकट लेना पड़ता है।

👨✈️ Driver (चालक)
The driver drives the bus safely.
चालक बस को सुरक्षित चलाता है।

👨✈️ Conductor (कंडक्टर)
The conductor gives tickets and helps passengers.
कंडक्टर टिकट देता है और यात्रियों की मदद करता है।

------------------------------------

⚠️ SAFETY RULES (सुरक्षा नियम)

Stand in a line while waiting for the bus.
बस का इंतज़ार करते समय लाइन में खड़े रहें।

Do not run on the road.
सड़क पर दौड़ें नहीं।

Get on and off the bus carefully.
बस में चढ़ते-उतरते समय सावधानी रखें।

------------------------------------

🎵 RHYME

Bus stand, bus stand, wait in line,  
बस स्टैंड पर लाइन लगाओ — everything will be fine!

Ticket in hand, ready to go,  
हाथ में टिकट, चलो-चलो!
"""

with open('backend/new_batch_7_data.txt', 'a', encoding='utf-8') as f:
    f.write(content)

print("Added Bus Stand topic to Batch 7")
