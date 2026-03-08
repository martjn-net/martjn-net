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

function randomHash() {
  var hex = '0123456789abcdef';
  var h = '00000000000000000';
  for (var i = 0; i < 5; i++) h += hex[Math.floor(Math.random() * 16)];
  return h + '..' + hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)];
}

function randomTxid() {
  var hex = '0123456789abcdef';
  var h = '';
  for (var i = 0; i < 8; i++) h += hex[Math.floor(Math.random() * 16)];
  return h + '..' + hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)];
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
      ['role', 'Data Engineer'],
      ['company', 'sipgate'],
      ['location', 'Germany'],
      ['website', 'https://martjn.net'],
      ['github', 'https://github.com/martjn-net'],
      ['since', '2008'],
      ['motto', 'Making data flow — from raw events to actionable insights.'],
    ]
  },
  skills: {
    columns: ['skill', 'category', 'proficiency', 'years_exp'],
    types: ['varchar', 'varchar', 'int', 'int'],
    rows: [
      ['Python',     'language',  95, 12],
      ['SQL',        'language',  90, 14],
      ['Bash',       'language',  80, 14],
      ['JavaScript', 'language',  65,  8],
      ['BigQuery',   'database',  88,  6],
      ['PostgreSQL', 'database',  82, 10],
      ['MySQL',      'database',  85, 14],
      ['GCP',        'cloud',     78,  6],
      ['Docker',     'cloud',     72,  5],
      ['Linux',      'infra',     88, 16],
      ['Git',        'tool',      85, 12],
      ['REST APIs',  'tool',      82, 10],
      ['ETL',        'concept',   92, 10],
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
  experience: {
    columns: ['period', 'role', 'focus'],
    types: ['varchar', 'varchar', 'text'],
    rows: [
      ['2008 – present', 'Data Engineer', 'ETL pipelines, data warehousing, analytics infrastructure'],
    ]
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
  },
  dive_log: {
    columns: ['dive_no', 'date', 'type', 'site', 'location', 'max_depth_m', 'duration', 'water_temp_c', 'visibility_m', 'buddy', 'notes'],
    types: ['int', 'varchar', 'varchar', 'varchar', 'varchar', 'float', 'varchar', 'float', 'int', 'varchar', 'text'],
    rows: [
      [1,   '2019-06-15', 'scuba',  'Fühlinger See',       'Köln, DE',         8.2,  '42 min',   18.0,  4,  'Jens',      'First open water dive after DTSA*'],
      [2,   '2019-06-15', 'scuba',  'Fühlinger See',       'Köln, DE',        10.5,  '38 min',   17.5,  4,  'Jens',      'Compass navigation practice'],
      [3,   '2019-09-20', 'free',   'Pool',                'Düsseldorf, DE',   2.0,  '1:30 min',  28.0, 25,  'Solo',      'First STA training, breathing technique'],
      [4,   '2019-11-08', 'free',   'Pool',                'Düsseldorf, DE',   3.0,  '1:55 min',  27.0, 25,  'Solo',      'STA progress, relaxation improving'],
      [5,   '2020-02-10', 'free',   'Pool',                'Düsseldorf, DE',   3.5,  '2:15 min',  28.0, 25,  'Solo',      'STA new PB, contractions from 1:50'],
      [6,   '2020-06-22', 'scuba',  'Blauer See',          'Ratingen, DE',    15.0,  '45 min',   14.0,  5,  'Jens',      'Explored old concrete structures on bottom'],
      [7,   '2020-07-14', 'free',   'Banana Beach',        'Zakynthos, GR',   10.0,  '1:35 min',  25.0, 20,  'Solo',      'CWT first Frenzel attempts in open water'],
      [8,   '2020-07-15', 'scuba',  'Zakynthos Caves',     'Zakynthos, GR',   18.0,  '48 min',   22.0, 30,  'Nikos',     'Sea turtles inside the cave!'],
      [9,   '2020-07-16', 'free',   'Banana Beach',        'Zakynthos, GR',   14.5,  '1:48 min',  25.0, 22,  'Solo',      'CWT Frenzel working down to 14m'],
      [10,  '2021-03-12', 'free',   'Pool',                'Düsseldorf, DE',   3.5,  '65 m DYN',  27.0, 25,  'Solo',      'DYN with fins, improved streamline'],
      [11,  '2021-05-30', 'scuba',  'Sundhäuser See',      'Nordhausen, DE',  18.0,  '44 min',   10.0,  6,  'Alex',      'Underwater park with sunken objects'],
      [12,  '2021-08-14', 'free',   'Krk Island',          'Krk, HR',         18.3,  '1:52 min',  24.0, 25,  'Marco',     'CWT along the cliff, clean Frenzel'],
      [13,  '2021-08-15', 'free',   'Krk Island',          'Krk, HR',         21.0,  '2:00 min',  24.0, 25,  'Marco',     'New depth PB, mouthfill from 15m'],
      [14,  '2021-08-16', 'scuba',  'Plavnik Wall',        'Krk, HR',         20.0,  '50 min',   18.0, 20,  'Marco',     'Wall dive, spotted eagle ray'],
      [15,  '2022-01-15', 'free',   'Pool',                'Düsseldorf, DE',   3.5,  '3:02 min',  27.0, 25,  'Solo',      'STA new PB 3:02, contractions from 2:20'],
      [16,  '2022-04-22', 'free',   'Pool',                'Düsseldorf, DE',   3.5,  '82 m DYN',  27.0, 25,  'Solo',      'DYN PB, found the right kick rhythm'],
      [17,  '2022-06-18', 'free',   'Lago di Garda',       'Gardasee, IT',    24.0,  '2:10 min',  22.0, 15,  'Marco',     'FIM training, clean mouthfill from 18m'],
      [18,  '2022-06-19', 'free',   'Lago di Garda',       'Gardasee, IT',    26.5,  '2:18 min',  21.0, 15,  'Marco',     'CWT new PB! Enjoyed freefall from 20m'],
      [19,  '2023-03-25', 'free',   'Pool',                'Düsseldorf, DE',   3.5,  '90 m DYN',  27.0, 25,  'Solo',      'DYN new PB, passed AIDA3 exam'],
      [20,  '2023-07-10', 'scuba',  'Ras Mohammed',        'Sharm el-Sheikh, EG', 18.0, '52 min', 28.0, 35, 'Ahmed',     'Shark Reef, incredible visibility'],
      [21,  '2023-07-12', 'free',   'Blue Hole',           'Dahab, EG',       28.0,  '2:25 min',  26.0, 40,  'Solo',      'CWT new PB 28m, saw The Arch from above'],
      [22,  '2023-07-13', 'free',   'Blue Hole',           'Dahab, EG',       25.0,  '2:15 min',  26.0, 40,  'Solo',      'FIM relaxation dive, dolphins!'],
      [23,  '2024-06-08', 'free',   'Kornati Islands',     'Murter, HR',      27.0,  '2:20 min',  24.0, 30,  'Marco',     'CWT between the islands, octopus at 15m'],
      [24,  '2024-06-09', 'scuba',  'Kornati Wreck',       'Murter, HR',      16.0,  '55 min',   20.0, 18,  'Marco',     'Small fishing wreck, relaxed dive'],
      [25,  '2024-09-14', 'free',   'Pool',                'Düsseldorf, DE',   3.5,  '3:15 min',  27.0, 25,  'Solo',      'STA new PB 3:15! Mental calm was the key'],
      [26,  '2025-02-22', 'free',   'Pool',                'Düsseldorf, DE',   4.0,  '95 m DYN',  27.0, 25,  'Solo',      'Pool training, DYN new PB, 100m within reach'],
    ]
  },
  dive_certs: {
    columns: ['cert', 'org', 'type', 'date', 'dives_at_cert'],
    types: ['varchar', 'varchar', 'varchar', 'varchar', 'int'],
    rows: [
      ['Grundtauchschein',  'VDST',  'scuba',  '2019-04-20',  0],
      ['DTSA*',             'VDST',  'scuba',  '2019-06-15',  2],
      ['AIDA*',             'AIDA',  'free',   '2020-03-01',  5],
      ['AIDA**',            'AIDA',  'free',   '2021-08-15', 13],
      ['AIDA***',           'AIDA',  'free',   '2023-03-25', 19],
    ]
  },
  dive_stats: {
    columns: ['metric', 'value'],
    types: ['varchar', 'varchar'],
    get rows() {
      return [
        ['Total Dives',         '26'],
        ['Scuba Dives',         '8'],
        ['Freedives',           '18'],
        ['Max Depth (Scuba)',   '20.0 m'],
        ['Max Depth (Free)',    '28.0 m'],
        ['Max Bottom Time',     '55 min'],
        ['Max Breath Hold',     '3:15 min'],
        ['Max DYN',             '95 m'],
        ['Countries',           '5 (DE, GR, HR, IT, EG)'],
        ['Certification',       'DTSA* / AIDA***'],
        ['Diving Since',        '2019'],
      ];
    }
  }
};

// ===================== SUGGESTIONS =====================
var SUGGESTIONS = {
  profile: [
    { label: 'About me',       query: 'SELECT * FROM profile;',               cat: 'data' },
    { label: 'Skills',         query: 'SELECT * FROM skills;',                cat: 'data' },
    { label: 'Experience',     query: 'SELECT * FROM experience;',            cat: 'data' },
    { label: 'Contact',        query: "SELECT value FROM profile WHERE key IN ('website','github');", cat: 'data' },
    { label: 'EXPLAIN me',     query: 'EXPLAIN SELECT * FROM martjn;',        cat: 'fun' },
    { label: 'Uptime',         query: "SELECT DATEDIFF(NOW(), '2008-11-01') AS uptime;", cat: 'fun' },
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
  { text: 'martjn_db v1.0 — interactive SQL engine', cls: 'boot-dim', delay: 150 },
  { text: 'built on linux x86_64, 64-bit', cls: 'boot-dim', delay: 100 },
  { text: '', delay: 150 },
  { text: 'Initializing data directory... ok', cls: 'boot-ok', delay: 150 },
  { text: 'Starting query engine... ok', cls: 'boot-ok', delay: 180 },
  { text: 'Loading data modules... ok', cls: 'boot-ok', delay: 150 },
  { text: '', delay: 120 },
  { text: 'Loading extensions...', cls: 'boot-info', delay: 180 },
  { text: '  loaded extension: python3u', cls: 'boot-ok', delay: 100 },
  { text: '  loaded extension: crypto', cls: 'boot-ok', delay: 80 },
  { text: '  loaded extension: stats', cls: 'boot-ok', delay: 80 },
  { text: '  loaded extension: json', cls: 'boot-ok', delay: 80 },
  { text: '  loaded extension: cron', cls: 'boot-ok', delay: 80 },
  { text: '  loaded extension: http', cls: 'boot-ok', delay: 80 },
  { text: '  loaded extension: hashlib', cls: 'boot-ok', delay: 80 },
  { text: '', delay: 120 },
  { text: 'Connecting to martjn_db...', cls: 'boot-info', delay: 250 },
  { text: '  host=localhost user=visitor', cls: 'boot-dim', delay: 120 },
  { text: '  encrypted connection established', cls: 'boot-dim', delay: 150 },
  { text: 'Connection ready.', cls: 'boot-ok', delay: 180 },
  { text: '', delay: 120 },
  { text: 'Loading schemas...', cls: 'boot-info', delay: 180 },
  { text: '  → public.profile        (9 rows)', cls: 'boot-ok', delay: 80 },
  { text: '  → public.skills        (13 rows)', cls: 'boot-ok', delay: 80 },
  { text: '  → public.tools         (13 rows)', cls: 'boot-ok', delay: 80 },
  { text: '  → public.experience     (1 row)',  cls: 'boot-ok', delay: 80 },
  { text: '  → diving.dive_log      (26 rows)', cls: 'boot-ok', delay: 80 },
  { text: '  → diving.dive_certs     (5 rows)', cls: 'boot-ok', delay: 80 },
  { text: '  → diving.dive_stats    (10 rows)', cls: 'boot-ok', delay: 80 },
  { text: '  → blockchain.blocks    (12 rows)', cls: 'boot-ok', delay: 80 },
  { text: '  → blockchain.transactions (13 rows)', cls: 'boot-ok', delay: 80 },
  { text: '  → blockchain.addresses (12 rows)', cls: 'boot-ok', delay: 80 },
  { text: '  → blockchain.mempool    (5 rows)', cls: 'boot-ok', delay: 80 },
  { text: '', delay: 150 },
  { text: 'Syncing dive_log... 26 dives, last: ' + new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10) + ' ✓', cls: 'boot-ok', delay: 200 },
  { text: 'Syncing blockchain index... block #' + currentBlockHeight() + ' ✓', cls: 'boot-ok', delay: 250 },
  { text: 'WARNING: caffeine_level below threshold (12%)', cls: 'boot-warn', delay: 300 },
  { text: '', delay: 150 },
  { text: 'Type SHOW TABLES to list tables, press ESC for menu navigation, or HELP for help.', cls: 'boot-info', delay: 200 },
  { text: '', delay: 150 },
];
