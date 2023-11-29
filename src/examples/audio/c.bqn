# Plays middle C

sampleRate ← •SetSampleRate 8000
Note ← 440 × 2 ⋆ 12 ÷˜ ⊢

•math.Sin 2 × π × (Note ¯9) × ↕⌾(×⟜sampleRate) 2
