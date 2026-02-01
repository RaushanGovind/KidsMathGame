# Append Numbers 1-20 topic to Batch 7

content = """

🔢 NUMBERS 1–20 – Kids Learning

Numbers help us count things.
संख्याएँ हमें चीज़ें गिनने में मदद करती हैं।

------------------------------------

1 – One (एक)  
2 – Two (दो)  
3 – Three (तीन)  
4 – Four (चार)  
5 – Five (पाँच)  

6 – Six (छह)  
7 – Seven (सात)  
8 – Eight (आठ)  
9 – Nine (नौ)  
10 – Ten (दस)  

11 – Eleven (ग्यारह)  
12 – Twelve (बारह)  
13 – Thirteen (तेरह)  
14 – Fourteen (चौदह)  
15 – Fifteen (पंद्रह)  

16 – Sixteen (सोलह)  
17 – Seventeen (सत्रह)  
18 – Eighteen (अठारह)  
19 – Nineteen (उन्नीस)  
20 – Twenty (बीस)  

------------------------------------

🧮 COUNTING EXAMPLES (गिनती के उदाहरण)

1 Sun 🌞  
एक सूरज

2 Eyes 👀  
दो आँखें

5 Fingers ✋  
पाँच उंगलियाँ

10 Toes 🦶  
दस पैर की उंगलियाँ

------------------------------------

🎵 RHYME

One, two, three, four, five,  
एक, दो, तीन, चार, पाँच — counting makes us wise!

Six, seven, eight, nine, ten,  
छह, सात, आठ, नौ, दस — let's count again!

Eleven to twenty, count with glee,  
ग्यारह से बीस तक गिनती करो खुशी-खुशी!
"""

with open('backend/new_batch_7_data.txt', 'a', encoding='utf-8') as f:
    f.write(content)

print("Added Numbers 1-20 topic to Batch 7")
