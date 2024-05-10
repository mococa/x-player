import { Models } from "_@types/models";
import { api } from "_services";
import { SongsService } from "./@types";

const get_songs = () => {
  return api.get<{ songs: Models.Song[] }>("/songs");
};

const add_song = ({ url, song_details }: SongsService.CreateSongInput) => {
  return api.post("/songs", {
    url,
    song_details: JSON.stringify(song_details),
  });
};

const get_presigned_url = (file_name: string, file_type: string) => {
  return api.put<{ presigned_url: string; key: string }>(
    "/songs",
    {},
    { params: { file_name, file_type } }
  );
};

const presign_url = (url: string, file: File) => {
  return api.put(url, file, {
    headers: {
      "Content-Type": file.type,
      "x-amz-acl": "public-read",
    },
  });
};

export const songs = { get_songs, add_song, get_presigned_url, presign_url };
