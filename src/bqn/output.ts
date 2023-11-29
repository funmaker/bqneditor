import { isShapedNumArr } from "./utils";
import bqn from "./bqn";

export interface BQNOutput {
  id: string;
  raw: any;
  delay: number;
  error: boolean;
  text?: string;
  image?: ImageData;
  audio?: Blob;
}

export function parseOutput(raw: any, delay: number, error = false, sampleRate = 8000) {
  console.log(raw, sampleRate);
  
  const output: BQNOutput = {
    id: Math.random().toString(16).slice(2),
    raw,
    delay,
    error,
  };
  if(error) {
    output.text = bqn.fmtErr(raw);
  } else if(isShapedNumArr(raw)
            && (raw.sh.length === 2 || raw.sh.length === 3)
            && raw.sh[0] >= 10 && raw.sh[1] >= 10 && (raw.sh.length === 2 || raw.sh[2] === 3 || raw.sh[2] === 4)
            && raw.every(num => num >= 0 && num <= 255)) {
    const [height, width, channels] = raw.sh;
    
    const imageData = new ImageData(width, height);
    
    for(let pos = 0; pos < width * height; pos++) {
      if(channels === 3) {
        imageData.data[pos * 4] = raw[pos * 3];
        imageData.data[pos * 4 + 1] = raw[pos * 3 + 1];
        imageData.data[pos * 4 + 2] = raw[pos * 3 + 2];
        imageData.data[pos * 4 + 3] = 255;
      } else if(channels === 4) {
        imageData.data[pos * 4] = raw[pos * 4];
        imageData.data[pos * 4 + 1] = raw[pos * 4 + 1];
        imageData.data[pos * 4 + 2] = raw[pos * 4 + 2];
        imageData.data[pos * 4 + 3] = raw[pos * 4 + 3];
      } else {
        imageData.data[pos * 4] = raw[pos];
        imageData.data[pos * 4 + 1] = raw[pos];
        imageData.data[pos * 4 + 2] = raw[pos];
        imageData.data[pos * 4 + 3] = 255;
      }
    }
    
    output.image = imageData;
  } else if(isShapedNumArr(raw)
            && (raw.sh[0] > 64 || raw.sh[1] > 64)
            && (raw.sh.length === 1 || raw.sh.length === 2)
            && (raw.sh.length === 1 || raw.sh[0] === 2 || raw.sh[1] === 2)
            && raw.every(num => num >= -1 && num <= 1)) {
    const blocks = Math.max(raw.sh[0], raw.sh[1] || 0);
    const stereo = raw.sh.length == 2;
    const transpose = stereo && raw.sh[0] === 2;
    
    const sampleBits = 16;
    
    const channels = stereo ? 2 : 1;
    const bytesPerSample = Math.ceil(sampleBits / 8);
    const blockAlign = channels * bytesPerSample;
    const halfRange = 2 ** (sampleBits - 1) - 1;
    
    const wav = new DataView(new ArrayBuffer(44 + (blocks + 1) * blockAlign)); // No idea why extra block is needed
    
    wav.setUint32(0, 0x52494646, false); // ChunkID - 'RIFF'
    wav.setUint32(4, wav.byteLength - 8, true); // ChunkSize
    wav.setUint32(8, 0x57415645, false); // Format - 'WAVE'
    
    wav.setUint32(12, 0x666d7420, false); // SubchunkID - 'fmt '
    wav.setUint32(16, 16, true); // SubchunkSize
    wav.setUint16(20, 1, true); // AudioFormat - 1 = PCM
    wav.setUint16(22, channels, true); // NumChannels
    wav.setUint32(24, sampleRate, true); // SampleRate
    wav.setUint32(28, sampleRate * channels * bytesPerSample, true); // ByteRate
    wav.setUint32(32, blockAlign, true); // BlockAlign
    wav.setUint32(34, sampleBits, true); // BitsPerSample
    
    wav.setUint32(36, 0x64617461, false); // SubchunkID - 'data'
    wav.setUint32(40, blocks * bytesPerSample, false); // SubchunkSize
    
    for(let block = 0; block < blocks; block++) {
      if(!stereo) {
        wav.setInt16(44 + block * blockAlign, raw[block] * halfRange, true);
      } if(transpose) {
        wav.setInt16(44 + block * blockAlign, raw[block] * halfRange, true);
        wav.setInt16(44 + block * blockAlign + bytesPerSample, raw[block + blocks] * halfRange, true);
      } else {
        wav.setInt16(44 + block * blockAlign, raw[block * channels] * halfRange, true);
        wav.setInt16(44 + block * blockAlign + bytesPerSample, raw[block * channels + 1] * halfRange, true);
      }
    }
    
    output.audio = new Blob([wav], { type: "audio/wav" });
  }
  
  return output;
}

export function formatOutput(value: any) {
  return bqn.fmt(value);
}
