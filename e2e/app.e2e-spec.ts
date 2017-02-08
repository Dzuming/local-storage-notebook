import { LocalStorageNotebookPage } from './app.po';

describe('local-storage-notebook App', function() {
  let page: LocalStorageNotebookPage;

  beforeEach(() => {
    page = new LocalStorageNotebookPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
