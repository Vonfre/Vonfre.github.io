# Transformer 模型实现

本文将从零开始实现 Transformer 模型，这是"Attention Is All You Need"论文中提出的革命性架构。

## 模型概述

Transformer 完全基于注意力机制，摒弃了传统的循环神经网络（RNN）和卷积神经网络（CNN）。

### 核心组件

1. **Multi-Head Attention**：多头注意力机制
2. **Position-wise Feed-Forward**：位置前馈网络
3. **Positional Encoding**：位置编码
4. **Layer Normalization**：层归一化

## 环境准备

```bash
pip install torch numpy matplotlib
```

## 位置编码

Transformer 没有循环结构，需要位置编码来注入序列的位置信息：

```python
import torch
import torch.nn as nn
import numpy as np
import math

class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_len=5000):
        super(PositionalEncoding, self).__init__()
        
        # 创建位置编码矩阵
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        
        # 计算除数项
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * 
                            (-math.log(10000.0) / d_model))
        
        # 应用正弦和余弦函数
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        
        pe = pe.unsqueeze(0)
        self.register_buffer('pe', pe)
    
    def forward(self, x):
        # x shape: (batch_size, seq_len, d_model)
        return x + self.pe[:, :x.size(1), :]
```

位置编码公式：

$$
PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d_{model}}}\right)
$$

$$
PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d_{model}}}\right)
$$

## 多头注意力机制

注意力机制的核心公式：

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

```python
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super(MultiHeadAttention, self).__init__()
        assert d_model % num_heads == 0
        
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        # 线性变换层
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
        
    def scaled_dot_product_attention(self, Q, K, V, mask=None):
        # Q, K, V shape: (batch_size, num_heads, seq_len, d_k)
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)
        
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        
        attention_weights = torch.softmax(scores, dim=-1)
        output = torch.matmul(attention_weights, V)
        
        return output, attention_weights
    
    def split_heads(self, x):
        # x shape: (batch_size, seq_len, d_model)
        batch_size, seq_len, d_model = x.size()
        
        # 重塑为 (batch_size, seq_len, num_heads, d_k)
        x = x.view(batch_size, seq_len, self.num_heads, self.d_k)
        
        # 转置为 (batch_size, num_heads, seq_len, d_k)
        return x.transpose(1, 2)
    
    def combine_heads(self, x):
        # x shape: (batch_size, num_heads, seq_len, d_k)
        batch_size, num_heads, seq_len, d_k = x.size()
        
        # 转置并重塑
        x = x.transpose(1, 2).contiguous()
        return x.view(batch_size, seq_len, self.d_model)
    
    def forward(self, Q, K, V, mask=None):
        # 线性变换
        Q = self.W_q(Q)
        K = self.W_k(K)
        V = self.W_v(V)
        
        # 分割为多头
        Q = self.split_heads(Q)
        K = self.split_heads(K)
        V = self.split_heads(V)
        
        # 计算注意力
        attn_output, attn_weights = self.scaled_dot_product_attention(Q, K, V, mask)
        
        # 合并多头
        output = self.combine_heads(attn_output)
        
        # 最后的线性变换
        output = self.W_o(output)
        
        return output, attn_weights
```

## 前馈网络

```python
class PositionWiseFeedForward(nn.Module):
    def __init__(self, d_model, d_ff, dropout=0.1):
        super(PositionWiseFeedForward, self).__init__()
        self.fc1 = nn.Linear(d_model, d_ff)
        self.fc2 = nn.Linear(d_ff, d_model)
        self.dropout = nn.Dropout(dropout)
        self.relu = nn.ReLU()
    
    def forward(self, x):
        # x shape: (batch_size, seq_len, d_model)
        return self.fc2(self.dropout(self.relu(self.fc1(x))))
```

## Encoder Layer

```python
class EncoderLayer(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super(EncoderLayer, self).__init__()
        
        self.self_attn = MultiHeadAttention(d_model, num_heads)
        self.feed_forward = PositionWiseFeedForward(d_model, d_ff, dropout)
        
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        
        self.dropout1 = nn.Dropout(dropout)
        self.dropout2 = nn.Dropout(dropout)
    
    def forward(self, x, mask=None):
        # Self-attention with residual connection
        attn_output, _ = self.self_attn(x, x, x, mask)
        x = self.norm1(x + self.dropout1(attn_output))
        
        # Feed-forward with residual connection
        ff_output = self.feed_forward(x)
        x = self.norm2(x + self.dropout2(ff_output))
        
        return x
```

## Decoder Layer

```python
class DecoderLayer(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super(DecoderLayer, self).__init__()
        
        self.self_attn = MultiHeadAttention(d_model, num_heads)
        self.cross_attn = MultiHeadAttention(d_model, num_heads)
        self.feed_forward = PositionWiseFeedForward(d_model, d_ff, dropout)
        
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.norm3 = nn.LayerNorm(d_model)
        
        self.dropout1 = nn.Dropout(dropout)
        self.dropout2 = nn.Dropout(dropout)
        self.dropout3 = nn.Dropout(dropout)
    
    def forward(self, x, enc_output, src_mask=None, tgt_mask=None):
        # Masked self-attention
        attn_output, _ = self.self_attn(x, x, x, tgt_mask)
        x = self.norm1(x + self.dropout1(attn_output))
        
        # Cross-attention
        attn_output, _ = self.cross_attn(x, enc_output, enc_output, src_mask)
        x = self.norm2(x + self.dropout2(attn_output))
        
        # Feed-forward
        ff_output = self.feed_forward(x)
        x = self.norm3(x + self.dropout3(ff_output))
        
        return x
```

## 完整的 Transformer

```python
class Transformer(nn.Module):
    def __init__(self, src_vocab_size, tgt_vocab_size, d_model=512, 
                 num_heads=8, num_encoder_layers=6, num_decoder_layers=6,
                 d_ff=2048, max_seq_len=5000, dropout=0.1):
        super(Transformer, self).__init__()
        
        # Embeddings
        self.encoder_embedding = nn.Embedding(src_vocab_size, d_model)
        self.decoder_embedding = nn.Embedding(tgt_vocab_size, d_model)
        
        # Positional encoding
        self.pos_encoding = PositionalEncoding(d_model, max_seq_len)
        
        # Encoder
        self.encoder_layers = nn.ModuleList([
            EncoderLayer(d_model, num_heads, d_ff, dropout)
            for _ in range(num_encoder_layers)
        ])
        
        # Decoder
        self.decoder_layers = nn.ModuleList([
            DecoderLayer(d_model, num_heads, d_ff, dropout)
            for _ in range(num_decoder_layers)
        ])
        
        # Output layer
        self.fc_out = nn.Linear(d_model, tgt_vocab_size)
        self.dropout = nn.Dropout(dropout)
        
        self.d_model = d_model
    
    def generate_mask(self, src, tgt):
        src_mask = (src != 0).unsqueeze(1).unsqueeze(2)
        tgt_mask = (tgt != 0).unsqueeze(1).unsqueeze(3)
        
        seq_len = tgt.size(1)
        nopeak_mask = (1 - torch.triu(torch.ones(1, seq_len, seq_len), 
                                      diagonal=1)).bool()
        tgt_mask = tgt_mask & nopeak_mask
        
        return src_mask, tgt_mask
    
    def forward(self, src, tgt):
        src_mask, tgt_mask = self.generate_mask(src, tgt)
        
        # Encoder
        src_embedded = self.dropout(self.pos_encoding(
            self.encoder_embedding(src) * math.sqrt(self.d_model)))
        
        enc_output = src_embedded
        for layer in self.encoder_layers:
            enc_output = layer(enc_output, src_mask)
        
        # Decoder
        tgt_embedded = self.dropout(self.pos_encoding(
            self.decoder_embedding(tgt) * math.sqrt(self.d_model)))
        
        dec_output = tgt_embedded
        for layer in self.decoder_layers:
            dec_output = layer(dec_output, enc_output, src_mask, tgt_mask)
        
        # Output
        output = self.fc_out(dec_output)
        
        return output
```

## 训练示例

```python
# 模型参数
src_vocab_size = 10000
tgt_vocab_size = 10000
d_model = 512
num_heads = 8
num_layers = 6
d_ff = 2048
max_seq_len = 100
dropout = 0.1

# 创建模型
model = Transformer(
    src_vocab_size, tgt_vocab_size, d_model,
    num_heads, num_layers, num_layers, d_ff,
    max_seq_len, dropout
)

# 优化器和损失函数
criterion = nn.CrossEntropyLoss(ignore_index=0)
optimizer = torch.optim.Adam(model.parameters(), lr=0.0001, 
                             betas=(0.9, 0.98), eps=1e-9)

# 训练循环
def train_epoch(model, dataloader, optimizer, criterion):
    model.train()
    total_loss = 0
    
    for batch in dataloader:
        src = batch['src']  # (batch_size, src_seq_len)
        tgt = batch['tgt']  # (batch_size, tgt_seq_len)
        
        # 前向传播
        output = model(src, tgt[:, :-1])
        
        # 计算损失
        output = output.contiguous().view(-1, tgt_vocab_size)
        tgt = tgt[:, 1:].contiguous().view(-1)
        
        loss = criterion(output, tgt)
        
        # 反向传播
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        total_loss += loss.item()
    
    return total_loss / len(dataloader)
```

## 推理

```python
def translate(model, src_sentence, src_vocab, tgt_vocab, max_len=50):
    model.eval()
    
    # 将源句子转换为索引
    src_indices = [src_vocab[word] for word in src_sentence.split()]
    src = torch.LongTensor(src_indices).unsqueeze(0)
    
    # 初始化目标序列（从 <sos> 开始）
    tgt_indices = [tgt_vocab['<sos>']]
    
    for _ in range(max_len):
        tgt = torch.LongTensor(tgt_indices).unsqueeze(0)
        
        with torch.no_grad():
            output = model(src, tgt)
        
        # 获取最后一个位置的预测
        next_token = output[0, -1, :].argmax().item()
        tgt_indices.append(next_token)
        
        # 如果预测到 <eos>，停止
        if next_token == tgt_vocab['<eos>']:
            break
    
    # 将索引转换回单词
    tgt_words = [list(tgt_vocab.keys())[i] for i in tgt_indices]
    return ' '.join(tgt_words[1:-1])  # 去掉 <sos> 和 <eos>
```

## 总结

本文实现了完整的 Transformer 模型，包括：

- ✅ 位置编码
- ✅ 多头注意力机制
- ✅ Encoder 和 Decoder
- ✅ 训练和推理流程

Transformer 的成功证明了注意力机制的强大，它已成为现代 NLP 的基础架构。

## 参考资料

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [The Illustrated Transformer](http://jalammar.github.io/illustrated-transformer/)
- [PyTorch Transformer Tutorial](https://pytorch.org/tutorials/beginner/transformer_tutorial.html)
