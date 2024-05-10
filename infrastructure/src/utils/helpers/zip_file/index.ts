import { createWriteStream, existsSync, mkdirSync, statSync } from "fs";
import { createReadStream } from "fs";
import { create } from "archiver";
import { resolve } from "path";

/**
 * @param {String} file_path: /path/to/file/to/compress.txt
 * @param {String} out_dir: /path/to/directory
 * @returns {Promise}
 */
export const zip_file = async (file_path: string, out_dir: string) => {
  const output_dir = resolve(out_dir);

  if (!existsSync(output_dir)) {
    mkdirSync(output_dir, { recursive: true });
  }

  const file_name = file_path.split("/").pop(); // Extract the file name
  const output_file_path = resolve(output_dir, `${file_name}.zip`);

  if (!file_name) throw new Error("file name not entered.");

  const source_stats = statSync(file_path);

  const archive = create("zip", { zlib: { level: 9 } });
  const output_stream = createWriteStream(output_file_path);

  return new Promise((res, rej) => {
    output_stream.on("close", () => {
      if (archive.pointer() > 0) {
        res(true); // Resolve if data has been written to the stream
      } else {
        rej("Failed to create zip file."); // Reject if no data has been written
      }
    });

    archive
      .on("error", (err) => {
        rej(err); // Reject on error
        archive.abort(); // Abort the archive process on error
      })
      .pipe(output_stream); // Pipe data into the stream

    archive.append(createReadStream(file_path), {
      name: file_name,
      stats: source_stats,
    }); // Add the file to the archive with its name

    archive.finalize(); // Finalize the archive
  });
};
