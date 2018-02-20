'use babel';

import naturalSort from 'javascript-natural-sort';

const TAB = '\t';
const SPACE = ' ';
const NEW_LINE = '\n';
const MAX_INT = 999999999;
const DEBUG = false;

/**
 * Retrives the left-most indentation count for a block of text.
 */
function getIndentationCount(text) {
  const lines = text.split('\n');
  const topLine = lines[0];
  let indentCount = 0;
  for (let ii = 0; ii < topLine.length; ii++) {
    if (topLine[ii] === TAB || topLine[ii] === SPACE) {
      indentCount++;
    } else {
      break;
    }
  }
  return indentCount;
}

/**
 * Alphabetically sorted by the first line in each block.
 */
function sortTextBlocks(textBlocks) {
  // Find the empty blocks and consider those newlines.
  const nonEmptyBlocks = [];
  const emptyBlockIndices = [];
  for (let ii = 0; ii < textBlocks.length; ii++) {
    const block = textBlocks[ii];
    if (block.trim() === '') {
      emptyBlockIndices.push(ii);
    } else {
      nonEmptyBlocks.push(block);
    }
  }

  if (DEBUG) {
    console.log('Empty Block Indices');
  }
  if (DEBUG) {
    console.log(emptyBlockIndices);
  }
  nonEmptyBlocks.sort((a, b) => {
    const firstLineA = a.split('\n')[0];
    const firstLineB = b.split('\n')[0];
    // Alphabetical sort.
    return naturalSort(firstLineA, firstLineB);
  });

  // Insert the empty blocks back in.
  emptyBlockIndices.forEach(idx => nonEmptyBlocks.splice(idx, 0, '\n'));
  return nonEmptyBlocks;
}

/**
 * Splits the raw string into an array where each element is a block
 * of text (string) that starts and ends at the same indentation level.
 */
function getTextBlocks(text) {
  if (DEBUG) {
    console.log('Selected Text ...');
    console.log(text);
  }
  const lines = text.split('\n');
  lines.pop(); // Remove the extra newline at the end.
  console.log(lines);
  let sortIndentCount = getIndentationCount(lines[0]);
  if (DEBUG) {
    console.log('Indentation Level: %d', sortIndentCount);
  }
  // Split into blocks of text with respect to the indentation level.
  let blocks = [];
  let blockText = null;
  for (var ii = 0; ii < lines.length; ii++) {
    const line = lines[ii];
    const lineIndentation = getIndentationCount(line);
    const isStartOrStop = lineIndentation === sortIndentCount;
    if (isStartOrStop && blockText === null) {
      // We're starting a block of text.
      blockText = line + NEW_LINE;
      if (DEBUG) {
        console.log('Start Block of Text: ', line);
      }
    } else if (isStartOrStop && blockText !== null) {
      // This ends the indentation. Append and add the block.
      // If the line has more than a single character, we assume it's a
      // language that has implicit blocks.
      if (line.trim().length === 1) {
        blockText += line + NEW_LINE;
        blocks.push(blockText);
        blockText = null;
        if (DEBUG) {
          console.log('> Append and add to last block: ', line);
        }
      } else {
        // Push the previous block.
        blocks.push(blockText);
        // Start a new block.
        blockText = line + NEW_LINE;
        if (DEBUG) {
          console.log('Start Block of Text: ', line);
        }
      }
    } else if (line.trim() === '') {
      // This is just a newline. We consider it a block but we'll ignore it
      // when sorting.
      if (blockText !== null) {
        blocks.push(blockText);
      }

      blocks.push(NEW_LINE);
      blockText = null;
      if (DEBUG) {
        console.log('- Add Newline -', line);
      }
    } else {
      if (DEBUG) {
        console.log('> Append to last block: ', line);
      }
      blockText += line + NEW_LINE;
    }
  }
  if (blockText !== null) {
    blocks.push(blockText);
  }
  return blocks;
}

class Sorter {
  constructor(editor) {
    this._editor = editor;
  }

  run(editor) {
    if (DEBUG) {
      console.log('Sorting...');
    }
    const currentRange = this._editor.getSelectedBufferRange();
    const startRow = currentRange.start.row;
    const endRow = currentRange.end.row;
    console.log(currentRange);
    const text = this._editor.getTextInBufferRange([[startRow, 0], [endRow + 1, -1]]);
    let textBlocks = getTextBlocks(text);
    if (DEBUG) {
      console.log('Unsorted Text Blocks', textBlocks);
    }
    textBlocks = sortTextBlocks(textBlocks);
    if (DEBUG) {
      console.log('Sorted Text Blocks', textBlocks);
    }
    const sortedText = textBlocks.join('');
    if (DEBUG) {
      console.log('Sorted Text ...\n', sortedText);
    }
    this._editor.setTextInBufferRange([[startRow, 0], [endRow + 1, -1]], sortedText);
  }
}

export default Sorter;
