import {randomBytes,randomUUID} from 'node:crypto';
import {it,describe,expect} from 'vitest';
import {accountLinkTestDatabaseConfigured,connectAccountTestDatabase,type AccountTestClient} from './account-link-test-database';
const suite=accountLinkTestDatabaseConfigured()?describe:describe.skip;
suite('co-parent redemption/removal races',{timeout:60000},()=>{
 it.each(['redeem','remove'] as const)('no credential survives when %s wins first',async winner=>{
  const first=await connectAccountTestDatabase(),second=await connectAccountTestDatabase();
  const run=`guardian-race-${randomUUID()}`,owner=`${run}-owner`,co=`${run}-co`;
  let learner='',pending:Promise<unknown>|undefined;
  try{
   await first.query('insert into parents(id) values($1),($2)',[owner,co]);
   learner=(await first.query("insert into learners(parent_id,name,grade,board) values($1,'Synthetic race',6,'cbse') returning id",[owner])).rows[0].id;
   await first.query('insert into learner_guardians(learner_id,parent_id,invited_by) values($1,$2,$3)',[learner,co,owner]);
   const code=randomBytes(8).toString('hex').toUpperCase(),hash=randomBytes(32).toString('hex');
   await first.query('select * from vidya_issue_guardian_device_code($1,$2,$3,120)',[co,learner,code]);
   const redeem=(db:AccountTestClient)=>db.query('select result from vidya_redeem_guardian_device($1,$2,$3)',[code,hash,'Synthetic race device']);
   const remove=(db:AccountTestClient)=>db.query('select vidya_remove_guardian($1,$2,$3) as result',[owner,learner,co]);
   await first.query('begin');await second.query('begin');
   const pid=(await second.query('select pg_backend_pid() as pid')).rows[0].pid;
   const won=await(winner==='redeem'?redeem(first):remove(first));
   const blocked=winner==='redeem'?remove(second):redeem(second);pending=blocked.catch(()=>undefined);
   let waiting=false;const deadline=Date.now()+4000;
   while(Date.now()<deadline){waiting=(await first.query('select exists(select 1 from pg_locks where pid=$1 and not granted) as waiting',[pid])).rows[0].waiting;if(waiting)break;await new Promise(resolve=>setTimeout(resolve,10));}
   expect(waiting).toBe(true);await first.query('commit');const lost=await blocked;await second.query('commit');
   expect([won.rows[0].result,lost.rows[0].result]).toEqual(winner==='redeem'?['ok',true]:[true,'invalid']);
   expect(Number((await first.query('select count(*) as n from learner_devices where learner_id=$1 and revoked_at is null',[learner])).rows[0].n)).toBe(0);
  }finally{
   await first.query('rollback');await pending;await second.query('rollback');
   await first.query('delete from link_audit where parent_id in($1,$2) or learner_id=$3',[owner,co,learner||null]);
   await first.query('delete from parents where id in($1,$2)',[owner,co]);
   await Promise.all([first.end(),second.end()]);
  }
 });
});
