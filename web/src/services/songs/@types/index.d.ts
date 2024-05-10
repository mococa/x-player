export namespace SongsService {
  export interface CreateSongInput {
    url: string;
    song_details: {
      name: string;
      artist: string;
      cover_art: string;
      duration_ms: number;
    };
  }
}
