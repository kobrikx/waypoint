import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';

import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupSession } from 'waypoint/tests/helpers/login';

module('Acceptance | deployment detail', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupSession(hooks);

  test('displays a status report badge if available', async function (assert) {
    let project = this.server.create('project', { name: 'acme-project' });
    let application = this.server.create('application', { name: 'acme-app', project });
    let deployment = this.server.create('deployment', 'random', { application });
    this.server.create('status-report', 'ready', { application, target: deployment });

    await visit(`/default/acme-project/app/acme-app/deployment/seq/${deployment.sequence}`);

    assert.dom('[data-test-status-report-indicator="ready"]').exists();
  });

  test('displays no status report badge if none is available', async function (assert) {
    let project = this.server.create('project', { name: 'acme-project' });
    let application = this.server.create('application', { name: 'acme-app', project });
    let deployment = this.server.create('deployment', 'random', { application });

    await visit(`/default/acme-project/app/acme-app/deployment/seq/${deployment.sequence}`);

    assert.dom('[data-test-status-report-indicator]').doesNotExist();
  });

  test('redirects from the ID to the sequence route', async function (assert) {
    let project = this.server.create('project', { name: 'acme-project' });
    let application = this.server.create('application', { name: 'acme-app', project });
    let deployment = this.server.create('deployment', 'random', { application });

    await visit(`/default/acme-project/app/acme-app/deployment/${deployment.id}`);

    assert.equal(currentURL(), `/default/acme-project/app/acme-app/deployment/seq/${deployment.sequence}`);
  });
});
