var KEYS = ['c', 'd', 'e', 'f'];
var NOTE_DURATION = 1000;

// NoteBox
//
// Acts as an interface to the coloured note boxes on the page, exposing methods
// for playing audio, handling clicks,and enabling/disabling the note box.
function NoteBox(key, onClick) {
	// Create references to box element and audio element.
	var boxEl = document.getElementById(key);
	var audioEl = document.getElementById(key + '-audio');
	if (!boxEl) throw new Error('No NoteBox element with id' + key);
	if (!audioEl) throw new Error('No audio element with id' + key + '-audio');

	// When enabled, will call this.play() and this.onClick() when clicked.
	// Otherwise, clicking has no effect.
	var enabled = true;
	// Counter of how many play calls have been made without completing.
	// Ensures that consequent plays won't prematurely remove the active class.
	var playing = 0;

	this.key = key;
	this.onClick = onClick || function () {};

	// Plays the audio associated with this NoteBox
	this.play = function () {
		playing++;
		// Always play from the beginning of the file.
		audioEl.currentTime = 0;
		audioEl.play();

		// Set active class for NOTE_DURATION time
		boxEl.classList.add('active');
		setTimeout(function () {
			playing--
			if (!playing) {
				boxEl.classList.remove('active');
			}
		}, NOTE_DURATION)
	}

	// Enable this NoteBox
	this.enable = function () {
		enabled = true;
	}

	// Disable this NoteBox
	this.disable = function () {
		enabled = false;
	}

	// Call this NoteBox's clickHandler and play the note.
	this.clickHandler = function () {
		if (!enabled) return;

		this.onClick(this.key)
		this.play()
	}.bind(this)

	boxEl.addEventListener('mousedown', this.clickHandler);
}

// Example usage of NoteBox.
//
// This will create a map from key strings (i.e. 'c') to NoteBox objects so that
// clicking the corresponding boxes on the page will play the NoteBox's audio.
// It will also demonstrate programmatically playing notes by calling play directly.
var notes = {};

KEYS.forEach(function (key) {
	notes[key] = new NoteBox(key, onkeyClick); // Changed here!
});

KEYS.concat(KEYS.slice().reverse()).forEach(function(key, i) {
	setTimeout(notes[key].play.bind(null, key), i * NOTE_DURATION);
});


var lok = [];  
var timeOutID = null; 

//  add to list of keys 
function onkeyClick(keyString) {
    lok.push(notes[keyString]); 
	console.log('Clicked ' + keyString)
    if(timeOutID != null){
		console.log('Cancel ' + timeOutID)
        clearTimeout(timeOutID);
    }
    timeOutID = setTimeout(echo, 2500); 
	console.log('TimeoutID is ' + timeOutID)
} 

function wait(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms)
    })
}

//  play the keys out 
async function echo() {
	console.log('Echoing')
    for(k of Object.values(notes)){
        k.disable(); 
    }
    for(k of lok){
        k.play(); 
		console.log('Playing ' + k.key)
        await wait(NOTE_DURATION);
    }
    for(k of Object.values(notes)){
        k.enable(); 
    }
    timeOutID = null; 
	lok.length = 0;
} 
