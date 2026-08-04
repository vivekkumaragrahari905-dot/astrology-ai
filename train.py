import os
import torch
import argparse
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments,
    TrainerCallback
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer

def parse_args():
    parser = argparse.ArgumentParser(description="Fine-tune Qwen2.5 using QLoRA")
    parser.add_argument("--model_id", type=str, default="Qwen/Qwen2.5-7B-Instruct", help="Hugging Face model ID")
    parser.add_argument("--dataset_path", type=str, default="chat_data.jsonl", help="Path to the JSONL dataset")
    parser.add_argument("--output_dir", type=str, default="./qwen2.5_astrology_lora", help="Directory to save checkpoints")
    parser.add_argument("--epochs", type=int, default=3, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=2, help="Batch size per device")
    parser.add_argument("--gradient_accumulation_steps", type=int, default=4, help="Gradient accumulation steps")
    parser.add_argument("--lr", type=float, default=2e-4, help="Learning rate")
    parser.add_argument("--lora_r", type=int, default=16, help="LoRA rank")
    parser.add_argument("--lora_alpha", type=int, default=32, help="LoRA alpha")
    parser.add_argument("--lora_dropout", type=float, default=0.05, help="LoRA dropout")
    return parser.parse_args()

def main():
    args = parse_args()
    print("--- Arguments parsed ---")
    for arg, val in vars(args).items():
        print(f"{arg}: {val}")

    # 1. Load Dataset
    print("\n--- Loading Dataset ---")
    dataset = load_dataset("json", data_files=args.dataset_path, split="train")
    # Split dataset into train and test
    dataset_split = dataset.train_test_split(test_size=0.1, seed=42)
    train_dataset = dataset_split["train"]
    eval_dataset = dataset_split["test"]
    print(f"Train samples: {len(train_dataset)}, Eval samples: {len(eval_dataset)}")

    # 2. Tokenizer Setup
    print("\n--- Loading Tokenizer ---")
    tokenizer = AutoTokenizer.from_pretrained(args.model_id, trust_remote_code=True)
    # Ensure pad token is set
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    # 3. Quantization Config for QLoRA (4-bit)
    print("\n--- Setting up 4-bit Quantization Config ---")
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_use_double_quant=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16
    )

    # 4. Load Base Model
    print("\n--- Loading Base Model ---")
    device_map = "auto"
    model = AutoModelForCausalLM.from_pretrained(
        args.model_id,
        quantization_config=bnb_config,
        device_map=device_map,
        trust_remote_code=True
    )
    
    # Enable gradient checkpointing and prepare for kbit training
    model.gradient_checkpointing_enable()
    model = prepare_model_for_kbit_training(model)

    # 5. PEFT/LoRA Setup
    print("\n--- Setting up LoRA Config ---")
    # Target modules for Qwen architecture
    target_modules = ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"]
    
    lora_config = LoraConfig(
        r=args.lora_r,
        lora_alpha=args.lora_alpha,
        target_modules=target_modules,
        lora_dropout=args.lora_dropout,
        bias="none",
        task_type="CAUSAL_LM"
    )
    
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

    # 6. Formatting Function for chat template
    # Since Qwen has its own chat template, we can define a formatting function for the trainer
    def format_prompts(batch):
        formatted_texts = []
        for messages in batch["messages"]:
            # Apply Qwen chat template to messages
            text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=False)
            formatted_texts.append(text)
        return {"text": formatted_texts}

    # Apply formatting
    print("\n--- Applying Chat Template ---")
    train_dataset = train_dataset.map(format_prompts, batched=True)
    eval_dataset = eval_dataset.map(format_prompts, batched=True)

    # 7. Training Arguments
    print("\n--- Configuring Training Arguments ---")
    training_args = TrainingArguments(
        output_dir=args.output_dir,
        num_train_epochs=args.epochs,
        per_device_train_batch_size=args.batch_size,
        gradient_accumulation_steps=args.gradient_accumulation_steps,
        learning_rate=args.lr,
        logging_steps=1,
        evaluation_strategy="steps",
        eval_steps=10,
        save_strategy="steps",
        save_steps=20,
        weight_decay=0.01,
        warmup_ratio=0.03,
        lr_scheduler_type="cosine",
        fp16=not torch.cuda.is_bf16_supported(),
        bf16=torch.cuda.is_bf16_supported(),
        group_by_length=True,
        report_to="none"  # Disable wandb reporting by default
    )

    # 8. SFT Trainer
    print("\n--- Initializing SFT Trainer ---")
    trainer = SFTTrainer(
        model=model,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
        peft_config=lora_config,
        dataset_text_field="text",
        max_seq_length=1024,
        tokenizer=tokenizer,
        args=training_args,
        packing=False
    )

    # 9. Start Training
    print("\n--- Starting Training ---")
    trainer.train()

    # 10. Save Model
    print("\n--- Saving Model and Tokenizer ---")
    trainer.model.save_pretrained(args.output_dir)
    tokenizer.save_pretrained(args.output_dir)
    print("Fine-tuning completed successfully! Model saved at:", args.output_dir)

if __name__ == "__main__":
    main()
