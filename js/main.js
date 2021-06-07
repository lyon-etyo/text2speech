// Init SpeechSynth API
const synth = window.speechSynthesis;

// DOM Elements
const form = document.querySelector("form");
const textInput = form.querySelector("#text-input");
const voiceSelect = form.querySelector("#voice-select");
const rate = form.querySelector("#rate");
const rateValue = form.querySelector("#rate-value");
const pitch = form.querySelector("#pitch");
const pitchValue = form.querySelector("#pitch-value");

// Init Voices Arr
let voices = [];

const getVoices = () => {
    voices = synth.getVoices();
    // Loop Through voices and create an option for each one
    voices.forEach(voice => {
        // Create option element
        const opt = document.createElement("option");
        // Fill option with voice and language
        opt.textContent = voice.name + " (" + voice.lang + ")";
        // Set needed option attributes
        opt.setAttribute("data-lang", voice.lang);
        opt.setAttribute("data-name", voice.name);
        voiceSelect.appendChild(opt);
    });
};

getVoices();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}

// Speak
const speak = () => {
    // Check if speaking
    if (synth.speaking) {
        console.error("Already speaking...");
        return;
    }

    if (textInput.value !== "") {
        // Add Background Animation
        document.body.style.background = "#141414 url(img/wave.gif)";
        document.body.style.backgroundRepeat = "repeat-x";
        document.body.style.backgroundSize = "100% 30%";
        document.body.style.backgroundBlendMode = "lighten";

        // Get Speak text
        const speakText = new SpeechSynthesisUtterance(textInput.value);
        // Speak End
        speakText.onend = e => {
            console.log("Done Speaking...");
            document.body.style.background = "#141414";
        };
        // Speak Error
        speakText.onerror = e => {
            console.error("Something went wrong...");
        };
        // Selected Voice
        const selectedVoice = voiceSelect.selectedOptions[0].dataset.name;

        // Loop through voices
        voices.forEach(voice => {
            if (voice.name === selectedVoice) {
                speakText.voice = voice;
            }
        });

        // Set pitch and rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        // Go Speak
        synth.speak(speakText);
    }
};

// Event Listener

// Button event
form.addEventListener("submit", e => {
    e.preventDefault();
    speak();
    textInput.blur();
});

// Range Rate Event
rate.addEventListener("change", () => (rateValue.textContent = rate.value));

// Range Pitch Event
pitch.addEventListener("change", () => (pitchValue.textContent = pitch.value));

// Voice Select Event
voiceSelect.addEventListener("change", () => speak());
