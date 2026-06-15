---
title: Markdown Syntax Guide
date: 2026-06-08 22:35:05
tags:
  - Markdown
  - Reference
tag_tree: Tutorials/Markdown
---

A comprehensive guide to Markdown syntax supported by this theme.

## Text Formatting

- **Bold** and *italic* and ~~strikethrough~~
- `Inline code` and [links](https://hexo.io)
- ~~Mistaken text~~ with strikethrough

## Blockquotes

> This is a blockquote.
>
> It can span multiple paragraphs.

### Nested blockquotes

> Level 1
>
> > Level 2
> >
> > > Level 3

## Code Blocks

### JavaScript

```javascript
function greet(name) {
  const message = `Hello, ${name}!`;
  console.log(message);
}

greet('Hexo');
```

### CSS

```css
.tag-tree-list {
  list-style: none;
  padding-left: 1.5em;
}

.tag-tree-toggle {
  cursor: pointer;
}
```

### Python

```python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

print(list(fibonacci(10)))
```

## Lists

### Unordered

- Item one
- Item two
  - Nested item A
  - Nested item B
- Item three

### Ordered

1. First step
2. Second step
3. Third step

## Tables

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headings | ✅ | H1–H6 |
| Lists | ✅ | Ordered & unordered |
| Code | ✅ | Inline & blocks |
| Tables | ✅ | With alignment |

## Horizontal Rules

---

Above this line is a horizontal rule.
