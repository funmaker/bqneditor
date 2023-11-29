# Plays the Ocarina of Time tune using terminal beeps

sampleRate ← •SetSampleRate 8000
song ← "AADDDDFFAADDDDFFAHBBGGFGAADDCEDDDDDDDDDD"
Note ← 440 × 2 ⋆ 12 ÷˜ ⊢

•math.Sin 2 × π × +` sampleRate ÷˜ Note (⌊ 0.25 × sampleRate) / 12‿14‿3‿5‿7‿8‿10‿15 ⊏˜ 'A' -˜ song
