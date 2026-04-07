const https = require('https');
const wallets1 = require('../wallets.json').wallets;
const wallets2 = require('../wallets-set-2.json').wallets;

async function checkTx(txid) {
  return new Promise((resolve) => {
    const url = 'https://api.mainnet.hiro.so/extended/v1/tx/0x' + txid;
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve({tx_status:'parse_error'}); }
      });
    }).on('error', () => resolve({tx_status:'network_error'}));
  });
}

async function checkSet(label, wallets) {
  let success = 0, aborted = 0, pending = 0, other = 0;
  
  for (const w of wallets) {
    let txid = w.mint_txid;
    if (!txid && w.minted_by_event) {
      const vals = Object.values(w.minted_by_event);
      for (const v of vals) {
        if (typeof v === 'string' && v.length === 64) { txid = v; break; }
      }
    }
    if (!txid) continue;
    
    const tx = await checkTx(txid);
    const status = tx.tx_status;
    if (status === 'success') {
      success++;
    } else if (status && status.startsWith('abort')) {
      aborted++;
      console.log('  ABORTED - Wallet', w.index, ':', txid, '-', (tx.tx_result && tx.tx_result.repr) || '');
    } else if (status === 'pending') {
      pending++;
      console.log('  PENDING - Wallet', w.index, ':', txid);
    } else {
      other++;
      console.log('  OTHER(' + status + ') - Wallet', w.index);
    }
  }
  
  console.log('\n  --- ' + label + ' SUMMARY ---');
  console.log('  Success:', success);
  console.log('  Aborted:', aborted);
  console.log('  Pending:', pending);
  console.log('  Other/Error:', other);
  console.log();
}

(async () => {
  console.log('=== SET 1 TXs ===');
  const set1WithTx = wallets1.filter(w => w.mint_txid);
  await checkSet('SET 1', set1WithTx);

  console.log('=== SET 2 TXs (first 15 sample) ===');
  const set2WithTx = wallets2.filter(w => {
    if (w.mint_txid) return true;
    if (w.minted_by_event) {
      return Object.values(w.minted_by_event).some(v => typeof v === 'string' && v.length === 64);
    }
    return false;
  });
  await checkSet('SET 2 (sample)', set2WithTx.slice(0, 15));
})();
