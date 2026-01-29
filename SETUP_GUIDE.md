# Hướng dẫn Cài đặt và Sử dụng

## 📋 Yêu cầu Hệ thống

- Node.js >= 18.0.0
- npm hoặc yarn
- 2GB RAM khả dụng
- 500MB dung lượng ổ đĩa

## 🚀 Cài đặt

### 1. Clone hoặc Download Project

```bash
cd chatbot-data-converter
```

### 2. Cài đặt Backend

```bash
cd backend
npm install

# Tạo file .env
cp .env.example .env

# Chỉnh sửa .env nếu cần (mặc định đã ok)
```

### 3. Cài đặt Frontend

```bash
cd ../frontend
npm install

# Tạo file .env
cp .env.example .env

# Chỉnh sửa .env nếu cần
```

## ▶️ Chạy Ứng dụng

### Chạy Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Backend sẽ chạy tại: http://localhost:3000

### Chạy Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

## 📖 Hướng dẫn Sử dụng

### Bước 1: Upload File JSON

1. Mở trình duyệt tại http://localhost:5173
2. Kéo thả file JSON hoặc click để chọn file
3. Đợi upload hoàn tất (hiển thị thông tin file)

### Bước 2: Xem Preview (Tùy chọn)

1. Click vào "Preview Data" để xem trước dữ liệu
2. Mở rộng conversations để xem chi tiết messages

### Bước 3: Cấu hình Options

**Chọn Output Format:**
- OpenAI (JSONL): Dùng cho GPT-3.5/GPT-4
- Anthropic (JSONL): Dùng cho Claude
- Alpaca/LLaMA (JSON): Dùng cho các mô hình open-source
- ShareGPT (JSON): Format universal

**Cài đặt khác:**
- System Prompt: Thêm system prompt (chỉ OpenAI format)
- Remove Think Tags: Xóa `<think>...</think>` tags
- Max Messages: Giới hạn số messages mỗi conversation

**Filters (Optional):**
- Filter by User ID: Lọc theo user cụ thể
- Filter by Conversation ID: Lọc conversation cụ thể
- Date Range: Lọc theo khoảng thời gian

### Bước 4: Convert & Download

1. Click nút "Convert & Download"
2. File sẽ tự động download về máy
3. Xem thống kê conversion trong summary

## 📊 Format Output Chi tiết

### 1. OpenAI Format (JSONL)

Mỗi dòng là một JSON object:

```jsonl
{"messages": [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}
{"messages": [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}
```

**Sử dụng:**
```python
from openai import OpenAI
client = OpenAI()

client.files.create(
  file=open("converted_openai.jsonl", "rb"),
  purpose="fine-tune"
)
```

### 2. Anthropic Format (JSONL)

```jsonl
{"prompt": "Human: ...\n\nAssistant:", "completion": " ..."}
{"prompt": "Human: ...\n\nAssistant:", "completion": " ..."}
```

### 3. Alpaca/LLaMA Format (JSON)

```json
[
  {
    "instruction": "...",
    "input": "",
    "output": "..."
  }
]
```

**Sử dụng với Alpaca-LoRA:**
```bash
python train.py \
    --base_model 'meta-llama/Llama-2-7b-hf' \
    --data_path 'converted_alpaca.json' \
    --output_dir './lora-alpaca'
```

### 4. ShareGPT Format (JSON)

```json
[
  {
    "conversations": [
      {"from": "human", "value": "..."},
      {"from": "gpt", "value": "..."}
    ]
  }
]
```

## 🔧 API Endpoints

### POST /api/upload
Upload file JSON từ MongoDB

**Request:**
- multipart/form-data
- field: `file` (JSON file)

**Response:**
```json
{
  "fileId": "uuid",
  "filename": "chat.json",
  "size": 5242880,
  "messageCount": 1000,
  "conversationCount": 50
}
```

### POST /api/convert
Convert dữ liệu

**Request:**
```json
{
  "fileId": "uuid",
  "options": {
    "format": "openai",
    "removeThinkTags": true
  }
}
```

**Response:**
```json
{
  "data": [...],
  "format": "openai",
  "output": "...",
  "filename": "converted_openai_123.jsonl",
  "stats": {
    "totalConversations": 50,
    "totalMessages": 1000,
    "totalTokensEstimate": 250000
  }
}
```

### GET /api/stats/:fileId
Lấy thống kê file

### GET /api/preview/:fileId?limit=5
Xem preview dữ liệu

### DELETE /api/file/:fileId
Xóa file khỏi memory

## 🛠️ Development

### Thêm Format Mới

1. Cập nhật types trong `backend/src/types/index.ts`
2. Thêm conversion method trong `backend/src/services/conversionService.ts`
3. Cập nhật frontend options

### Chạy Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Build Production

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## ⚠️ Lưu ý

1. **Memory Usage**: File được lưu trong memory, restart server sẽ mất data
2. **File Size Limit**: Mặc định 50MB, có thể tăng trong config
3. **Token Estimates**: Chỉ là ước tính, actual có thể khác
4. **Think Tags**: Nên remove để có training data sạch hơn
5. **Production**: Nên dùng Redis/Database thay vì memory storage

## 🐛 Troubleshooting

### Lỗi Upload File

```
Error: Only JSON files are allowed
```
→ Đảm bảo file có extension `.json`

### Lỗi Conversion Failed

```
Error: Invalid JSON format
```
→ Kiểm tra format JSON đúng theo cấu trúc MongoDB messages

### CORS Error

```
Access-Control-Allow-Origin error
```
→ Kiểm tra CORS_ORIGIN trong backend/.env

### Port Already in Use

```
Error: listen EADDRINUSE
```
→ Đổi port trong .env hoặc kill process đang dùng port

## 📚 Resources

- [OpenAI Fine-tuning Docs](https://platform.openai.com/docs/guides/fine-tuning)
- [Anthropic Claude Docs](https://docs.anthropic.com/claude/docs)
- [LLaMA Fine-tuning Guide](https://github.com/tloen/alpaca-lora)
- [ShareGPT Format](https://sharegpt.com/)

## 💡 Tips & Best Practices

1. **Quality over Quantity**: Lọc conversations chất lượng cao
2. **Balance Dataset**: Đảm bảo đa dạng topics và styles
3. **Remove Noise**: Xóa các tags không cần thiết
4. **Test Small First**: Test với dataset nhỏ trước khi scale
5. **Monitor Tokens**: Chú ý token count để estimate costs
6. **Backup Data**: Luôn giữ bản backup file gốc

## 🤝 Support

Nếu gặp vấn đề:
1. Check console logs (F12 trong browser)
2. Check server logs (terminal running backend)
3. Verify file format matches MongoDB structure
4. Test với file nhỏ hơn trước

Happy Fine-tuning! 🚀
