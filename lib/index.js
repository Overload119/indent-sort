'use babel';

import Sorter from './indent-sort';
import { CompositeDisposable } from 'atom';

export default {
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'indent-sort:sort': () => {
          (new Sorter(atom.workspace.getActiveTextEditor())).run();
        },
      }),
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },
};
