export namespace Models {
  export interface Thread {
    updated_at: string;
    content: string;
    author: string;
    datatype: "thread";
    created_at: string;
    partition_key: "thread";
    sort_key: string;
    likes: string[];
  }

  export interface Song {
    updated_at: string;
    datatype: "song";
    created_at: string;
    partition_key: "song";
    sort_key: string;
    song_details: {
      name: string;
      duration_ms: number;
      artist: string;
      cover_art: string;
    };
    url: string;
  }

  export interface User {
    updated_at: string;
    datatype: "user";
    created_at: string;
    partition_key: "user";
    sort_key: string;
    username: string;
  }
}
