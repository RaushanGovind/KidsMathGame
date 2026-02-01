# Append Days of the Week topic to Batch 7

content = """

📅 DAYS OF THE WEEK – Kids Learning

There are seven days in a week.
एक सप्ताह में सात दिन होते हैं।

------------------------------------

1. Monday (सोमवार)  
2. Tuesday (मंगलवार)  
3. Wednesday (बुधवार)  
4. Thursday (गुरुवार)  
5. Friday (शुक्रवार)  
6. Saturday (शनिवार)  
7. Sunday (रविवार)  

------------------------------------

🗓️ WEEK FACTS (सप्ताह की जानकारी)

Sunday is a holiday for many people.
रविवार कई लोगों के लिए छुट्टी का दिन होता है।

Children go to school from Monday to Friday.
बच्चे सोमवार से शुक्रवार तक स्कूल जाते हैं।

Saturday and Sunday are called the weekend.
शनिवार और रविवार को वीकेंड कहा जाता है।

------------------------------------

🎵 RHYME

Monday, Tuesday, Wednesday too,  
सोम, मंगल, बुध — school for you!

Thursday, Friday come along,  
गुरु, शुक्र — पढ़ाई strong!

Saturday, Sunday time to play,  
शनिवार, रविवार — खेलो पूरे day!
"""

with open('backend/new_batch_7_data.txt', 'a', encoding='utf-8') as f:
    f.write(content)

print("Added Days of the Week topic to Batch 7")
