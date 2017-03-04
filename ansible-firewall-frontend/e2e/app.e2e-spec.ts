import { AnsibleFirewallUiPage } from './app.po';

describe('ansible-firewall-ui App', function() {
  let page: AnsibleFirewallUiPage;

  beforeEach(() => {
    page = new AnsibleFirewallUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
