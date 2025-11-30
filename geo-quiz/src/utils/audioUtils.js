// Web Audio API utilities for playing musical tones

let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

// Frequency of middle C (C4)
const C4 = 261.63;

// All chromatic intervals in semitones from the root
const intervals = {
  'Unison': 0,
  'Minor 2nd': 1,
  'Major 2nd': 2,
  'Minor 3rd': 3,
  'Major 3rd': 4,
  'Perfect 4th': 5,
  'Tritone': 6,
  'Perfect 5th': 7,
  'Minor 6th': 8,
  'Major 6th': 9,
  'Minor 7th': 10,
  'Major 7th': 11,
  'Octave': 12
};

// Convert semitones to frequency multiplier
const getFrequency = (semitones) => {
  return C4 * Math.pow(2, semitones / 12);
};

// Play a single tone
const playTone = (frequency, duration, startTime, context) => {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';

  // Envelope for smooth attack and release
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05); // Attack
  gainNode.gain.linearRampToValueAtTime(0.3, startTime + duration - 0.05); // Sustain
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration); // Release

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
};

// Play an interval (root note then second note)
export const playInterval = (intervalName) => {
  const context = getAudioContext();
  const currentTime = context.currentTime;

  const semitones = intervals[intervalName];
  const rootFreq = C4;
  const intervalFreq = getFrequency(semitones);

  // Play root note
  playTone(rootFreq, 0.8, currentTime + 0.1, context);

  // Play interval note after a short pause
  playTone(intervalFreq, 0.8, currentTime + 1.0, context);
};

// Get all available intervals (excluding unison for the quiz)
export const getIntervals = () => {
  return Object.keys(intervals).filter(name => name !== 'Unison');
};

// Get a random interval
export const getRandomInterval = () => {
  const availableIntervals = getIntervals();
  return availableIntervals[Math.floor(Math.random() * availableIntervals.length)];
};
