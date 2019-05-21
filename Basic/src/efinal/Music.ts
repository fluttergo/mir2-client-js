class Music {
		// appear_mp3: "appear_mp3",
		// bg_mp3: "bg_mp3",
		// click_mp3: "click_mp3",
		// die_mp3: "die_mp3",
		// draw_mp3: "draw_mp3",
		// explode_mp3: "explode_mp3",
		// get_mp3: "get_mp3",
		// lay_mp3: "lay_mp3",
		// save_mp3: "save_mp3",
		// start_mp3: " start_mp3",
		// win_mp3: "win_mp3",
	public static music = {
	}
	public static play(name):SoundBase {
		if (Music.music[name] == null) {
			Music.music[name] = new SoundBase(name);
		}
		Music.music[name].play();
		return Music.music[name];
	}
	public static stop(name){
		Music.music[name].stop();
	}
}