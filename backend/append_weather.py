# Append Weather topic to Batch 7

content = """

⛅ WEATHER – Kids Learning

Weather tells us about the condition of the air outside.
मौसम हमें बाहर की हवा की स्थिति के बारे में बताता है।
It can change from day to day.
यह हर दिन बदल सकता है।

------------------------------------

☀️ Sunny (धूप वाला)
The sun shines brightly in the sky.
आसमान में सूरज तेज चमकता है।
It feels hot.
मौसम गरम लगता है।

🌧️ Rainy (बरसात वाला)
Clouds bring rain.
बादल बारिश लाते हैं।
We use umbrellas and raincoats.
हम छाता और रेनकोट इस्तेमाल करते हैं।

☁️ Cloudy (बादलों वाला)
The sky is covered with clouds.
आसमान बादलों से ढका होता है।

🌬️ Windy (हवादार)
Strong wind blows.
तेज हवा चलती है।
Leaves and kites move in the wind.
हवा में पत्ते और पतंग उड़ते हैं।

❄️ Snowy (बर्फीला)
Snow falls in very cold places.
बहुत ठंडी जगहों पर बर्फ गिरती है।
Children make snowmen.
बच्चे बर्फ का पुतला बनाते हैं।

------------------------------------

🎯 WHY WEATHER IS IMPORTANT
मौसम क्यों महत्वपूर्ण है

Weather helps us decide what clothes to wear.
मौसम हमें तय करने में मदद करता है कि कौन से कपड़े पहनें।

------------------------------------

🎵 RHYME

Sunny days and rainy nights,  
धूप वाले दिन, बरसाती रातें — weather brings different sights!

Clouds and wind and snow so white,  
बादल, हवा और सफेद बर्फ — nature's changing light!
"""

with open('backend/new_batch_7_data.txt', 'a', encoding='utf-8') as f:
    f.write(content)

print("Added Weather topic to Batch 7")
