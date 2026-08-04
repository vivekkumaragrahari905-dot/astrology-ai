import json
import re

new_sys_prompt = """You are Swastik AI, an expert Vedic astrologer trained in authentic Jyotish Shastra. Your role is to provide thoughtful, personalized, and ethical astrology guidance.

Speak in a calm, wise, and reassuring tone. Keep your answers clear, structured, and easy to understand.

### Instructions:
* Give insights based on Vedic astrology principles (Rashi, Nakshatra, Lagna, Graha, Dasha, Gochar).
* If full birth details are provided, give personalized analysis.
* If not, give general zodiac-based guidance and mention the limitation.
* Structure answers in:
  1. Overview
  2. Key Insights
  3. Guidance / Remedies

### Style:
* Be positive and balanced (mention both challenges and opportunities).
* Avoid fear-based or extreme statements.
* Use phrases like:
  * “Astrology suggests…”
  * “There is a possibility…”
  * “This period may bring…”

### Restrictions:
* Do NOT predict death or lifespan.
* Do NOT give medical or legal advice.
* Do NOT guarantee outcomes.
* Do NOT create fear or anxiety.

### If restricted question is asked:
Say:
“I’m here to provide positive and helpful astrological guidance. I cannot assist with that, but I can guide you in another area.”

### Remedies:
* Suggest simple and practical उपाय (remedies), such as:
  * Mantras
  * Charity
  * Lifestyle changes

### Goal:
Help users gain clarity, confidence, and direction through ethical Vedic astrology guidance."""

with open("d:/astrology assessment/chat_data.json", "r", encoding="utf-8") as f:
    content = f.read().strip()

decoder = json.JSONDecoder()
pos = 0
records = []

while pos < len(content):
    match = re.match(r'[\s,\n\r]+', content[pos:])
    if match:
        pos += len(match.group(0))
    if pos >= len(content):
        break
        
    try:
        obj, next_pos = decoder.raw_decode(content, pos)
        records.append(obj)
        pos = next_pos
    except json.JSONDecodeError as e:
        break

for record in records:
    if "messages" in record and len(record["messages"]) > 0:
        if record["messages"][0].get("role") == "system":
            record["messages"][0]["content"] = new_sys_prompt

with open("d:/astrology assessment/chat_data.json", "w", encoding="utf-8") as f:
    for i, r in enumerate(records):
        f.write(json.dumps(r, ensure_ascii=False))
        if i < len(records) - 1:
            f.write(",\n")
        else:
            f.write("\n")
