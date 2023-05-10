class SongData {
  country: string;
  points: number;
  nickname: string | null;
  notes: string | null;
  
  constructor(
    country: string,
    points: number,
    nickname: string | null = null,
    notes: string | null = null
    ) {
      this.country = country;
      this.points = points;
      this.nickname = nickname;
      this.notes = notes;
    }

  static fromJSON(json: any): SongData {
    return new SongData(
      json.country,
      json.points
    );
  }
}

export default SongData;