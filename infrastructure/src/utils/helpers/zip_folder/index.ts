import { create } from "archiver";
import { createWriteStream, mkdirSync, existsSync } from "fs";
import { resolve, join, sep } from "path";

/**
 * @param {String} sourceDir: /some/folder/to/compress
 * @param {String} outDir: /path/to/directory
 * @returns {Promise}
 */
export const zip_folder = async (source: string, out: string) => {
  const output_dir = resolve(out);
  const output_file = join(output_dir, "result.zip");

  if (!existsSync(output_dir)) mkdirSync(output_dir, { recursive: true });

  const archive = create("zip", { zlib: { level: 9 } });
  const stream = createWriteStream(output_file);

  return new Promise((res, rej) => {
    stream.on("close", () => res(true)); // Resolve when the stream is closed

    archive
      .on("error", (err) => {
        rej(err); // Reject on error
        archive.abort(); // Abort the archive process on error
      })
      .pipe(stream); // Pipe data into the stream

    archive.directory(resolve(source), false); // Add the source directory to the archive

    archive.finalize(); // Finalize the archive
  });
};
