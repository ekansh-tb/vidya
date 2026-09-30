// A conservative lexical preflight, not a SQL rewriter. Dollar-quoted function
// bodies, quoted identifiers, strings and nested comments are opaque. PostgreSQL
// still validates SQL syntax. Unsupported/ambiguous quoting fails closed.
export class MigrationSqlError extends Error {}

export function assertMigrationSql(sql) {
  let i = 0;
  let words = [];
  const reject = (message) => { throw new MigrationSqlError(message); };
  const check = () => {
    if (["BEGIN", "START", "COMMIT", "END", "ROLLBACK", "ABORT", "SAVEPOINT", "RELEASE"].includes(words[0]) ||
        (words[0] === "PREPARE" && words[1] === "TRANSACTION") ||
        (words[0] === "SET" && (words[1] === "TRANSACTION" ||
          (words[1] === "SESSION" && words[2] === "CHARACTERISTICS")))) {
      reject("top-level transaction control is not allowed; the runner owns the transaction");
    }
    words = [];
  };
  const opaque = () => { if (words.length < 3) words.push("<quoted>"); };
  while (i < sql.length) {
    if (/\s/.test(sql[i])) { i++; continue; }
    if (sql.startsWith("--", i)) {
      while (i < sql.length && sql[i] !== "\n" && sql[i] !== "\r") i++;
      continue;
    }
    if (sql.startsWith("/*", i)) {
      let depth = 1;
      i += 2;
      while (i < sql.length && depth) {
        if (sql.startsWith("/*", i)) { depth++; i += 2; }
        else if (sql.startsWith("*/", i)) { depth--; i += 2; }
        else i++;
      }
      if (depth) reject("unterminated SQL comment");
      continue;
    }
    if (sql[i] === ";") { check(); i++; continue; }
    const escape = /^[eE]'/.test(sql.slice(i, i + 2));
    if (escape || sql[i] === "'" || sql[i] === '"') {
      if (escape) i++;
      const quote = sql[i++];
      let closed = false;
      while (i < sql.length) {
        if (sql[i] === "\\" && quote === "'") {
          if (!escape) reject("ambiguous backslash in SQL string; use an explicit E string");
          i += 2;
        } else if (sql[i] === quote) {
          if (sql[i + 1] === quote) i += 2;
          else { i++; closed = true; break; }
        } else i++;
      }
      if (!closed) reject("unterminated SQL quote");
      opaque();
      continue;
    }
    if (sql[i] === "$") {
      const delimiter = /^\$(?:[A-Za-z_\u0080-\uffff][A-Za-z_0-9\u0080-\uffff]*)?\$/.exec(sql.slice(i))?.[0];
      if (delimiter) {
        const end = sql.indexOf(delimiter, i + delimiter.length);
        if (end === -1) reject("unterminated SQL dollar quote");
        i = end + delimiter.length;
        opaque();
        continue;
      }
    }
    const word = /^[A-Za-z_\u0080-\uffff][A-Za-z_0-9$\u0080-\uffff]*/.exec(sql.slice(i))?.[0];
    if (word) {
      if (words.length < 3) words.push(word.toUpperCase());
      i += word.length;
    } else {
      opaque();
      i++;
    }
  }
  check();
}
