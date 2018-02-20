# Indent Sort

A normal line sort can ruin the layout and syntax of indented code. This plugin aims to
respect indentation while sorting, useful for sorting method names, or props of a React component.

## Usage

- Uses the indentation from the first highlighted line.
- Makes some assumptions about the indented code. Namely:
  - Newlines are preserved and kept in the same order.
  - Include single-character lines as part of the indentation block.

![Indent Sort](./demo.gif)

```
class Foo() {
  b() {
    func();
  }
  a() {
    func();
  }
}

def methodC:
  foo()
def methodA:
  foo()
def methodB:
  foo()

<Foo
  unsortedProp={{
    a: 1,
    z: 2,
  }}
  aFoo={2}
  bFoo={1}
/>
```

Will turn into:

```
class Foo() {
  a() {
    func();
  }
  b() {
    func();
  }
}

def methodA:
  foo()
def methodB:
  foo()
def methodC:
  foo()

<Foo
  aFoo={2}
  bFoo={1}
  unsortedProp={{
    a: 1,
    z: 2,
  }}
/>
```

## keymap.json

```
'atom-workspace':
  'ctrl-6': 'indent-sort:sort'
```
