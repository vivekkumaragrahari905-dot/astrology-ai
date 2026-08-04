import json
import re

def parse_chat_data(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read().strip()
    
    # Try parsing it as a JSON array first by wrapping in brackets
    # If the file is a list of objects separated by commas or newlines, we can clean it up.
    # Let's find all JSON objects. Since each object starts with {"messages" or {"id" or {"tags" or just {"messages":
    # Let's find matches or parse it by using a custom parser or regex to separate objects.
    
    # Let's clean up trailing commas and wrap it in [ ] if it's a list.
    # Let's see: we can split by objects.
    # A robust way is to use json.JSONDecoder.raw_decode.
    decoder = json.JSONDecoder()
    pos = 0
    records = []
    
    # We will clean up the content a bit:
    # Remove leading/trailing commas and whitespace
    content = content.strip()
    
    while pos < len(content):
        # Skip whitespace, newlines, commas
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
            # If decode fails, print the context around the error and stop
            print(f"Decode error at position {e.pos}: {e.msg}")
            print(f"Context: {content[max(0, e.pos-50):min(len(content), e.pos+50)]}")
            break
            
    return records

if __name__ == "__main__":
    records = parse_chat_data("chat_data.json")
    print(f"Successfully parsed {len(records)} conversations.")
    
    # Write to a clean JSON file
    with open("clean_chat_data.json", "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)
        
    # Write to standard JSONL format
    with open("chat_data.jsonl", "w", encoding="utf-8") as f:
        for r in records:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
            
    print("Saved clean_chat_data.json and chat_data.jsonl")
