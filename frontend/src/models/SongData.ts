import Song from "./Song";

class SongData {
  static NO_POINTS = -1;

  public id: string;
  public song: Song;
  public points: number;
  public nickname: string;
  public notes: string;
  
  constructor(
    song: Song,
    points?: number,
    nickname?: string,
    notes?: string
  ) {
    this.id = song.country;
    this.song = song;
    this.points = points || SongData.NO_POINTS;
    this.nickname = nickname || "";
    this.notes = notes || "";
  }
}

export default SongData;
