# Qwen2.5 Vedic Astrology Fine-Tuning & Deployment Pipeline

This repository contains the complete technical assessment codebase for fine-tuning the **Qwen2.5** model on custom multi-lingual Vedic Astrology ("Vedaz") chat logs, along with a production deployment strategy using **vLLM**.

---

## 📂 Project Structure

* **`astrology_assessment_report.md`**: The complete technical report detailing the dataset analysis, fine-tuning strategy (QLoRA), and the VPS hosting guide using vLLM.
* **`requirements.txt`**: Python dependencies required for training and inference.
* **`parse_chats.py`**: Parser script that cleans up the raw chat logs and exports them into standard formats.
* **`chat_data.jsonl`**: The cleaned, standardized conversational dataset ready for Hugging Face `SFTTrainer`.
* **`train.py`**: The fine-tuning script utilizing QLoRA (4-bit NF4 quantization + LoRA adapters) and the Qwen2.5 chat template.
* **`inference.py`**: Inference validation script to load the base model and LoRA weights to run tests.

---

## 🚀 Step-by-Step Execution Guide

### 1. Environment Setup
Create a Python virtual environment and install the required GPU-compatible packages:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Dataset Preparation
If you want to re-parse the raw JSON file into the Hugging Face ready JSONL dataset:
```bash
python parse_chats.py
```
This generates:
- `clean_chat_data.json` (Structured JSON array)
- `chat_data.jsonl` (Standard JSON Lines format)

### 3. Model Fine-Tuning (QLoRA)
To start training on a GPU instance (e.g., Google Colab, RunPod, AWS EC2 with RTX 3090 / A100 / A10G):
```bash
python train.py \
  --model_id "Qwen/Qwen2.5-7B-Instruct" \
  --dataset_path "chat_data.jsonl" \
  --output_dir "./qwen2.5_astrology_lora" \
  --epochs 3 \
  --batch_size 2 \
  --gradient_accumulation_steps 4
```
*Note: Adjust `--batch_size` and `--gradient_accumulation_steps` based on your available VRAM.*

### 4. Running Validation / Inference
To test the responses from the trained model (base + LoRA adapter):
```bash
python inference.py \
  --base_model "Qwen/Qwen2.5-7B-Instruct" \
  --adapter_dir "./qwen2.5_astrology_lora" \
  --prompt "Mera breakup ho gaya hai, main bahut dukhi hoon. Kya kundli mein meri marna likha hai?"
```

---

## 🌐 Production Hosting (vLLM)
For step-by-step instructions on deploying the fine-tuned model inside Docker or bare-metal on a GPU Virtual Private Server (VPS), exposing an OpenAI-compatible API endpoint, and securing it behind an Nginx reverse proxy with SSL, please refer to the detailed [astrology_assessment_report.md](astrology_assessment_report.md).
