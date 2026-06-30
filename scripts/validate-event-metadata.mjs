#!/usr/bin/env node

/**
 * Validate POAP event metadata files in frontend/public/metadata/events/.
 *
 * Rules (see docs/event-metadata-schema.md):
 *  - file name matches ^<event-id>.json$ (positive integer)
 *  - external_url ends with /events/<event-id>
 *  - name and description are non-empty trimmed strings
 *  - image starts with https:// or ipfs://
 *  - each attribute has non-empty trait_type and value strings
 *
 * Exits with code 1 if any file is invalid.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const EVENTS_DIR = join(process.cwd(), 'frontend', 'public', 'metadata', 'events');
const FILE_RE = /^(\d+)\.json$/;

let failures = 0;
let checked = 0;

function fail(file, reason) {
  console.error(`✗ ${file}: ${reason}`);
  failures += 1;
}

try {
  const files = readdirSync(EVENTS_DIR).filter((f) => f.endsWith('.json'));

  if (files.length === 0) {
    console.warn('No event metadata files found in', EVENTS_DIR);
  }

  for (const file of files) {
    checked += 1;
    const match = file.match(FILE_RE);
    if (!match) {
      fail(file, 'file name must be a positive integer id (e.g. 20.json)');
      continue;
    }
    const eventId = match[1];

    let data;
    try {
      data = JSON.parse(readFileSync(join(EVENTS_DIR, file), 'utf8'));
    } catch (err) {
      fail(file, `invalid JSON: ${err.message}`);
      continue;
    }

    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      fail(file, 'top-level value must be a JSON object');
      continue;
    }

    if (typeof data.name !== 'string' || data.name.trim() === '') {
      fail(file, 'name must be a non-empty string');
    }

    if (typeof data.description !== 'string' || data.description.trim() === '') {
      fail(file, 'description must be a non-empty string');
    }

    if (typeof data.image !== 'string' || !/^(https:\/\/|ipfs:\/\/)/.test(data.image)) {
      fail(file, 'image must start with https:// or ipfs://');
    }

    if (typeof data.external_url !== 'string') {
      fail(file, 'external_url must be a string');
    } else if (!data.external_url.endsWith(`/events/${eventId}`)) {
      fail(file, `external_url must end with /events/${eventId}`);
    }

    if (data.attributes !== undefined) {
      if (!Array.isArray(data.attributes)) {
        fail(file, 'attributes must be an array');
      } else {
        data.attributes.forEach((attr, i) => {
          if (
            typeof attr !== 'object' || attr === null ||
            typeof attr.trait_type !== 'string' || attr.trait_type.trim() === '' ||
            typeof attr.value !== 'string' || attr.value.trim() === ''
          ) {
            fail(file, `attributes[${i}] must have non-empty trait_type and value strings`);
          }
        });
      }
    }
  }
} catch (err) {
  console.error(`Could not read events directory (${EVENTS_DIR}): ${err.message}`);
  process.exit(1);
}

if (failures > 0) {
  console.error(`\n${failures} validation error(s) across ${checked} file(s).`);
  process.exit(1);
}

console.log(`Event metadata validation passed (${checked} file(s) checked).`);
