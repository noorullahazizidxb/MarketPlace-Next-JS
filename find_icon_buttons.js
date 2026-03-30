const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        walk(path.join(dir, file), fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const files = walk('d:/projects/MarketPlace_Back_end__Front_End/marketplace-Front-end/src');

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const relativePath = file.substring(file.indexOf('src'));

  // Very simple heuristic: look for <button, <Button, or <Link that only seem to have a single icon child
  // To avoid false positives, we'll just print out elements that contain classes like "size-*" and no text inside.
  
  // Actually, let's just find lines matching <button ...> <Icon ... /> </button>
  // Or cases manually. We'll do a simpler regex matching across lines using content:
  
  // It's easier to find `<button` or `<Link` lines and context.
}
