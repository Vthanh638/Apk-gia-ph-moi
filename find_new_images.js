import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    if (filePath.includes('node_modules') || filePath.includes('.git') || filePath.includes('dist')) {
      return;
    }
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        results.push({ path: filePath, size: stat.size, mtime: stat.mtime });
      }
    }
  });
  return results;
}

const files = walk('.');
files.sort((a, b) => b.mtime - a.mtime);
console.log('Recent images in workspace:');
files.slice(0, 15).forEach(f => {
  console.log(`- ${f.path} (${f.size} bytes) - ${f.mtime.toISOString()}`);
});
