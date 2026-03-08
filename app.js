(function() {
  'use strict';

  // ===================== HELPERS =====================
  function findColIndex(columns, col) {
    return columns.findIndex(function(c) { return c.toLowerCase() === col; });
  }

  function applySorting(rows, columns, input) {
    var orderMatch = input.match(/ORDER\s+BY\s+(\w+)(?:\s+(ASC|DESC))?/i);
    if (!orderMatch) return rows;
    var orderCol = orderMatch[1].toLowerCase();
    var orderDir = (orderMatch[2] || 'ASC').toUpperCase();
    var orderIdx = findColIndex(columns, orderCol);
    if (orderIdx === -1) return rows;
    rows.sort(function(a, b) {
      var va = a[orderIdx], vb = b[orderIdx];
      var cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
      return orderDir === 'DESC' ? -cmp : cmp;
    });
    return rows;
  }

  // ===================== TERMINAL =====================
  var terminalWrap = document.getElementById('terminal-wrap');
  document.getElementById('boot-screen').style.display = 'none';
  terminalWrap.classList.add('active');

  var outputEl = document.getElementById('output');
  var cmdInput = document.getElementById('cmd-input');
  var terminal = document.getElementById('terminal');
  var suggestionsEl = document.getElementById('query-suggestions');
  var history = [];
  var historyIndex = -1;

  function printOutput(html) {
    outputEl.insertAdjacentHTML('beforeend', html + '\n');
  }

  function printPromptEcho(cmd) {
    printOutput('<span class="cmd-echo"><span class="prompt-db">martjn_db</span><span class="prompt-arrow">=&gt;</span> <span class="typed-cmd">' + escapeHtml(cmd) + '</span></span>');
  }

  function escapeHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function scrollToBottom() {
    terminal.scrollTop = terminal.scrollHeight;
  }

  var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function focusInput() {
    if (isTouchDevice) return;
    cmdInput.focus();
    setTimeout(function() { cmdInput.scrollIntoView({ block: 'nearest' }); }, 300);
  }
  terminal.addEventListener('click', function() {
    cmdInput.focus();
  });

  function printMotd() {
    printOutput('<span class="heading">' + VERSION + '</span>\n<span class="dim">Type HELP for help, SHOW TABLES to list tables, or press ESC for menu navigation.</span>\n');
  }

  // ===================== RENDER SUGGESTIONS =====================
  var activeTab = 'profile';

  function renderSuggestions(tab) {
    activeTab = tab || activeTab;
    suggestionsEl.innerHTML = '';
    var items = SUGGESTIONS[activeTab] || [];
    for (var i = 0; i < items.length; i++) {
      var s = items[i];
      var btn = document.createElement('span');
      btn.className = 'suggestion cat-' + s.cat;
      btn.textContent = s.label;
      btn.title = s.query;
      btn.addEventListener('click', (function(query) {
        return function() {
          processCommand(query);
          scrollToBottom();
          if (!menuMode) focusInput();
        };
      })(s.query));
      suggestionsEl.appendChild(btn);
    }
    document.querySelectorAll('.query-tab').forEach(function(t) {
      t.classList.toggle('active', t.dataset.tab === activeTab);
    });
  }

  // Tab click handlers
  document.querySelectorAll('.query-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      kbSuggIdx = -1;
      highlightSuggestion(-1);
      if (menuMode) setMenuMode(false);
      renderSuggestions(tab.dataset.tab);
    });
  });

  // ===================== KEYBOARD NAVIGATION =====================
  var kbSuggIdx = -1;
  var menuMode = false;
  var queryPanel = document.getElementById('query-panel');

  function setMenuMode(on) {
    menuMode = on;
    queryPanel.classList.toggle('menu-mode', on);
    document.querySelectorAll('.query-tab').forEach(function(t) { t.classList.remove('tab-focus'); });
    if (on) {
      var active = queryPanel.querySelector('.query-tab.active');
      if (active) active.classList.add('tab-focus');
      cmdInput.blur();
    } else {
      kbSuggIdx = -1;
      highlightSuggestion(-1);
      focusInput();
    }
  }

  function highlightSuggestion(idx) {
    var items = suggestionsEl.querySelectorAll('.suggestion');
    items.forEach(function(s) { s.classList.remove('kb-active'); });
    if (idx >= 0 && idx < items.length) {
      items[idx].classList.add('kb-active');
      items[idx].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  function cycleTabs(dir) {
    var tabs = Array.from(document.querySelectorAll('.query-tab'));
    var curIdx = tabs.findIndex(function(t) { return t.classList.contains('active'); });
    var next = (curIdx + dir + tabs.length) % tabs.length;
    kbSuggIdx = -1;
    highlightSuggestion(-1);
    renderSuggestions(tabs[next].dataset.tab);
    tabs.forEach(function(t) { t.classList.remove('tab-focus'); });
    tabs[next].classList.add('tab-focus');
  }

  document.addEventListener('keydown', function(e) {
    if (booting) return;

    // Escape: toggle menu mode
    if (e.key === 'Escape') {
      e.preventDefault();
      setMenuMode(!menuMode);
      return;
    }

    if (menuMode) {
      var items = suggestionsEl.querySelectorAll('.suggestion');

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (kbSuggIdx < 0) {
          cycleTabs(e.key === 'ArrowLeft' ? -1 : 1);
        } else {
          if (e.key === 'ArrowLeft' && kbSuggIdx > 0) kbSuggIdx--;
          else if (e.key === 'ArrowRight' && kbSuggIdx < items.length - 1) kbSuggIdx++;
          highlightSuggestion(kbSuggIdx);
        }
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        kbSuggIdx = -1;
        highlightSuggestion(-1);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (kbSuggIdx < 0) {
          kbSuggIdx = 0;
          highlightSuggestion(kbSuggIdx);
        }
        return;
      }

      if (e.key === 'Enter' && kbSuggIdx >= 0 && kbSuggIdx < items.length) {
        e.preventDefault();
        items[kbSuggIdx].click();
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        setMenuMode(false);
        return;
      }
    }
  });

  // ===================== SQL TABLE RENDERER =====================
  function renderTable(columns, rows, types) {
    if (rows.length === 0) return '<span class="sql-rows">(0 rows)</span>';

    var widths = columns.map(function(c, i) {
      var max = c.length;
      for (var r = 0; r < rows.length; r++) {
        var val = rows[r][i] === null ? 'NULL' : String(rows[r][i]);
        if (val.length > max) max = val.length;
      }
      return Math.min(max, 45);
    });

    var isNum = (types || []).map(function(t) { return ['int','float','numeric','bigint'].indexOf(t) !== -1; });

    function sep(left, mid, right, fill) {
      return '<span class="sql-table"><span class="border">' + left + widths.map(function(w) { return fill.repeat(w + 2); }).join(mid) + right + '</span></span>';
    }

    function dataRow(vals, cls, isHeader) {
      var out = '<span class="sql-table"><span class="border">│</span>';
      for (var i = 0; i < vals.length; i++) {
        var raw = vals[i] === null ? 'NULL' : String(vals[i]);
        var truncated = raw.length > widths[i] ? raw.slice(0, widths[i] - 2) + '..' : raw;
        var display = vals[i] === null ? '<span class="null">NULL</span>' : escapeHtml(truncated);
        var pad = widths[i] - (vals[i] === null ? 4 : truncated.length);

        if (isHeader) {
          out += ' <span class="header">' + display + '</span>' + ' '.repeat(pad) + ' <span class="border">│</span>';
        } else if (isNum[i]) {
          out += ' <span class="' + cls + '">' + ' '.repeat(pad) + display + '</span> <span class="border">│</span>';
        } else {
          var rawVal = String(vals[i] || '');
          if (rawVal === '__IMG__') {
            out += ' <img class="mail-img" src="mail.png" alt="contact">';
          } else if (rawVal.indexOf('http') === 0) {
            out += ' <a class="link" href="' + escapeHtml(rawVal) + '" target="_blank">' + display + '</a>' + ' '.repeat(pad) + ' <span class="border">│</span>';
          } else {
            out += ' <span class="' + cls + '">' + display + '</span>' + ' '.repeat(pad) + ' <span class="border">│</span>';
          }
        }
      }
      out += '</span>';
      return out;
    }

    var result = '<div class="table-scroll">';
    result += sep('┌', '┬', '┐', '─') + '\n';
    result += dataRow(columns, 'header', true) + '\n';
    result += sep('├', '┼', '┤', '─') + '\n';
    for (var r = 0; r < rows.length; r++) {
      result += dataRow(rows[r], r % 2 === 0 ? 'row-even' : 'row-odd', false) + '\n';
    }
    result += sep('└', '┴', '┘', '─') + '\n';
    result += '</div>';
    result += '<span class="sql-rows">(' + rows.length + ' ' + (rows.length === 1 ? 'row' : 'rows') + ')</span>';
    return result;
  }

  // ===================== SQL PARSER =====================
  function processCommand(input) {
    if (booting) return;
    var trimmed = input.trim().replace(/;$/, '');
    if (!trimmed) return;

    history.push(input.trim());
    historyIndex = history.length;
    printPromptEcho(input.trim());

    var upper = trimmed.toUpperCase().replace(/\s+/g, ' ');

    if (upper === 'SHOW TABLES') return cmdListTables();
    if (upper.startsWith('DESCRIBE ')) return cmdDescribeTable(trimmed.slice(9).trim());
    if (upper === 'HELP') return cmdHelp();
    if (upper === 'EXIT' || upper === 'QUIT') return cmdExit();
    if (upper === 'CLEAR') { outputEl.innerHTML = ''; return; }
    if (upper.startsWith('SELECT')) return cmdSelect(trimmed);
    if (upper.startsWith('EXPLAIN')) return cmdExplain();

    if (upper.startsWith('DROP')) {
      printOutput('<span class="error">ERROR:  permission denied — this portfolio is immutable</span>');
      return;
    }
    if (upper.startsWith('DELETE') || upper.startsWith('TRUNCATE')) {
      printOutput('<span class="error">ERROR:  cannot delete from a read-only portfolio</span>');
      return;
    }
    if (upper.startsWith('INSERT')) {
      printOutput('<span class="error">ERROR:  relation is read-only, accepting PRs on GitHub though</span>');
      return;
    }
    if (upper.startsWith('UPDATE')) {
      printOutput('<span class="error">ERROR:  contact me first before updating my profile ;)</span>');
      return;
    }

    printOutput('<span class="error">ERROR:  syntax error at or near "' + escapeHtml(trimmed.split(' ')[0]) + '"</span>\n<span class="dim">Try HELP or click a suggested query below.</span>');
  }

  // ===================== COMMANDS =====================
  function cmdHelp() {
    var bySchema = {};
    Object.keys(TABLES).forEach(function(name) {
      var s = TABLE_SCHEMA[name] || 'public';
      if (!bySchema[s]) bySchema[s] = [];
      bySchema[s].push(name);
    });
    var tablesStr = Object.keys(bySchema).map(function(s) {
      return '  <span class="dim">' + s + ':</span>  ' + bySchema[s].map(function(t) { return '<span class="tbl">' + t + '</span>'; }).join(' · ');
    }).join('\n');

    printOutput('\n<span class="heading">SQL commands:</span>\n\n  <span class="kw">SHOW TABLES</span>      List all tables\n  <span class="kw">DESCRIBE</span> <span class="tbl">table</span>    Show table schema\n  <span class="kw">SELECT</span> ...        Query data (supports *, WHERE, ORDER BY, LIMIT, GROUP BY)\n  <span class="kw">EXPLAIN</span> ...       Show query plan\n  <span class="kw">HELP</span>             Show this help\n  <span class="kw">CLEAR</span>            Clear screen\n  <span class="kw">EXIT</span>             Quit (nice try)\n\n<span class="heading">Tables:</span>\n' + tablesStr + '\n\n<span class="heading">Keyboard shortcuts:</span>\n\n  <span class="dim">┌──────────────────────────────────────────────────────┐</span>\n  <span class="dim">│</span> <span class="kw">Input mode</span> <span class="dim">(default)</span>                                  <span class="dim">│</span>\n  <span class="dim">├────────────────┬─────────────────────────────────────┤</span>\n  <span class="dim">│</span>  Enter          <span class="dim">│</span> Execute SQL command                  <span class="dim">│</span>\n  <span class="dim">│</span>  ↑ / ↓          <span class="dim">│</span> Browse command history                <span class="dim">│</span>\n  <span class="dim">│</span>  Tab            <span class="dim">│</span> Auto-complete table names / keywords  <span class="dim">│</span>\n  <span class="dim">│</span>  Ctrl+L         <span class="dim">│</span> Clear screen                          <span class="dim">│</span>\n  <span class="dim">│</span>  <span class="heading">Escape</span>         <span class="dim">│</span> <span class="heading">Switch to menu mode</span>                   <span class="dim">│</span>\n  <span class="dim">├──────────────────────────────────────────────────────┤</span>\n  <span class="dim">│</span> <span class="kw">Menu mode</span> <span class="dim">(press Escape to enter)</span>                    <span class="dim">│</span>\n  <span class="dim">├────────────────┬─────────────────────────────────────┤</span>\n  <span class="dim">│</span>  ← / →          <span class="dim">│</span> Switch tabs                           <span class="dim">│</span>\n  <span class="dim">│</span>  ↑ / ↓          <span class="dim">│</span> Navigate query suggestions            <span class="dim">│</span>\n  <span class="dim">│</span>  Enter          <span class="dim">│</span> Execute selected query                <span class="dim">│</span>\n  <span class="dim">│</span>  Escape         <span class="dim">│</span> Back to input mode                    <span class="dim">│</span>\n  <span class="dim">│</span>  Type anything  <span class="dim">│</span> Back to input mode + type             <span class="dim">│</span>\n  <span class="dim">└────────────────┴─────────────────────────────────────┘</span>\n\n<span class="dim">Or just click one of the suggested queries below.</span>');
  }

  function cmdListTables() {
    var rows = Object.keys(TABLES).map(function(name) {
      var t = TABLES[name];
      var schema = TABLE_SCHEMA[name] || 'public';
      return [schema, name, 'table', t.rows.length + ' rows'];
    });
    printOutput('\n<span class="heading">          List of relations</span>');
    printOutput(renderTable(['Schema', 'Name', 'Type', 'Size'], rows, ['varchar','varchar','varchar','varchar']));
    // Make table names clickable
    var nameLinks = outputEl.querySelectorAll('.row-even, .row-odd');
    nameLinks.forEach(function(span) {
      var text = span.textContent;
      Object.keys(TABLES).forEach(function(name) {
        if (text.indexOf(name) !== -1 && !span.dataset.linked) {
          var re = new RegExp('(' + name + ')');
          span.innerHTML = span.innerHTML.replace(re, '<span class="link table-link" data-table="' + name + '">$1</span>');
          span.dataset.linked = '1';
        }
      });
    });
    outputEl.querySelectorAll('.table-link').forEach(function(link) {
      link.addEventListener('click', function() {
        var name = link.dataset.table;
        var schema = TABLE_SCHEMA[name] || 'public';
        cmdInput.value = 'SELECT * FROM ' + schema + '.' + name + ';';
        cmdInput.focus();
      });
    });
  }

  function cmdDescribeTable(name) {
    var table = TABLES[name.toLowerCase()];
    if (!table) {
      printOutput('<span class="error">ERROR:  relation "' + escapeHtml(name) + '" does not exist</span>');
      return;
    }
    var schema = TABLE_SCHEMA[name.toLowerCase()] || 'public';
    var rows = table.columns.map(function(c, i) { return [c, table.types[i], 'NO']; });
    printOutput('\n<span class="heading">          Table "' + schema + '.' + name.toLowerCase() + '"</span>');
    printOutput(renderTable(['Column', 'Type', 'Nullable'], rows, ['varchar','varchar','varchar']));
  }

  function cmdExit() {
    printOutput('<span class="error">FATAL:  terminating connection due to administrator command\nserver closed the connection unexpectedly\n\tThis probably means the server terminated abnormally\n\tbefore or while processing the request.\nconnection to server was lost. Attempting reconnect...</span>\n<span class="accent">connection re-established.</span>\n\n<span class="dim">To actually quit, press Ctrl+W (close tab) or Ctrl+Q (close browser).</span>');
  }

  function cmdExplain() {
    printOutput('\n<span class="dim">                          QUERY PLAN</span>\n<span class="dim">──────────────────────────────────────────────────────────</span>\n <span class="accent">Seq Scan on martjn</span>  (cost=0.00..∞ rows=1 width=amazing)\n   Filter: (awesome = true AND coffee_level > 0)\n   <span class="dim">→ Rows Removed by Filter: 0</span>\n   <span class="dim">→ Planning Time: since 2008</span>\n   <span class="dim">→ Execution Time: ongoing</span>\n<span class="dim">──────────────────────────────────────────────────────────</span>\n<span class="sql-rows"> Result: 1 highly motivated data engineer</span>');
  }

  // ===================== SELECT PARSER =====================
  function cmdSelect(input) {
    var upper = input.toUpperCase().replace(/\s+/g, ' ');

    // Special: uptime query
    if (upper.indexOf('DATEDIFF') !== -1) {
      var start = new Date(UPTIME_START);
      var now = new Date();
      var days = Math.floor((now - start) / 86400000);
      var years = Math.floor(days / 365);
      printOutput(renderTable(['uptime'], [[days + ' days (' + years + ' years)']], ['varchar']));
      return;
    }

    if (upper.indexOf('VERSION()') !== -1) {
      printOutput(renderTable(['version'], [[VERSION + ' (Interactive SQL Edition)']], ['varchar']));
      return;
    }

    if (upper.indexOf('CURRENT_USER') !== -1 || upper.indexOf('CURRENT_DATABASE') !== -1) {
      printOutput(renderTable(['current_user', 'current_database'], [['martjn', 'martjn_db']], ['varchar','varchar']));
      return;
    }

    var fromMatch = input.match(/FROM\s+(?:\w+\.)?(\w+)/i);
    if (!fromMatch) {
      printOutput('<span class="error">ERROR:  specify a FROM table — try: SELECT * FROM profile;</span>');
      return;
    }

    var tableName = fromMatch[1].toLowerCase();
    var table = TABLES[tableName];
    if (!table) {
      printOutput('<span class="error">ERROR:  relation "' + escapeHtml(fromMatch[1]) + '" does not exist</span>\n<span class="dim">Available: ' + Object.keys(TABLES).join(', ') + '</span>');
      return;
    }

    var selectPart = input.match(/SELECT\s+(.+)\s+FROM\s+\w+/i);
    if (!selectPart) {
      printOutput('<span class="error">ERROR:  syntax error in SELECT</span>');
      return;
    }

    var selectedCols;
    var colIndices;
    var groupByCol = null;
    var isAggregate = false;

    var groupMatch = input.match(/GROUP\s+BY\s+(\w+)/i);
    if (groupMatch) {
      groupByCol = groupMatch[1].toLowerCase();
      isAggregate = true;
    }

    if (upper.indexOf('COUNT(') !== -1 || upper.indexOf('AVG(') !== -1 || upper.indexOf('SUM(') !== -1 || upper.indexOf('ROUND(') !== -1) {
      isAggregate = true;
    }

    if (isAggregate && groupByCol) {
      return cmdSelectAggregate(input, table, tableName, groupByCol);
    }

    var selStr = selectPart[1].trim();
    if (selStr === '*') {
      selectedCols = table.columns.slice();
      colIndices = table.columns.map(function(_, i) { return i; });
    } else {
      var parts = selStr.split(',').map(function(s) { return s.trim(); });
      selectedCols = [];
      colIndices = [];
      for (var p = 0; p < parts.length; p++) {
        var aliasMatch = parts[p].match(/^(\S+)\s+AS\s+(\S+)$/i);
        var colName = aliasMatch ? aliasMatch[1].toLowerCase() : parts[p].toLowerCase();
        var alias = aliasMatch ? aliasMatch[2] : null;
        var idx = findColIndex(table.columns, colName);
        if (idx === -1) {
          printOutput('<span class="error">ERROR:  column "' + escapeHtml(colName) + '" does not exist in ' + tableName + '</span>\n<span class="dim">Columns: ' + table.columns.join(', ') + '</span>');
          return;
        }
        selectedCols.push(alias || table.columns[idx]);
        colIndices.push(idx);
      }
    }

    var types = colIndices.map(function(i) { return table.types[i]; });

    var fullRows = table.rows.slice();
    var whereMatch = input.match(/WHERE\s+(.+?)(?:\s+ORDER|\s+LIMIT|\s+GROUP|\s*$)/i);
    if (whereMatch) {
      fullRows = applyWhere(fullRows, table.columns, table.types, whereMatch[1]);
    }
    var rows = fullRows.map(function(r) { return colIndices.map(function(i) { return r[i]; }); });

    applySorting(rows, selectedCols, input);

    var limitMatch = input.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      rows = rows.slice(0, parseInt(limitMatch[1]));
    }

    printOutput(renderTable(selectedCols, rows, types));
  }

  function applyWhere(rows, cols, types, whereStr) {
    return rows.filter(function(row) {
      var inMatch = whereStr.match(/(\w+)\s+IN\s*\(([^)]+)\)/i);
      if (inMatch) {
        var col = inMatch[1].toLowerCase();
        var vals = inMatch[2].split(',').map(function(v) { return v.trim().replace(/'/g, ''); });
        var idx = findColIndex(cols, col);
        if (idx === -1) return true;
        return vals.some(function(v) { return String(row[idx]).toLowerCase() === v.toLowerCase(); });
      }

      var cmpMatch = whereStr.match(/(\w+)\s*(=|!=|<>|>=|<=|>|<|LIKE)\s*'?([^']*?)'?\s*$/i);
      if (cmpMatch) {
        var col2 = cmpMatch[1].toLowerCase();
        var op = cmpMatch[2].toUpperCase();
        var val = cmpMatch[3];
        var idx2 = findColIndex(cols, col2);
        if (idx2 === -1) return true;
        var cellVal = row[idx2];
        var numVal = parseFloat(val);

        switch (op) {
          case '=': return String(cellVal).toLowerCase() === val.toLowerCase();
          case '!=': case '<>': return String(cellVal).toLowerCase() !== val.toLowerCase();
          case '>': return typeof cellVal === 'number' ? cellVal > numVal : false;
          case '<': return typeof cellVal === 'number' ? cellVal < numVal : false;
          case '>=': return typeof cellVal === 'number' ? cellVal >= numVal : false;
          case '<=': return typeof cellVal === 'number' ? cellVal <= numVal : false;
          case 'LIKE': {
            var pattern = val.replace(/%/g, '.*').replace(/_/g, '.');
            return new RegExp('^' + pattern + '$', 'i').test(String(cellVal));
          }
        }
      }
      return true;
    });
  }

  function cmdSelectAggregate(input, table, tableName, groupCol) {
    var groupIdx = findColIndex(table.columns, groupCol);
    if (groupIdx === -1) {
      printOutput('<span class="error">ERROR:  column "' + escapeHtml(groupCol) + '" does not exist</span>');
      return;
    }

    var groups = {};
    for (var i = 0; i < table.rows.length; i++) {
      var key = table.rows[i][groupIdx];
      if (!groups[key]) groups[key] = [];
      groups[key].push(table.rows[i]);
    }

    var selectPart = input.match(/SELECT\s+(.+?)\s+FROM/i)[1];
    var selParts = selectPart.split(',').map(function(s) { return s.trim(); });

    var resCols = [];
    var resTypes = [];
    var resRows = [];

    var colDefs = selParts.map(function(part) {
      var aggMatch = part.match(/(COUNT|AVG|SUM|MIN|MAX|ROUND)\s*\(\s*(.*?)\s*\)/i);
      if (aggMatch) {
        var func = aggMatch[1].toUpperCase();
        var inner = aggMatch[2];
        var innerAgg = inner.match(/(AVG|SUM|COUNT)\s*\(\s*(\w+)\s*\)/i);
        if (innerAgg) {
          var alias = part.match(/AS\s+(\w+)/i);
          return { type: 'roundagg', func: innerAgg[1].toUpperCase(), col: innerAgg[2].toLowerCase(), alias: alias ? alias[1] : func.toLowerCase() };
        }
        var alias2 = part.match(/AS\s+(\w+)/i);
        return { type: 'agg', func: func, col: inner === '*' ? '*' : inner.toLowerCase(), alias: alias2 ? alias2[1] : func.toLowerCase() };
      }
      return { type: 'col', col: part.toLowerCase().replace(/\s+as\s+\w+/i, '').trim() };
    });

    for (var d = 0; d < colDefs.length; d++) {
      if (colDefs[d].type === 'col') { resCols.push(colDefs[d].col); resTypes.push('varchar'); }
      else { resCols.push(colDefs[d].alias); resTypes.push('numeric'); }
    }

    var groupKeys = Object.keys(groups);
    for (var g = 0; g < groupKeys.length; g++) {
      var gKey = groupKeys[g];
      var gRows = groups[gKey];
      var resRow = [];
      for (var dd = 0; dd < colDefs.length; dd++) {
        var def = colDefs[dd];
        if (def.type === 'col') {
          resRow.push(gKey);
        } else {
          var colIdx = def.col === '*' ? -1 : findColIndex(table.columns, def.col);
          var vals = colIdx === -1 ? gRows : gRows.map(function(r) { return r[colIdx]; }).filter(function(v) { return typeof v === 'number'; });
          switch (def.func) {
            case 'COUNT': resRow.push(def.col === '*' ? gRows.length : vals.length); break;
            case 'AVG': resRow.push(vals.length ? Math.round(vals.reduce(function(a,b) { return a+b; }, 0) / vals.length) : 0); break;
            case 'SUM': resRow.push(vals.reduce(function(a,b) { return a+b; }, 0)); break;
            case 'MIN': resRow.push(Math.min.apply(null, vals)); break;
            case 'MAX': resRow.push(Math.max.apply(null, vals)); break;
            default: resRow.push(null);
          }
        }
      }
      resRows.push(resRow);
    }

    applySorting(resRows, resCols, input);

    printOutput(renderTable(resCols, resRows, resTypes));
  }

  // ===================== INPUT =====================
  cmdInput.addEventListener('keydown', function(e) {
    if (booting) { e.preventDefault(); return; }
    if (e.key === 'Enter') {
      var val = cmdInput.value;
      cmdInput.value = '';
      processCommand(val);
      scrollToBottom();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) { historyIndex--; cmdInput.value = history[historyIndex]; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) { historyIndex++; cmdInput.value = history[historyIndex]; }
      else { historyIndex = history.length; cmdInput.value = ''; }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      var tabVal = cmdInput.value.toLowerCase();
      var tableNames = Object.keys(TABLES);
      var kws = ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'LIMIT', 'GROUP BY', 'EXPLAIN'].concat(tableNames);
      var m = kws.filter(function(k) { return k.toLowerCase().indexOf(tabVal) === 0; });
      if (m.length === 1) cmdInput.value = m[0] + ' ';
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      outputEl.innerHTML = '';
    }
  });

  // ===================== BOOT =====================
  var booting = true;
  var bootIndex = 0;
  function renderBoot() {
    if (bootIndex >= bootLines.length) {
      booting = false;
      document.getElementById('input-line').style.display = '';
      printMotd();
      renderSuggestions();
      scrollToBottom();
      focusInput();
      return;
    }
    var line = bootLines[bootIndex];
    printOutput('<span class="' + (line.cls || '') + '">' + escapeHtml(line.text) + '</span>');
    scrollToBottom();
    bootIndex++;
    setTimeout(renderBoot, line.delay);
  }

  // ===================== DYNAMIC SEO =====================
  (function generateSEO() {
    var p = {};
    TABLES.profile.rows.forEach(function(r) { p[r[0]] = r[1]; });

    var skillsByCategory = {};
    TABLES.skills.rows.forEach(function(r) {
      var cat = r[1];
      if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
      skillsByCategory[cat].push(r[0]);
    });

    var certs = TABLES.dive_certs.rows.map(function(r) {
      return {
        '@type': 'EducationalOccupationalCredential',
        name: r[0] + ' (' + r[1] + ')',
        credentialCategory: 'certification',
        recognizedBy: { '@type': 'Organization', name: r[2] }
      };
    });

    var knowsAbout = TABLES.skills.rows.map(function(r) { return r[0]; });

    var jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: p.name || 'martjn',
      url: p.website || 'https://martjn.net',
      jobTitle: p.role || 'Data & Crypto Enthusiast · Diver',
      knowsAbout: knowsAbout,
      description: (p.role || 'Data & Crypto Enthusiast · Diver') + '. Interactive SQL terminal with dive logbook and blockchain data.',
      knowsLanguage: ['de', 'en'],
      hasCredential: certs
    };

    var ldScript = document.createElement('script');
    ldScript.type = 'application/ld+json';
    ldScript.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(ldScript);

    var catLabels = { language: 'Languages', database: 'Data & Databases', cloud: 'Cloud & Infrastructure', infra: 'Infrastructure', tool: 'Tools', concept: 'Concepts' };
    var skillsHtml = '';
    Object.keys(skillsByCategory).forEach(function(cat) {
      skillsHtml += '<li>' + (catLabels[cat] || cat) + ': ' + skillsByCategory[cat].join(', ') + '</li>';
    });

    var certNames = TABLES.dive_certs.rows.map(function(r) { return r[0]; }).join(', ');
    var diveCount = TABLES.dive_log.rows.length;

    var seoEl = document.getElementById('seo-content');
    if (seoEl) {
      seoEl.innerHTML =
        '<h1>' + (p.name || 'martjn') + ' — ' + (p.role || 'Data & Crypto Enthusiast · Diver') + '</h1>' +
        '<p>' + (p.motto || '') + '</p>' +
        '<h2>Skills</h2><ul>' + skillsHtml + '</ul>' +
        '<h2>Diving</h2><p>Certified diver (' + certNames + '). ' + diveCount + ' logged dives across Germany and Europe.</p>' +
        '<h2>Contact</h2><p>Website: <a href="' + (p.website || '') + '">' + (p.website || '') + '</a></p>';
    }
  })();

  renderBoot();

})();
