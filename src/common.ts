/*!
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {grpc, CallOptions, Operation as GaxOperation} from 'google-gax';
import {google as instanceAdmin} from '../protos/protos';
import {google as databaseAdmin} from '../protos/protos';

export type IOperation = instanceAdmin.longrunning.IOperation;

export type Schema =
  | string
  | string[]
  | databaseAdmin.spanner.admin.database.v1.IUpdateDatabaseDdlRequest;

export interface ResourceCallback<Resource, Response> {
  (
    err: grpc.ServiceError | null,
    resource?: Resource | null,
    response?: Response
  ): void;
}
export type PagedResponse<Item, Response> = [Item[], {} | null, Response];

export type RequestCallback<T, R = void> = R extends void
  ? NormalCallback<T>
  : PagedCallback<T, R>;

export interface NormalCallback<TResponse> {
  (err: grpc.ServiceError | null, res?: TResponse | null): void;
}

export interface PagedCallback<Item, Response> {
  (
    err: grpc.ServiceError | null,
    results?: Item[] | null,
    nextQuery?: {} | null,
    response?: Response | null
  ): void;
}

export interface LongRunningCallback<Resource> {
  (
    err: grpc.ServiceError | null,
    resource?: Resource | null,
    operation?: GaxOperation | null,
    apiResponse?: IOperation
  ): void;
}

export interface PagedOptions {
  pageSize?: number;
  pageToken?: string;
  gaxOptions?: CallOptions;
}

export interface PagedOptionsWithFilter extends PagedOptions {
  filter?: string;
}

/*!
 * HTTP header for the resource prefix to improve routing
 * by the backend.
 */
export const CLOUD_RESOURCE_HEADER = 'google-cloud-resource-prefix';

/*!
 * HTTP header to route the requests at Leader
 */
export const LEADER_AWARE_ROUTING_HEADER = 'x-goog-spanner-route-to-leader';

/**
 * Add Leader aware routing header to existing header list.
 * @param headers Existing header list.
 */
export function addLeaderAwareRoutingHeader(headers: {[k: string]: string}) {
  headers[LEADER_AWARE_ROUTING_HEADER] = 'true';
}

/*!
 * Timeout value for long-running transactions in milliseconds.
 */
let LONG_RUNNING_TRANSACTION_THRESHOLD: number = 1000 * 60 * 60;

/**
 * Set timeout in milliseconds for long-running transactions.
 * @param {number} [timeout] Timeout for Long Running Transactions.
 */
export function _setLongRunningTransactionThreshold(timeout: number) {
  LONG_RUNNING_TRANSACTION_THRESHOLD = timeout;
}

/**
 * Get timeout for long-running transactions in milliseconds.
 */
export function getLongRunningTransactionThreshold() {
  return LONG_RUNNING_TRANSACTION_THRESHOLD;
}

/*!
 * period after which background cleanup task runs in milliseconds.
 */
let LONG_RUNNING_BACKGROUND_TASK_TIMER: number = 1000 * 60 * 2;

/**
 * Set timer in milliseconds for long-running transactions background task.
 * @param {number} [timeout] Timeout for Long Running Transactions.
 */
export function _setLongRunningBackgroundTaskTimer(timeout: number) {
  LONG_RUNNING_BACKGROUND_TASK_TIMER = timeout;
}

/**
 * Get timer in milliseconds for long-running transactions background task.
 */
export function getLongRunningBackgroundTaskTimer() {
  return LONG_RUNNING_BACKGROUND_TASK_TIMER;
}

/*!
 * Timeout value in millisecond for cleanup of sessions
 */
export const SESSION_CLEANUP_TIMEOUT: number = 1000 * 60 * 60;

/**
 * Error message thrown when transaction running longer than expected thresholds is recycled.
 */
export const LONG_RUNNING_TRANSACTION_ERROR_MESSAGE =
  'Transaction has been closed as it was running for more than expected thresholds. ' +
  'If transaction is expected to run long, run as batch or partitioned DML';
