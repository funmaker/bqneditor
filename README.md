# BQN Editor

<a href="https://github.com/funmaker/bqneditor"><img src="https://github.com/funmaker/bqneditor/actions/workflows/release_build.yml/badge.svg" height="23"></a>

[Website](https://bqn.funmaker.moe)

[Changelog](./CHANGELOG.md)

<!-- HELP START -->

This is an unofficial online editor for the [BQN](https://mlochbaum.github.io/BQN/asdasd) programming language
made by [Fun Maker](https://github.com/funmaker/). You can find the source code on [GitHub](https://github.com/funmaker/bqneditor).
Currently it is using [bqn.js](https://github.com/mlochbaum/BQN/blob/master/docs/bqn.js) as the interpreter.

# Multimedia output

`•Show 𝕩` system function automatically detects image and audio output depending on the shape (`≢𝕩`). You can turn this
feature off in settings.

Images have to be at least 10x10. They are represented as arrays of 0-255 values.
Allowed shapes are: `h‿w` (grayscale) `h‿w‿3` (RGB) `h‿w‿4` (RGBA) where `h` is height and `w` is width.

Example grayscale gradient: `+´¨ ↕ 127‿127`

Audio is represented as an array of at least 64 PCM samples from -1 to 1. It can be a list for mono audio, or an array
of shape `s‿2` or `2‿s` for stereo audio. You can get and change sample rate using `•SampleRate 𝕩` and
`•SetSampleRate 𝕩` respectively.

Example sine wave: `•math.Sin 2 × π × 60 × ↕⊸÷ •SampleRate @`

You can find more examples in the editor's menu.

# System-provided values

All bqn.js system values are avaliable. [BQN Specification](https://mlochbaum.github.io/BQN/spec/system.html)
includes standard system values. Note, this list includes many system values that are not avaliable in bqn.js and
therefore in BQN Editor. You can list all supported system values using: `•listSys`
Additionally, BQN Editor adds following system values:

- `•GetLine 𝕩` Reads next line from program input. `𝕩` is ignored.
- `•SampleRate 𝕩` Gets current sample rate. `𝕩` is ignored.
- `•SetSampleRate 𝕩` Sets sample rate. `𝕩` must be an integer between 1 and 4'294'967'295 inclusive.

You can list all the avaliable system values using: `•listSys`

<!-- HELP END -->

## Source code usage

### Run development

```bash
npm run start
```

### Build production

```bash
npm run build
```
