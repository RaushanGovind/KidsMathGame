# Append Beach topic to Batch 7

content = """

🏖️ BEACH – Kids Learning

A beach is a place where land meets the sea.
समुद्र तट वह जगह है जहाँ ज़मीन और समुद्र मिलते हैं।

------------------------------------

🌊 Sea (समुद्र)
The sea has salty water.
समुद्र का पानी खारा होता है।
Big waves move in the sea.
समुद्र में बड़ी लहरें उठती हैं।

🏖️ Sand (रेत)
Beaches have soft sand.
समुद्र तट पर मुलायम रेत होती है।
Children love to play in the sand.
बच्चे रेत में खेलना पसंद करते हैं।

🏰 Sandcastle (रेत का महल)
Children build sandcastles at the beach.
बच्चे समुद्र तट पर रेत के महल बनाते हैं।

🌴 Palm Trees (नारियल के पेड़)
Palm trees grow near beaches.
नारियल के पेड़ समुद्र तट के पास उगते हैं।

------------------------------------

🏊 Beach Activities (समुद्र तट की गतिविधियाँ)

People swim in the sea.
लोग समुद्र में तैरते हैं।

Children play with beach balls.
बच्चे बीच बॉल से खेलते हैं।

Families enjoy picnics.
परिवार पिकनिक मनाते हैं।

------------------------------------

⚠️ Beach Safety (समुद्र तट की सुरक्षा)

Do not go deep into the sea alone.
अकेले समुद्र में गहराई तक न जाएँ।

Listen to lifeguards.
लाइफगार्ड की बात सुनें।

------------------------------------

🎵 RHYME

Waves go up and waves go down,  
लहरें ऊपर जाएँ, नीचे आएँ — splashing all around!

Sand and sea and sky so blue,  
रेत, समुद्र, नीला गगन — beach is fun for you!
"""

with open('backend/new_batch_7_data.txt', 'a', encoding='utf-8') as f:
    f.write(content)

print("Added Beach topic to Batch 7")
