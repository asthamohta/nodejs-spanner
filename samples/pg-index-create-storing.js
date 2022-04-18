// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// sample-metadata:
//  title: Creates a new storing index in a Spanner PostgreSQL database.
//  usage: node pg-index-create-storing.js <INSTANCE_ID> <DATABASE_ID> <PROJECT_ID>

'use strict';

function main(
  instanceId = 'my-instance',
  databaseId = 'my-database',
  projectId = 'my-project-id'
) {
  // [START spanner_postgresql_create_storing_index]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const instanceId = 'my-instance';
  // const databaseId = 'my-database';
  // const projectId = 'my-project-id';

  // Imports the Google Cloud Spanner client library
  const {Spanner} = require('@google-cloud/spanner');

  // Instantiates a client
  const spanner = new Spanner({
    projectId: projectId,
  });

  async function pgCreateStoringIndex() {
    // Gets a reference to a Cloud Spanner instance and database
    const instance = spanner.instance(instanceId);
    const database = instance.database(databaseId);

    const request = [
      'CREATE INDEX SingersBySingerName ON Singers(FirstName) INCLUDE(LastName, SingerInfo)',
    ];

    // Creates a new index in the database
    try {
      const [operation] = await database.updateSchema(request);

      console.log('Waiting for operation to complete...');
      await operation.promise();

      console.log('Added the SingersBySingerName index.');
    } catch (err) {
      console.error('ERROR:', err);
    } finally {
      // Close the database when finished.
      database.close();
    }
  }
  pgCreateStoringIndex();
  // [END spanner_postgresql_create_storing_index]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
