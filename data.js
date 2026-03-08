// ===================== CONSTANTS =====================
var VERSION = 'martjn_db v1.0';
var HEX_CHARS = '0123456789abcdef';
var UPTIME_START = '1980-07-' + String(Math.floor(Math.random() * 31) + 1).replace(/^(\d)$/, '0$1');

// ===================== TABLE SCHEMA =====================
var TABLE_SCHEMA = {
  profile: 'public', skills: 'public', tools: 'public',
  dive_log: 'diving', dive_certs: 'diving', dive_stats: 'diving',
  blocks: 'blockchain', transactions: 'blockchain', addresses: 'blockchain', mempool: 'blockchain'
};

// ===================== DYNAMIC HELPERS =====================
var HALVING_REF = { height: 840000, time: new Date('2024-04-20T00:09:27Z').getTime() };
var BLOCK_INTERVAL = 600000; // 10 min in ms
var PAGE_LOAD = Date.now();

function currentBlockHeight() {
  return HALVING_REF.height + Math.floor((Date.now() - HALVING_REF.time) / BLOCK_INTERVAL);
}

function blockTimestamp(height) {
  var ms = HALVING_REF.time + (height - HALVING_REF.height) * BLOCK_INTERVAL;
  return new Date(ms).toISOString().replace('T', ' ').slice(0, 19);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function randomHex(n) {
  var h = '';
  for (var i = 0; i < n; i++) h += HEX_CHARS[Math.floor(Math.random() * 16)];
  return h;
}

function randomHash() {
  return '00000000000000000' + randomHex(5) + '..' + randomHex(3);
}

function randomTxid() {
  return randomHex(8) + '..' + randomHex(4);
}

var MINERS = ['Foundry USA', 'AntPool', 'F2Pool', 'ViaBTC', 'Binance Pool', 'MARA Pool', 'Braiins'];

var NOW_HEIGHT = currentBlockHeight();
var NOW_TS = blockTimestamp(NOW_HEIGHT);
var RECENT_1 = NOW_HEIGHT - Math.floor(Math.random() * 50 + 10);
var RECENT_2 = NOW_HEIGHT - Math.floor(Math.random() * 200 + 60);
var RECENT_3 = NOW_HEIGHT - Math.floor(Math.random() * 1000 + 300);

// ===================== TABLES =====================
var TABLES = {
  profile: {
    columns: ['key', 'value'],
    types: ['varchar', 'varchar'],
    rows: [
      ['name', 'Martin'],
      ['mail', '__IMG__'],
      ['role', 'Data & Crypto Enthusiast · Diver'],
      ['location', 'Germany'],
      ['website', 'https://martjn.net'],
      ['uptime', UPTIME_START],
      ['motto', 'Making data flow — from raw events to actionable insights.'],
    ]
  },
  skills: {
    columns: ['skill', 'category'],
    types: ['varchar', 'varchar'],
    rows: [
      ['Python',     'language'],
      ['SQL',        'language'],
      ['Bash',       'language'],
      ['JavaScript', 'language'],
      ['BigQuery',   'database'],
      ['PostgreSQL', 'database'],
      ['MySQL',      'database'],
      ['GCP',        'cloud'],
      ['Docker',     'cloud'],
      ['Linux',      'infra'],
      ['Git',        'tool'],
      ['REST APIs',  'tool'],
      ['ETL',        'concept'],
      ['Crypto',     'interest'],
      ['Diving',     'interest'],
    ]
  },
  tools: {
    columns: ['name', 'category', 'version'],
    types: ['varchar', 'varchar', 'varchar'],
    rows: [
      ['python3',    'runtime',  '3.12.3'],
      ['pip',        'package',  '24.0'],
      ['bq',         'cli',      '2.1.4'],
      ['gcloud',     'cli',      '472.0'],
      ['sql-cli',    'client',   '1.0.0'],
      ['psql',       'client',   '16.2'],
      ['mysql',      'client',   '8.0.37'],
      ['docker',     'container','26.1.3'],
      ['git',        'vcs',      '2.45.1'],
      ['curl',       'network',  '8.7.1'],
      ['jq',         'util',     '1.7.1'],
      ['tmux',       'terminal', '3.4'],
      ['vim',        'editor',   '9.1'],
    ]
  },
  dive_log: {
    columns: ['dive_no', 'date', 'type', 'site', 'location', 'max_depth_m', 'duration', 'water_temp_c', 'visibility_m', 'buddy', 'notes'],
    types: ['int', 'varchar', 'varchar', 'varchar', 'varchar', 'float', 'varchar', 'float', 'int', 'varchar', 'text'],
    rows: [
      [1,   '2021-06-15', 'scuba',  'Fühlinger See',       'Köln, DE',         8.2,  '42 min',   18.0,  4,  'Jens',      'First open water dive after DTSA*'],
      [2,   '2021-06-15', 'scuba',  'Fühlinger See',       'Köln, DE',        10.5,  '38 min',   17.5,  4,  'Jens',      'Compass navigation practice'],
      [3,   '2021-09-20', 'free',   'Pool',                'Düsseldorf, DE',   2.0,  '1:30 min',  28.0, 25,  'Solo',      'First STA training, breathing technique'],
      [4,   '2021-11-08', 'free',   'Pool',                'Düsseldorf, DE',   3.0,  '1:55 min',  27.0, 25,  'Solo',      'STA progress, relaxation improving'],
      [5,   '2022-02-10', 'free',   'Pool',                'Düsseldorf, DE',   3.5,  '2:15 min',  28.0, 25,  'Solo',      'STA new PB, contractions from 1:50'],
      [6,   '2022-06-22', 'scuba',  'Blauer See',          'Ratingen, DE',    15.0,  '45 min',   14.0,  5,  'Jens',      'Explored old concrete structures on bottom'],
      [7,   '2022-07-14', 'free',   'Banana Beach',        'Zakynthos, GR',   10.0,  '1:35 min',  25.0, 20,  'Solo',      'CWT first Frenzel attempts in open water'],
      [8,   '2022-07-15', 'scuba',  'Zakynthos Caves',     'Zakynthos, GR',   18.0,  '48 min',   22.0, 30,  'Nikos',     'Sea turtles inside the cave!'],
      [9,   '2022-07-16', 'free',   'Banana Beach',        'Zakynthos, GR',   14.5,  '1:48 min',  25.0, 22,  'Solo',      'CWT Frenzel working down to 14m'],
      [10,  '2023-03-12', 'free',   'Pool',                'Düsseldorf, DE',   3.5,  '65 m DYN',  27.0, 25,  'Solo',      'DYN with fins, improved streamline'],
      [11,  '2023-05-30', 'scuba',  'Sundhäuser See',      'Nordhausen, DE',  18.0,  '44 min',   10.0,  6,  'Alex',      'Underwater park with sunken objects'],
      [12,  '2023-08-14', 'free',   'Krk Island',          'Krk, HR',         18.3,  '1:52 min',  24.0, 25,  'Marco',     'CWT along the cliff, clean Frenzel'],
      [13,  '2023-08-15', 'free',   'Krk Island',          'Krk, HR',         21.0,  '2:00 min',  24.0, 25,  'Marco',     'New depth PB, mouthfill from 15m'],
      [14,  '2023-08-16', 'scuba',  'Plavnik Wall',        'Krk, HR',         20.0,  '50 min',   18.0, 20,  'Marco',     'Wall dive, spotted eagle ray'],
      [15,  '2024-01-15', 'free',   'Pool',                'Düsseldorf, DE',   3.5,  '3:02 min',  27.0, 25,  'Solo',      'STA new PB 3:02, contractions from 2:20'],
      [16,  '2024-04-22', 'free',   'Pool',                'Düsseldorf, DE',   3.5,  '82 m DYN',  27.0, 25,  'Solo',      'DYN PB, found the right kick rhythm'],
      [17,  '2024-06-18', 'free',   'Lago di Garda',       'Gardasee, IT',    24.0,  '2:10 min',  22.0, 15,  'Marco',     'FIM training, clean mouthfill from 18m'],
      [18,  '2024-06-19', 'free',   'Lago di Garda',       'Gardasee, IT',    26.5,  '2:18 min',  21.0, 15,  'Marco',     'CWT new PB! Enjoyed freefall from 20m'],
      [19,  '2025-03-25', 'free',   'Pool',                'Düsseldorf, DE',   3.5,  '90 m DYN',  27.0, 25,  'Solo',      'DYN new PB, passed AIDA3 exam'],
      [20,  '2025-07-10', 'scuba',  'Ras Mohammed',        'Sharm el-Sheikh, EG', 18.0, '52 min', 28.0, 35, 'Ahmed',     'Shark Reef, incredible visibility'],
      [21,  '2025-07-12', 'free',   'Blue Hole',           'Dahab, EG',       28.0,  '2:25 min',  26.0, 40,  'Solo',      'CWT new PB 28m, saw The Arch from above'],
      [22,  '2025-07-13', 'free',   'Blue Hole',           'Dahab, EG',       25.0,  '2:15 min',  26.0, 40,  'Solo',      'FIM relaxation dive, dolphins!'],
      [23,  '2025-08-08', 'free',   'Kornati Islands',     'Murter, HR',      27.0,  '2:20 min',  24.0, 30,  'Marco',     'CWT between the islands, octopus at 15m'],
      [24,  '2025-08-09', 'scuba',  'Kornati Wreck',       'Murter, HR',      16.0,  '55 min',   20.0, 18,  'Marco',     'Small fishing wreck, relaxed dive'],
      [25,  '2025-11-14', 'free',   'Pool',                'Düsseldorf, DE',   3.5,  '3:15 min',  27.0, 25,  'Solo',      'STA new PB 3:15! Mental calm was the key'],
      [26,  '2026-02-22', 'free',   'Pool',                'Düsseldorf, DE',   4.0,  '95 m DYN',  27.0, 25,  'Solo',      'Pool training, DYN new PB, 100m within reach'],
    ]
  },
  dive_certs: {
    columns: ['cert', 'org', 'type', 'date', 'dives_at_cert'],
    types: ['varchar', 'varchar', 'varchar', 'varchar', 'int'],
    rows: [
      ['Grundtauchschein',  'VDST',  'scuba',  '2021-04-20',  0],
      ['DTSA*',             'VDST',  'scuba',  '2021-06-15',  2],
      ['AIDA*',             'AIDA',  'free',   '2022-03-01',  5],
      ['AIDA**',            'AIDA',  'free',   '2023-08-15', 13],
      ['AIDA***',           'AIDA',  'free',   '2025-03-25', 19],
    ]
  },
  dive_stats: {
    columns: ['metric', 'value'],
    types: ['varchar', 'varchar'],
    get rows() {
      var log = TABLES.dive_log.rows;
      var scuba = log.filter(function(r) { return r[2] === 'scuba'; });
      var free = log.filter(function(r) { return r[2] === 'free'; });

      var maxDepthScuba = Math.max.apply(null, scuba.map(function(r) { return r[5]; }));
      var maxDepthFree = Math.max.apply(null, free.map(function(r) { return r[5]; }));

      var scubaTimes = scuba.map(function(r) { return parseInt(r[6]); }).filter(function(v) { return !isNaN(v); });
      var maxBottomTime = Math.max.apply(null, scubaTimes);

      var breathHolds = free.filter(function(r) { return r[6].indexOf(':') !== -1; })
        .map(function(r) { var p = r[6].split(':'); return parseInt(p[0]) * 60 + parseInt(p[1]); });
      var maxBH = Math.max.apply(null, breathHolds);
      var bhMin = Math.floor(maxBH / 60);
      var bhSec = maxBH % 60;

      var dynDists = free.filter(function(r) { return r[6].indexOf('DYN') !== -1; })
        .map(function(r) { return parseInt(r[6]); });
      var maxDyn = dynDists.length ? Math.max.apply(null, dynDists) : 0;

      var countries = {};
      log.forEach(function(r) {
        var parts = r[4].split(', ');
        if (parts.length > 1) countries[parts[parts.length - 1]] = true;
      });
      var countryList = Object.keys(countries).sort();

      var certs = TABLES.dive_certs.rows;
      var scubaCert = certs.filter(function(r) { return r[2] === 'scuba'; }).pop();
      var freeCert = certs.filter(function(r) { return r[2] === 'free'; }).pop();
      var certStr = (scubaCert ? scubaCert[0] : '') + ' / ' + (freeCert ? freeCert[0] : '');

      var firstYear = log[0] ? log[0][1].slice(0, 4) : '?';

      return [
        ['Total Dives',         String(log.length)],
        ['Scuba Dives',         String(scuba.length)],
        ['Freedives',           String(free.length)],
        ['Max Depth (Scuba)',   maxDepthScuba.toFixed(1) + ' m'],
        ['Max Depth (Free)',    maxDepthFree.toFixed(1) + ' m'],
        ['Max Bottom Time',     maxBottomTime + ' min'],
        ['Max Breath Hold',     bhMin + ':' + (bhSec < 10 ? '0' : '') + bhSec + ' min'],
        ['Max DYN',             maxDyn + ' m'],
        ['Countries',           countryList.length + ' (' + countryList.join(', ') + ')'],
        ['Certification',       certStr],
        ['Diving Since',        firstYear],
      ];
    }
  },
  blocks: {
    columns: ['height', 'hash', 'timestamp', 'tx_count', 'size', 'miner', 'reward_btc'],
    types: ['int', 'varchar', 'varchar', 'int', 'int', 'varchar', 'float'],
    rows: [
      [0,      '000000000019d668..ae26f', '2009-01-03 18:15:05', 1,    285,     'Satoshi',      50.0],
      [170000, '0000000000000003..b84cf', '2012-02-14 09:23:17', 245,  215234,  'SlushPool',    50.0],
      [210000, '000000000000048b..2a16d', '2012-11-28 15:24:38', 1322, 498632,  'BTCGuild',     25.0],
      [420000, '000000000000000002..f4e8', '2016-07-09 16:46:13', 1837, 998412,  'F2Pool',       12.5],
      [630000, '0000000000000000000f..3a1', '2020-05-11 19:23:43', 2733, 1186420, 'AntPool',      6.25],
      [788000, '00000000000000000001..c7f', '2023-05-01 08:12:55', 3842, 1543210, 'Foundry USA',  6.25],
      [800000, '00000000000000000002..d9a', '2023-07-24 09:34:22', 4105, 1621340, 'AntPool',      6.25],
      [830000, '00000000000000000003..e2b', '2024-01-15 14:08:11', 3654, 1578900, 'ViaBTC',       6.25],
      [840000, '00000000000000000001..f5c', '2024-04-20 00:09:27', 3950, 1598432, 'Foundry USA',  3.125],
      [860000, '00000000000000000002..a8d', '2024-09-12 11:45:33', 4210, 1645120, 'F2Pool',       3.125],
      [RECENT_3, randomHash(), blockTimestamp(RECENT_3), 3800 + Math.floor(Math.random()*800), 1500000 + Math.floor(Math.random()*200000), MINERS[Math.floor(Math.random()*MINERS.length)], 3.125],
      [RECENT_2, randomHash(), blockTimestamp(RECENT_2), 3800 + Math.floor(Math.random()*800), 1500000 + Math.floor(Math.random()*200000), MINERS[Math.floor(Math.random()*MINERS.length)], 3.125],
      [RECENT_1, randomHash(), blockTimestamp(RECENT_1), 3800 + Math.floor(Math.random()*800), 1500000 + Math.floor(Math.random()*200000), MINERS[Math.floor(Math.random()*MINERS.length)], 3.125],
      [NOW_HEIGHT, randomHash(), NOW_TS, 3800 + Math.floor(Math.random()*800), 1500000 + Math.floor(Math.random()*200000), MINERS[Math.floor(Math.random()*MINERS.length)], 3.125],
    ]
  },
  transactions: {
    columns: ['txid', 'block_height', 'timestamp', 'from_addr', 'to_addr', 'value_btc', 'fee_sat', 'type'],
    types: ['varchar', 'int', 'varchar', 'varchar', 'varchar', 'float', 'int', 'varchar'],
    rows: [
      ['4a5e1e4b..da33b', 0,      '2009-01-03 18:15:05', 'coinbase',                    '1A1zP1..DivfNa', 50.0,      0,     'coinbase'],
      ['a1075db5..f5d48d', 57043,  '2010-05-22 18:16:31', '1XPTgD..RCeas5',             '17SkEw..QVCvAE', 10000.0,   0,     'transfer'],
      ['f4184fc5..30e0', 170,     '2009-01-12 03:30:25', '12cbQL..GoUAhE',              '1Q2TW..iqz3T',  10.0,      0,     'transfer'],
      ['e3b0c442..48f8', 788000,  '2023-05-01 08:15:22', 'bc1qxy..w4nz0s',              'bc1q9h..m42sfk', 0.5,       4200,  'transfer'],
      ['7d2b5c89..a3f1', 800000,  '2023-07-24 09:40:11', '3J98t1..hWNLy',               'bc1qw5..v8f3t4', 2.35,      3150,  'transfer'],
      ['b8c1d4e2..f5a7', 830000,  '2024-01-15 14:12:33', 'bc1qm3..x7k2p',              '1BoatS..gSbv5Y', 150.0,     8400,  'transfer'],
      ['c9d2e5f3..b8c4', 840000,  '2024-04-20 00:15:44', '14qViL..Bd2Yz9',              'bc1qcr..9nh3qa', 0.025,     2100,  'transfer'],
      ['d1e3f6a4..c9d5', 860000,  '2024-09-12 11:50:18', 'bc1qfn..kp8m3j',              '3QJmV3..S8DP2p', 42.0,      5600,  'transfer'],
      ['e2f4a7b5..d1e6', 860000,  '2024-09-12 12:05:22', 'bc1q7c..qn4w2z',              'bc1qxy..w4nz0s', 1500.0,    12500, 'whale'],
      [randomTxid(), RECENT_3, blockTimestamp(RECENT_3), '1NDyJt..LPhpTq',              'bc1qd7..j5v2xk', 0.001,     1050,  'transfer'],
      [randomTxid(), RECENT_3, blockTimestamp(RECENT_3), 'bc1qgl..pm9f4r',              '3FZbgi..LPGe4c', 8900.0,    28000, 'whale'],
      [randomTxid(), RECENT_1, blockTimestamp(RECENT_1), 'bc1qh8..sw5n6t',              'bc1q9h..m42sfk', 0.15,      1800,  'transfer'],
      [randomTxid(), NOW_HEIGHT, NOW_TS, '3J98t1..hWNLy',               'bc1qxy..w4nz0s', 3200.0,    35000, 'whale'],
    ]
  },
  addresses: {
    columns: ['address', 'label', 'balance_btc', 'tx_count', 'first_seen', 'last_seen'],
    types: ['varchar', 'varchar', 'float', 'int', 'varchar', 'varchar'],
    rows: [
      ['1A1zP1..DivfNa', 'Satoshi (Genesis)',  72.83,     3542,  '2009-01-03', todayStr()],
      ['bc1qxy..w4nz0s', 'Binance Cold',       248935.5,  89432, '2019-07-08', todayStr()],
      ['bc1q9h..m42sfk', 'Bitfinex Hot',        45210.2,  34521, '2017-11-02', todayStr()],
      ['3J98t1..hWNLy',  'Unknown Whale #1',    31200.8,  1205,  '2018-03-15', todayStr()],
      ['bc1qgl..pm9f4r', 'Unknown Whale #2',    22450.0,  312,   '2020-08-22', todayStr()],
      ['14qViL..Bd2Yz9', 'Mt.Gox Trustee',      0.0,      4521,  '2011-06-19', '2024-07-05'],
      ['1BoatS..gSbv5Y', 'Satoshi Dice',         0.001,   98234, '2012-04-17', '2024-01-15'],
      ['1NDyJt..LPhpTq', 'Faucet',              0.042,    65432, '2010-06-11', todayStr()],
      ['bc1qfn..kp8m3j', 'Kraken Hot',          18750.3,  54210, '2018-09-30', todayStr()],
      ['bc1qw5..v8f3t4', 'Coinbase Custody',    95320.1,  72100, '2018-01-15', todayStr()],
      ['3FZbgi..LPGe4c', 'Grayscale GBTC',     186230.0,  2340,  '2019-01-28', todayStr()],
      ['bc1qd7..j5v2xk', 'Individual',           1.25,    47,    '2023-06-01', todayStr()],
    ]
  },
  mempool: {
    columns: ['txid', 'from_addr', 'to_addr', 'value_btc', 'fee_sat', 'size_bytes', 'waiting_sec'],
    types: ['varchar', 'varchar', 'varchar', 'float', 'int', 'int', 'int'],
    _baseWait: [12, 45, 120, 8, 340],
    get rows() {
      var elapsed = Math.floor((Date.now() - PAGE_LOAD) / 1000);
      return [
        [randomTxid(), 'bc1qr5..mt7x2k', 'bc1qxy..w4nz0s', 0.75,    3200,  225,  this._baseWait[0] + elapsed],
        [randomTxid(), '3QJmV3..S8DP2p', 'bc1q9h..m42sfk', 5.0,     8500,  380,  this._baseWait[1] + elapsed],
        [randomTxid(), 'bc1qh8..sw5n6t', '1NDyJt..LPhpTq', 0.003,   1050,  142,  this._baseWait[2] + elapsed],
        [randomTxid(), 'bc1qfn..kp8m3j', '3J98t1..hWNLy',  250.0,   18000, 520,  this._baseWait[3] + elapsed],
        [randomTxid(), 'bc1qgl..pm9f4r', 'bc1qd7..j5v2xk', 0.1,     1500,  190,  this._baseWait[4] + elapsed],
      ];
    }
  }
};

// ===================== SUGGESTIONS =====================
var SUGGESTIONS = {
  profile: [
    { label: 'About me',       query: 'SELECT * FROM profile;',               cat: 'data' },
    { label: 'Skills',         query: 'SELECT * FROM skills;',                cat: 'data' },
    { label: 'EXPLAIN me',     query: 'EXPLAIN SELECT * FROM martjn;',        cat: 'fun' },
    { label: 'Uptime',         query: 'SELECT DATEDIFF(NOW(), uptime) AS uptime FROM profile;', cat: 'fun' },
  ],
  bitcoin: [
    { label: 'Latest Blocks',        query: 'SELECT height, timestamp, tx_count, miner, reward_btc FROM blocks ORDER BY height DESC LIMIT 5;', cat: 'btc' },
    { label: 'Halving History',       query: "SELECT height, timestamp, reward_btc FROM blocks WHERE height IN (0, 210000, 420000, 630000, 840000) ORDER BY height;", cat: 'btc' },
    { label: 'Miner Stats',           query: 'SELECT miner, COUNT(*) as count, ROUND(AVG(tx_count)) as avg_tx FROM blocks GROUP BY miner ORDER BY count DESC;', cat: 'btc' },
    { label: 'Whale Transactions',    query: "SELECT txid, timestamp, from_addr, to_addr, value_btc FROM transactions WHERE type = 'whale' ORDER BY value_btc DESC;", cat: 'btc' },
    { label: 'Top Addresses',         query: 'SELECT address, label, balance_btc FROM addresses ORDER BY balance_btc DESC LIMIT 5;', cat: 'btc' },
    { label: 'Satoshi Address',       query: "SELECT * FROM addresses WHERE label = 'Satoshi (Genesis)';", cat: 'btc' },
    { label: 'Pizza TX',              query: "SELECT * FROM transactions WHERE txid = 'a1075db5..f5d48d';", cat: 'btc' },
    { label: 'Mempool',               query: 'SELECT txid, value_btc, fee_sat, waiting_sec FROM mempool ORDER BY fee_sat DESC;', cat: 'btc' },
    { label: 'Fee Analysis',          query: 'SELECT block_height, value_btc, fee_sat FROM transactions WHERE fee_sat > 0 ORDER BY fee_sat DESC LIMIT 5;', cat: 'btc' },
    { label: 'Exchange Wallets',      query: "SELECT address, label, balance_btc, tx_count FROM addresses WHERE label LIKE '%Binance%' ORDER BY balance_btc DESC;", cat: 'btc' },
  ],
  diving: [
    { label: 'Dive Stats',            query: 'SELECT * FROM dive_stats;',        cat: 'dive' },
    { label: 'All Dives',             query: 'SELECT dive_no, date, type, site, max_depth_m, duration FROM dive_log ORDER BY dive_no;', cat: 'dive' },
    { label: 'Scuba Dives',           query: "SELECT dive_no, date, site, max_depth_m, duration FROM dive_log WHERE type = 'scuba' ORDER BY dive_no;", cat: 'dive' },
    { label: 'Freedives',             query: "SELECT dive_no, date, site, max_depth_m, duration FROM dive_log WHERE type = 'free' ORDER BY dive_no;", cat: 'dive' },
    { label: 'Deepest Dives',         query: 'SELECT dive_no, date, type, site, max_depth_m FROM dive_log ORDER BY max_depth_m DESC LIMIT 5;', cat: 'dive' },
    { label: 'Certifications',        query: 'SELECT * FROM dive_certs ORDER BY date;', cat: 'dive' },
    { label: 'Dive Sites',            query: 'SELECT site, location, COUNT(*) as dives FROM dive_log GROUP BY site ORDER BY dives DESC;', cat: 'dive' },
    { label: 'Egypt Dives',           query: "SELECT dive_no, date, site, max_depth_m, notes FROM dive_log WHERE location LIKE '%EG%';", cat: 'dive' },
    { label: 'Cold Dives',            query: 'SELECT dive_no, date, site, water_temp_c, max_depth_m FROM dive_log WHERE water_temp_c < 10 ORDER BY water_temp_c;', cat: 'dive' },
    { label: 'Latest Dive',           query: 'SELECT * FROM dive_log ORDER BY dive_no DESC LIMIT 1;', cat: 'dive' },
  ],
  schema: [
    { label: 'SHOW TABLES',           query: 'SHOW TABLES;',                    cat: 'schema' },
    { label: 'DESCRIBE profile',      query: 'DESCRIBE profile;',               cat: 'schema' },
    { label: 'DESCRIBE skills',       query: 'DESCRIBE skills;',                cat: 'schema' },
    { label: 'DESCRIBE blocks',       query: 'DESCRIBE blocks;',                cat: 'schema' },
    { label: 'DESCRIBE transactions', query: 'DESCRIBE transactions;',           cat: 'schema' },
    { label: 'DESCRIBE addresses',    query: 'DESCRIBE addresses;',              cat: 'schema' },
    { label: 'DESCRIBE mempool',      query: 'DESCRIBE mempool;',                cat: 'schema' },
    { label: 'DESCRIBE dive_log',     query: 'DESCRIBE dive_log;',               cat: 'schema' },
    { label: 'DESCRIBE dive_certs',   query: 'DESCRIBE dive_certs;',             cat: 'schema' },
    { label: 'DESCRIBE dive_stats',   query: 'DESCRIBE dive_stats;',             cat: 'schema' },
  ],
};

// ===================== BOOT LINES =====================
var bootLines = [
  { text: VERSION + ' — interactive SQL engine', cls: 'boot-dim', delay: 150 },
  { text: 'built on linux x86_64, 64-bit', cls: 'boot-dim', delay: 100 },
  { text: '', delay: 150 },
  { text: 'Initializing data directory... ok', cls: 'boot-ok', delay: 150 },
  { text: 'Initializing entropy generator... ok', cls: 'boot-ok', delay: 120 },
  { text: 'Starting query engine... ok', cls: 'boot-ok', delay: 180 },
  { text: 'Loading data modules... ok', cls: 'boot-ok', delay: 150 },
  { text: '', delay: 120 },
  { text: 'Loading extensions...', cls: 'boot-info', delay: 180 },
  { text: '  loaded extension: python', cls: 'boot-ok', delay: 100 },
  { text: '  loaded extension: crypto', cls: 'boot-ok', delay: 80 },
  { text: '  loaded extension: stats', cls: 'boot-ok', delay: 80 },
  { text: '  loaded extension: json', cls: 'boot-ok', delay: 80 },
  { text: '  loaded extension: cron', cls: 'boot-ok', delay: 80 },
  { text: '  loaded extension: http', cls: 'boot-ok', delay: 80 },
  { text: '  loaded extension: oceandata', cls: 'boot-ok', delay: 80 },
  { text: '  loaded extension: caffeine', cls: 'boot-ok', delay: 80 },
  { text: '', delay: 120 },
  { text: 'Connecting to martjn_db...', cls: 'boot-info', delay: 250 },
  { text: '  host=localhost user=visitor', cls: 'boot-dim', delay: 120 },
  { text: '  encrypted connection established', cls: 'boot-dim', delay: 150 },
  { text: 'Connection ready.', cls: 'boot-ok', delay: 180 },
  { text: '', delay: 120 },
  { text: 'Loading schemas...', cls: 'boot-info', delay: 180 },
];

// Auto-generate schema boot lines from TABLE_SCHEMA
(function() {
  var maxLen = 0;
  var bootTables = Object.keys(TABLES).filter(function(n) { return n !== 'tools'; });
  bootTables.forEach(function(name) {
    var full = (TABLE_SCHEMA[name] || 'public') + '.' + name;
    if (full.length > maxLen) maxLen = full.length;
  });
  bootTables.forEach(function(name) {
    var schema = TABLE_SCHEMA[name] || 'public';
    var full = schema + '.' + name;
    var pad = '';
    for (var i = full.length; i < maxLen + 2; i++) pad += ' ';
    var count = TABLES[name].rows.length;
    bootLines.push({ text: '  \u2192 ' + full + pad + '(' + count + (count === 1 ? ' row' : ' rows') + ')', cls: 'boot-ok', delay: 80 });
  });
})();

bootLines.push({ text: '', delay: 150 });
bootLines.push({ text: 'Syncing dive_log... ' + TABLES.dive_log.rows.length + ' dives, last: ' + new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10) + ' \u2713', cls: 'boot-ok', delay: 200 });
bootLines.push({ text: 'Syncing oceandata... water temp ' + (16 + Math.random() * 8).toFixed(1) + '\u00B0C \u2713', cls: 'boot-ok', delay: 180 });
bootLines.push({ text: 'Syncing blockchain index... block #' + currentBlockHeight() + ' \u2713', cls: 'boot-ok', delay: 200 });
var BOOT_WARNINGS = [
  'WARNING: caffeine_level below threshold (12%)',
  'WARNING: swap usage critical — too many side projects loaded',
  'WARNING: disk usage /dev/brain0 at 94% — consider offloading to notes',
  'WARNING: sleep_daemon has not run in 47 hours',
  'WARNING: oxygen_level nominal — next dive in T-14 days',
  'WARNING: entropy pool exhausted — refilling from cat videos',
  'WARNING: /dev/fridge reports 0 remaining items',
];
// Pick 2 random unique warnings
var shuffled = BOOT_WARNINGS.slice().sort(function() { return Math.random() - 0.5; });
bootLines.push({ text: shuffled[0], cls: 'boot-warn', delay: 300 });
bootLines.push({ text: shuffled[1], cls: 'boot-warn', delay: 200 });
bootLines.push({ text: '', delay: 150 });
