/**
 * Copyright 2022 Google LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// sample-metadata:
//  title: Creates an instance with autoscaling config.
//  usage: node instance-autoscaling-config-create <INSTANCE_ID> <PROJECT_ID>

'use strict';

function main(instanceId = 'my-instance-id', projectId = 'my-project-id') {
  // [START spanner_create_instance_with_autoscaling_config]

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const instanceId = 'custom-my-instance-id'
  // const projectId = 'my-project-id';

  // Imports the Google Cloud client library
  const {Spanner} = require('@google-cloud/spanner');

  // Creates a client
  const spanner = new Spanner({
    projectId: projectId,
  });
  async function createInstanceWithAutoscalingConfig() {
    const instance = spanner.instance(instanceId);
    const autoScalingConfig = Spanner.AutoscalingConfig({
      // Only one of minNodes/maxNodes or minProcessingUnits/maxProcessingUnits
      // can be set. Both min and max need to be set and maxNodes/maxProcessingUnits
      // can be at most 10X of minNodes/minProcessingUnits.
      autoscalingLimits: {
        minNodes: 1,
        maxNodes: 2,
      },
      // highPriorityCpuUtilizationPercent and storageUtilizationPercent are both
      // percentages and must lie between 0 and 100.
      autoscalingTargets: {
        highPriorityCpuUtilizationPercent: 60,
        storageUtilizationPercent: 55,
      },
    });

    // Creates a new instance with autoscalingConfig
    try {
      console.log(`Creating instance ${instance.formattedName_}.`);
      const [, operation] = await instance.create({
        config: 'regional-us-west1',
        nodes: 2,
        autoScalingConfig: autoScalingConfig,
      });

      console.log(`Waiting for operation on ${instance.id} to complete...`);
      await operation.promise();

      console.log(`Created instance ${instanceId} with autoscaling config`);
    } catch (err) {
      console.error('ERROR:', err);
    }
  }
  createInstanceWithAutoscalingConfig();
  // [END spanner_create_instance_with_autoscaling_config]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
