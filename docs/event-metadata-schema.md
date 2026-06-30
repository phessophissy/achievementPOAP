# POAP Event Metadata Schema

POAP event metadata files live in `frontend/public/metadata/events/<event-id>.json`
and are referenced on-chain via the event's `metadata-uri`. They follow a subset of
the OpenSea / NFT metadata standard adapted for Achievement POAP.

## Required fields

| Field          | Type   | Description                                  |
|----------------|--------|----------------------------------------------|
| `name`         | string | Display name of the event (non-empty)        |
| `description`  | string | Short description of the event               |
| `image`        | string | URL to the event artwork (https or ipfs)     |
| `external_url` | string | Canonical URL for the event page             |

## Optional fields

| Field        | Type    | Description                                                      |
|--------------|---------|------------------------------------------------------------------|
| `attributes` | array   | List of `{ "trait_type": string, "value": string }` objects      |

## Validation rules

1. The file name **must** match `^<event-id>\.json$` where `<event-id>` is a positive integer.
2. `external_url` **must** end with `/events/<event-id>` so the link matches the file id.
3. `name` and `description` **must** be non-empty after trimming.
4. `image` **must** start with `https://` or `ipfs://`.
5. Each entry in `attributes` **must** have both `trait_type` and `value` as non-empty strings.

## Example

```json
{
  "name": "Colathon",
  "description": "Build event for builders in Columbia and the rest of the world",
  "image": "https://achievement-poap.vercel.app/favicon.svg",
  "attributes": [
    { "trait_type": "Event Type", "value": "Hackathon" },
    { "trait_type": "Location", "value": "Columbia & Global" }
  ],
  "external_url": "https://achievement-poap.vercel.app/events/20"
}
```

## Validation

Run the validator before opening a PR that touches event metadata:

```bash
npm run validate:metadata
```
