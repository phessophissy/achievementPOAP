;; achievement-poap.clar
;; POAP (Proof of Attendance Protocol) NFT Contract for Stacks
;; Minting fee: 0.025 STX

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_ALREADY_MINTED (err u101))
(define-constant ERR_EVENT_NOT_FOUND (err u102))
(define-constant ERR_EVENT_EXPIRED (err u103))
(define-constant ERR_INSUFFICIENT_FUNDS (err u104))
(define-constant ERR_MINT_FAILED (err u105))
(define-constant ERR_EVENT_NOT_ACTIVE (err u106))
(define-constant ERR_INVALID_URI (err u107))

;; Minting fee in microSTX (0.025 STX = 25000 microSTX)
(define-constant MINT_FEE u25000)

;; Data Variables
(define-data-var token-id-nonce uint u0)
(define-data-var event-id-nonce uint u0)
(define-data-var contract-paused bool false)

;; NFT Definition
(define-non-fungible-token achievement-poap uint)

;; Data Maps
(define-map events
    uint
    {
        name: (string-ascii 64),
        description: (string-ascii 256),
        creator: principal,
        max-supply: uint,
        current-supply: uint,
        start-block: uint,
        end-block: uint,
        metadata-uri: (string-ascii 256),
        active: bool
    }
)

(define-map token-event
    uint
    uint
)

(define-map token-metadata
    uint
    {
        event-id: uint,
        minted-at: uint,
        minter: principal
    }
)

(define-map event-minters
    { event-id: uint, minter: principal }
    bool
)

(define-map user-tokens
    principal
    (list 100 uint)
)

;; Read-only functions

(define-read-only (get-last-token-id)
    (ok (var-get token-id-nonce))
)

(define-read-only (get-token-uri (token-id uint))
    (let ((event-id (unwrap! (map-get? token-event token-id) (ok none))))
        (let ((event (unwrap! (map-get? events event-id) (ok none))))
            (ok (some (get metadata-uri event)))
        )
    )
)

(define-read-only (get-owner (token-id uint))
    (ok (nft-get-owner? achievement-poap token-id))
)

(define-read-only (get-event (event-id uint))
    (map-get? events event-id)
)

(define-read-only (get-token-metadata (token-id uint))
    (map-get? token-metadata token-id)
)

(define-read-only (has-minted-event (event-id uint) (user principal))
    (default-to false (map-get? event-minters { event-id: event-id, minter: user }))
)

(define-read-only (get-user-tokens (user principal))
    (default-to (list) (map-get? user-tokens user))
)

(define-read-only (get-mint-fee)
    (ok MINT_FEE)
)

(define-read-only (get-event-supply (event-id uint))
    (let ((event (unwrap! (map-get? events event-id) ERR_EVENT_NOT_FOUND)))
        (ok { current: (get current-supply event), max: (get max-supply event) })
    )
)

(define-read-only (is-contract-paused)
    (ok (var-get contract-paused))
)

;; Private functions

(define-private (is-event-active (event-id uint))
    (let ((event (unwrap! (map-get? events event-id) false)))
        (and
            (get active event)
            (>= block-height (get start-block event))
            (<= block-height (get end-block event))
            (< (get current-supply event) (get max-supply event))
        )
    )
)

(define-private (add-token-to-user (user principal) (token-id uint))
    (let ((current-tokens (default-to (list) (map-get? user-tokens user))))
        (let ((new-list (unwrap-panic (as-max-len? (append current-tokens token-id) u100))))
            (map-set user-tokens user new-list)
        )
    )
)

;; Public functions

;; Create a new POAP event
(define-public (create-event 
    (name (string-ascii 64))
    (description (string-ascii 256))
    (max-supply uint)
    (start-block uint)
    (end-block uint)
    (metadata-uri (string-ascii 256))
)
    (let ((event-id (+ (var-get event-id-nonce) u1)))
        (asserts! (> (len metadata-uri) u0) ERR_INVALID_URI)
        (asserts! (> end-block start-block) ERR_EVENT_EXPIRED)
        
        (map-set events event-id {
            name: name,
            description: description,
            creator: tx-sender,
            max-supply: max-supply,
            current-supply: u0,
            start-block: start-block,
            end-block: end-block,
            metadata-uri: metadata-uri,
            active: true
        })
        
        (var-set event-id-nonce event-id)
        (ok event-id)
    )
)

;; Mint a POAP for an event
(define-public (mint-poap (event-id uint))
    (let (
        (event (unwrap! (map-get? events event-id) ERR_EVENT_NOT_FOUND))
        (token-id (+ (var-get token-id-nonce) u1))
    )
        ;; Check contract is not paused
        (asserts! (not (var-get contract-paused)) ERR_NOT_AUTHORIZED)
        
        ;; Check event is active
        (asserts! (is-event-active event-id) ERR_EVENT_NOT_ACTIVE)
        
        ;; Check user hasn't already minted this event
        (asserts! (not (has-minted-event event-id tx-sender)) ERR_ALREADY_MINTED)
        
        ;; Transfer mint fee directly to contract owner
        (try! (stx-transfer? MINT_FEE tx-sender CONTRACT_OWNER))
        
        ;; Mint the NFT
        (try! (nft-mint? achievement-poap token-id tx-sender))
        
        ;; Update mappings
        (map-set token-event token-id event-id)
        (map-set token-metadata token-id {
            event-id: event-id,
            minted-at: block-height,
            minter: tx-sender
        })
        (map-set event-minters { event-id: event-id, minter: tx-sender } true)
        
        ;; Update event supply
        (map-set events event-id (merge event { current-supply: (+ (get current-supply event) u1) }))
        
        ;; Add token to user's collection
        (add-token-to-user tx-sender token-id)
        
        ;; Update nonce
        (var-set token-id-nonce token-id)
        
        (ok token-id)
    )
)

;; Transfer POAP
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender sender) ERR_NOT_AUTHORIZED)
        (try! (nft-transfer? achievement-poap token-id sender recipient))
        (ok true)
    )
)

;; Admin functions

(define-public (pause-contract)
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
        (var-set contract-paused true)
        (ok true)
    )
)

(define-public (unpause-contract)
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
        (var-set contract-paused false)
        (ok true)
    )
)

(define-public (deactivate-event (event-id uint))
    (let ((event (unwrap! (map-get? events event-id) ERR_EVENT_NOT_FOUND)))
        (asserts! (or (is-eq tx-sender CONTRACT_OWNER) (is-eq tx-sender (get creator event))) ERR_NOT_AUTHORIZED)
        (map-set events event-id (merge event { active: false }))
        (ok true)
    )
)
