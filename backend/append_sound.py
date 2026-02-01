# Append Sound topic to Batch 7

content = """

🔊 SOUND – Kids Learning

Sound is a form of energy that we can hear.
ध्वनि ऊर्जा का एक रूप है जिसे हम सुन सकते हैं।

------------------------------------

🎶 HOW SOUND IS MADE (ध्वनि कैसे बनती है)

Sound is made when things vibrate.
जब कोई वस्तु कंपन करती है तो ध्वनि बनती है।

Example:
When we hit a drum, it vibrates and makes sound.
जब हम ढोल बजाते हैं तो वह कंपन करता है और आवाज़ निकलती है।

------------------------------------

👂 HOW WE HEAR SOUND (हम ध्वनि कैसे सुनते हैं)

Sound travels through air to our ears.
ध्वनि हवा के माध्यम से हमारे कानों तक पहुँचती है।

Our ears help us hear different sounds.
हमारे कान अलग-अलग ध्वनियाँ सुनने में मदद करते हैं।

------------------------------------

📢 TYPES OF SOUNDS (ध्वनि के प्रकार)

Soft Sound (धीमी आवाज़) – Whisper  
Loud Sound (तेज़ आवाज़) – Drum, horn  

------------------------------------

🚫 NOISE (शोर)

Very loud and unpleasant sound is called noise.
बहुत तेज और खराब लगने वाली आवाज़ को शोर कहते हैं।

------------------------------------

🎯 WHY SOUND IS IMPORTANT
ध्वनि क्यों महत्वपूर्ण है

Sound helps us talk, listen, and enjoy music.
ध्वनि हमें बोलने, सुनने और संगीत का आनंद लेने में मदद करती है।

------------------------------------

🎵 RHYME

Clap your hands and hear the sound,  
ताली बजाओ — sound goes round!

Soft or loud, high or low,  
धीमी या तेज — sound we know!
"""

with open('backend/new_batch_7_data.txt', 'a', encoding='utf-8') as f:
    f.write(content)

print("Added Sound topic to Batch 7")
