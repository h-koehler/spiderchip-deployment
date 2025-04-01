import { glob } from 'glob';
import fs from 'fs';
import path from 'path';

const FILE_EXTENSIONS = [
  'js',
  'jsx',
  'ts',
  'tsx',
  'json',
  'md',
  'css',
  'html',
  'sql',
]; // Add more as needed

function removeTrailingEmptyLines(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const trimmedContent = content.replace(/\s+$/, '') + '\n'; // Ensure exactly one newline at EOF
  fs.writeFileSync(filePath, trimmedContent, 'utf8');
}

function formatFiles() {
  glob(
    `**/*.{${FILE_EXTENSIONS.join(',')}}`,
    { ignore: 'node_modules/**' },
    (err, files) => {
      if (err) {
        console.error('Error finding files:', err);
        return;
      }

      files.forEach((file) => {
        removeTrailingEmptyLines(file);
      });

      console.log(
        '✅ All files formatted: Empty lines at end of files removed!'
      );
    }
  );
}

formatFiles();
