import { Models } from "_@types/models";

export const threads: Models.Thread[] = [
  {
    partition_key: "thread",
    sort_key: "thread#0001",
    datatype: "thread",
    updated_at: new Date().toString(),
    likes: [],
    created_at: new Date().toString(),
    author: "mococa",
    content:
      "Crafting a music app can be complicated if you use the wrong technologies.",
  },
  {
    partition_key: "thread",
    sort_key: "thread#0002",
    likes: ["", ""],
    datatype: "thread",
    updated_at: new Date().toString(),
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toString(),
    author: "mortaro",
    content: "Hi, I'm a mock.",
  },
  {
    partition_key: "thread",
    sort_key: "thread#0003",
    likes: ["", "", "", "", "", ""],
    datatype: "thread",
    updated_at: new Date().toString(),
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toString(),
    author: "brunoml",
    content: "Hi, guys!",
  },
  {
    partition_key: "thread",
    sort_key: "thread#0004",
    datatype: "thread",
    updated_at: new Date().toString(),
    likes: ["", ""],
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toString(),
    author: "benkaat",
    content: "hello!",
  },
];

export const library: Models.Song[] = [
  {
    partition_key: "song",
    sort_key: "song#0001",
    created_at: new Date().toString(),
    updated_at: new Date().toString(),
    datatype: "song",
    song_details: {
      cover_art:
        "https://i.scdn.co/image/ab67616d00001e0242be808911785ceb13140edc",
      artist: "Megadeth",
      name: "Holy Wars...The Punishment Due",
      duration_ms: 396133,
    },
    url: "https://media.geeksforgeeks.org/wp-content/uploads/20220913101124/audiosample.ogg?song=0001",
  },
  {
    partition_key: "song",
    sort_key: "song#0002",
    created_at: new Date().toString(),
    updated_at: new Date().toString(),
    datatype: "song",
    song_details: {
      cover_art:
        "https://i.scdn.co/image/ab67616d00001e0275ad7a799972e50bb555ca46",
      artist: "Los Hermanos",
      name: "Primavera",
      duration_ms: 262040,
    },
    url: "https://media.geeksforgeeks.org/wp-content/uploads/20220913101124/audiosample.ogg?song=0002",
  },
  {
    partition_key: "song",
    sort_key: "song#0003",
    created_at: new Date().toString(),
    updated_at: new Date().toString(),
    datatype: "song",
    song_details: {
      cover_art:
        "https://i.scdn.co/image/ab67616d00001e02857fadd6b72754c3c919ed31",
      artist: "Paradis",
      name: "La Ballade de Jim",
      duration_ms: 408601,
    },
    url: "https://media.geeksforgeeks.org/wp-content/uploads/20220913101124/audiosample.ogg?song=0003",
  },
  {
    partition_key: "song",
    sort_key: "song#0004",
    created_at: new Date().toString(),
    updated_at: new Date().toString(),
    datatype: "song",
    song_details: {
      cover_art:
        "https://i.scdn.co/image/ab67616d00001e02b7ccab44e5790e085e9f22fb",
      artist: "La Femme",
      name: "Nous étions deux",
      duration_ms: 368826,
    },
    url: "https://media.geeksforgeeks.org/wp-content/uploads/20220913101124/audiosample.ogg?song=0004",
  },
];
