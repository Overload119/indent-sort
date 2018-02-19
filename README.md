# Indent Sort

- Sorts while respecting indentation. Useful for when you have method in a class for example and you want to sort the methods, not the lines themselves.
- Uses the indentation from the line of the caret and sorts in respect to that.

```
class Foo() {
  b() {
    func();
  }
  a() {
    func();
  }
}
```

Will turn into:

```
class Foo() {
  b() {
    func();
  }
  a() {
    func();
  }
}
```

## keymap.json

This is the default keymap.json. Feel free to update it.

```
'atom-workspace':
  'alt-shift-4': 'indent-sort:sort'
```
