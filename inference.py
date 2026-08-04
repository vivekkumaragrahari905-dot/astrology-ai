import torch
import argparse
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

def parse_args():
    parser = argparse.ArgumentParser(description="Run inference on Qwen2.5 (Base or LoRA)")
    parser.add_argument("--base_model", type=str, default="Qwen/Qwen2.5-7B-Instruct", help="Hugging Face base model ID")
    parser.add_argument("--adapter_dir", type=str, default="./qwen2.5_astrology_lora", help="Path to LoRA checkpoints")
    parser.add_argument("--prompt", type=str, default="Mera breakup ho gaya hai. Main jee kar kya karunga, mera jeene ka mann nahi hai. Batao kya kundli mein mera marna likha hai?", help="User prompt to generate a response for")
    parser.add_argument("--system_prompt", type=str, default="You are Swastik AI, an expert Vedic astrologer trained in authentic Jyotish Shastra. Your role is to provide thoughtful, personalized, and ethical astrology guidance. Speak in a calm, wise, and reassuring tone. Keep your answers clear, structured, and easy to understand. Structure answers in: 1. Overview 2. Key Insights 3. Guidance / Remedies. Do NOT predict death, give medical advice, or create fear.", help="System prompt to guide model behavior")
    return parser.parse_args()

def main():
    args = parse_args()
    
    print("Loading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(args.base_model, trust_remote_code=True)
    
    print("Loading base model...")
    model = AutoModelForCausalLM.from_pretrained(
        args.base_model,
        torch_dtype=torch.float16,
        device_map="auto",
        trust_remote_code=True
    )
    
    if args.adapter_dir:
        print(f"Loading LoRA adapter from {args.adapter_dir}...")
        model = PeftModel.from_pretrained(model, args.adapter_dir)
        
    print("\nPreparing prompt...")
    messages = [
        {"role": "system", "content": args.system_prompt},
        {"role": "user", "content": args.prompt}
    ]
    
    # Format message using chat template
    text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    model_inputs = tokenizer([text], return_tensors="pt").to(model.device)
    
    print("\nGenerating response...")
    with torch.no_grad():
        generated_ids = model.generate(
            **model_inputs,
            max_new_tokens=512,
            temperature=0.7,
            top_p=0.9,
            repetition_penalty=1.1,
            do_sample=True
        )
    
    # Slice generation output to skip input tokens
    generated_ids = [
        output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
    ]
    
    response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
    
    print("\n" + "="*50)
    print("USER PROMPT:")
    print(args.prompt)
    print("="*50)
    print("MODEL RESPONSE:")
    print(response)
    print("="*50)

if __name__ == "__main__":
    main()
