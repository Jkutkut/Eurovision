class Song {
  country: string;
  artist: string;
  song: string;
  link: string;
  
  constructor(country: string, artist: string, song: string, link: string) {
    this.country = country;
    this.artist = artist;
    this.song = song;
    this.link = link;
  }

  static fromJSON(json: any): Song {
    return new Song(
      json.country,
      json.artist,
      json.song,
      json.link
    );
  }
}

export default Song;