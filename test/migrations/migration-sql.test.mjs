import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { assertMigrationSql } from "../../scripts/migration-sql.mjs";

test("rejects transaction commands and aliases across comments and mixed case", () => {
  for (const command of [
    "BEGIN", "BEGIN WORK", "START /* nested /* comment */ */ TRANSACTION",
    "COMMIT", "CoMmIt AND CHAIN", "END WORK", "ROLLBACK", "ABORT",
    "SAVEPOINT x", "RELEASE SAVEPOINT x", "PREPARE TRANSACTION 'x'",
    "COMMIT PREPARED 'x'", "ROLLBACK PREPARED 'x'", "SET TRANSACTION READ ONLY",
    "SET SESSION CHARACTERISTICS AS TRANSACTION READ WRITE",
  ]) {
    assert.throws(() => assertMigrationSql(`-- heading\nselect 1; /* comment */ ${command};`),
      /top-level transaction control/);
  }
});

test("preserves PLpgSQL bodies, quoted identifiers, strings and nested comments", () => {
  assert.doesNotThrow(() => assertMigrationSql(`
    /* BEGIN; /* COMMIT; */ END; */
    create function demo() returns void language plpgsql as $body$
    begin
      raise notice 'COMMIT; -- not a command';
      if true then perform 1; end if;
    end;
    $body$;
    select 'BEGIN; it''s a string', "COMMIT", $$END;$$;
    -- ROLLBACK;
    select 1;
  `));
  assert.doesNotThrow(() => assertMigrationSql(String.raw`select E'quote\'; COMMIT; still a string';`));
  assert.throws(() => assertMigrationSql(String.raw`select E'quote\'; still a string'; COMMIT;`),
    /top-level transaction control/);
  assert.throws(() => assertMigrationSql("select $tag$COMMIT;$tag$; END;"), /transaction control/);
});

test("fails closed for malformed or ambiguous lexical forms", () => {
  for (const sql of ["select 'unfinished", 'select "unfinished', "/* unfinished", "select $tag$unfinished"]) {
    assert.throws(() => assertMigrationSql(sql), /unterminated/);
  }
  assert.throws(() => assertMigrationSql(String.raw`select 'ambiguous\' ; COMMIT; -- '`), /ambiguous backslash/);
});

test("all historical migrations 0001 through 0008 pass fresh-database lexical preflight", () => {
  const directory = new URL("../../db/migrations/", import.meta.url);
  const names = readdirSync(directory).filter((name) => /^000[1-8]_.*\.sql$/.test(name));
  assert.equal(names.length, 8);
  for (const name of names) assert.doesNotThrow(() =>
    assertMigrationSql(readFileSync(new URL(name, directory), "utf8")), name);
});
