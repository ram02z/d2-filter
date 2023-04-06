# d2-filter

`d2-filter` is a pandoc filter that adds [D2](https://d2lang.com) syntax
diagrams in markdown documents.

## Example

```
~~~{.d2 pad=20}
x -> y
~~~
```
![Output](https://user-images.githubusercontent.com/59267627/230503069-51bb0a62-68ee-429a-84a8-b42342659268.png)

## Usage 

```bash
# Installation
npm i d2-filter

# Unix
pandoc -F d2-filter test.md -o test.pdf
# Windows
pandoc -F d2-filter.cmd test.md -o test.pdf
```

## Configuration

Using attributes of the fenced code block, you can specify:

- Theme
    - Example: `{.d2 theme=1}`.
    - Default: `0`
    - Values: Run `d2 themes` for possible options.
- Layout engine
    - Example: `{.d2 layout=elk}`.
    - Default: `dagre`
    - Values: Run `d2 layout` for possible options.
- Image format
    - Example: `{.d2 format=png}`
    - Default: `svg`
    - Values: `svg`, `png`, `pdf`
- Sketch
    - Example: `{.d2 sketch=true}`
    - Default: `false`
- Image padding
    - Example: `{.d2 pad=0}`
    - Default: `100`
- Folder
    - Example: `{.d2 folder=img}`
    - Default: no folder as image is encoded to data uri on img tag
- Filename
    - Example: `{.d2 filename="test"}`
    - Default: `diagram-N`
- Pandoc caption
    - Example: `{.d2 filename="This is a test image"}`
    - Default: empty string

## Credits

- [mermaid-filter](https://github.com/raghur/mermaid-filter)
- [mathjax-pandoc-filter](https://github.com/raghur/mermaid-filter)

## License

MIT
