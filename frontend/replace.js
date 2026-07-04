const fs = require('fs');
const path = require('path');

const dir = 'c:/Hackathon/MetaWiz/frontend/src/components/dashboard';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const replacements = [
  { regex: /bg-\[\#FAFAFA\]/g, repl: 'bg-background' },
  { regex: /bg-white/g, repl: 'bg-card' },
  { regex: /text-\[\#111111\]/g, repl: 'text-foreground' },
  { regex: /bg-\[\#111111\]/g, repl: 'bg-foreground' },
  { regex: /text-\[\#6B7280\]/g, repl: 'text-muted' },
  { regex: /border-\[\#E5E7EB\]/g, repl: 'border-border' },
  { regex: /border-\[\#333\]/g, repl: 'border-border' },
  { regex: /text-\[\#E5E7EB\]/g, repl: 'text-muted' },
  { regex: /text-\[\#FAFAFA\]/g, repl: 'text-background' },
  { regex: /text-\[\#836EF9\]/g, repl: 'text-accent' },
  { regex: /bg-\[\#836EF9\]/g, repl: 'bg-accent' },
  { regex: /text-\[\#16A34A\]/g, repl: 'text-success' },
  { regex: /bg-\[\#16A34A\]/g, repl: 'bg-success' },
  { regex: /text-\[\#DC2626\]/g, repl: 'text-danger' },
  { regex: /bg-\[\#DC2626\]/g, repl: 'bg-danger' },
  { regex: /text-\[\#F59E0B\]/g, repl: 'text-warning' },
  { regex: /bg-\[\#F59E0B\]/g, repl: 'bg-warning' },
  { regex: /bg-\[\#10B981\]/g, repl: 'bg-live' },
  { regex: /text-\[\#10B981\]/g, repl: 'text-live' },
  { regex: /border-\[\#836EF9\]/g, repl: 'border-accent' },
  { regex: /border-\[\#16A34A\]/g, repl: 'border-success' },
  { regex: /border-\[\#DC2626\]/g, repl: 'border-danger' },
  { regex: /bg-\[\#F3F4F6\]/g, repl: 'bg-muted/10' },
  { regex: /bg-\[\#E5E7EB\]/g, repl: 'bg-border' },
  { regex: /border-\[\#F3F4F6\]/g, repl: 'border-border' },
  { regex: /border-t-\[\#836EF9\]/g, repl: 'border-t-accent' },
  { regex: /fill-\[\#111111\]/g, repl: 'fill-foreground' },
  { regex: /fill-\[\#FAFAFA\]/g, repl: 'fill-background' },
];

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  replacements.forEach(r => {
    newContent = newContent.replace(r.regex, r.repl);
  });
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${f}`);
  }
});
