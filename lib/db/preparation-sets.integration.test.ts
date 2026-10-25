import {randomUUID} from 'node:crypto';
import {beforeAll,afterAll,describe,it,expect} from 'vitest';
import {integrationDatabaseConfigured} from '@/test/integration-database';
import {getSql} from './client';
import {upsertParent,createLearner,getLearnerForParent} from './queries';
import {inviteGuardian,acceptGuardian,removeGuardian} from './guardians';
import {preparationSetsForParent,preparationSetsForLearner,savePreparationSet} from './preparation-sets';
import {starterFor} from '../preparation/starters';
import type {PreparationSet} from '../preparation/contracts';
const suite=integrationDatabaseConfigured()?describe:describe.skip;
const owner=`prep-itest-${randomUUID()}`,co=`${owner}-co`,other=`${owner}-other`,placement={version:1,kind:'school',board:'cbse',grade:6} as const;
suite('private family preparation storage',{timeout:60000},()=>{
 let child:string,record:PreparationSet;
 beforeAll(async()=>{for(const id of [owner,co,other])await upsertParent({id,email:`${id}@example.test`});child=(await createLearner({parentId:owner,name:'Synthetic prep learner',board:'cbse',grade:6})).id;const invite=(await inviteGuardian(owner,child,`${co}@example.test`))!;await acceptGuardian(co,`${co}@example.test`,invite.code);record={version:1,id:randomUUID(),placement,title:'Synthetic set',subject:'Maths',language:'en',questions:starterFor(placement)!.questions,rightsConfirmed:true,archived:false};});
 afterAll(async()=>{await getSql()`delete from parents where id in (${owner},${co},${other})`;});
 it('allows only the two authorized parents to read and save, preserving revisions',async()=>{
  expect(await savePreparationSet(other,child,record,0)).toBe(false);expect(await preparationSetsForParent(other,child)).toEqual([]);
  expect(await savePreparationSet(owner,child,record,0)).toBe(1);expect((await preparationSetsForParent(co,child))[0].revision).toBe(1);
  expect(await savePreparationSet(co,child,{...record,title:'Co-parent edit'},1)).toBe(2);expect(await savePreparationSet(owner,child,record,1)).toBe(false);expect((await preparationSetsForParent(owner,child))[0].set.title).toBe('Co-parent edit');
 });
 it('refuses mismatched placements and keeps archived sets out of learner choices',async()=>{
  const learner=(await getLearnerForParent(owner,child))!;
  expect(await savePreparationSet(owner,child,{...record,placement:{...placement,grade:7}},2)).toBe(false);
  expect(await preparationSetsForLearner({...learner,parentId:other})).toEqual([]);
  expect((await preparationSetsForLearner(learner)).length).toBe(1);
  expect(await savePreparationSet(owner,child,{...record,archived:true},2)).toBe(3);expect(await preparationSetsForLearner(learner)).toEqual([]);expect((await preparationSetsForParent(owner,child))[0].set.archived).toBe(true);
 });
 it('rechecks membership at write time after a previously authorized read',async()=>{
  expect(await getLearnerForParent(co,child)).not.toBeNull();await removeGuardian(owner,child,co);
  expect(await savePreparationSet(co,child,record,3)).toBe(false);expect(await preparationSetsForParent(co,child)).toEqual([]);expect((await preparationSetsForParent(owner,child))[0].revision).toBe(3);
 });
});
