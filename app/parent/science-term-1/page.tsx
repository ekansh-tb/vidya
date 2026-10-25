import { createElement } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireParent } from '@/lib/auth/session';
import { ScienceParentGuide } from '@/components/revision/science-parent-guide';
import '../family-dashboard.css';
import {scienceMockSchema} from '@/lib/revision/mock-attempts';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams?:Promise<{questions?:string}>}){
 if(!await requireParent())redirect('/parent');
 const raw=(await searchParams)?.questions;
 const parsed=scienceMockSchema.safeParse({id:'11111111-1111-4111-8111-111111111111',createdAt:0,updatedAt:0,index:0,answers:{},questionIds:typeof raw==='string'&&raw.length<150?raw.split(','):[]});
 const questionIds=parsed.success?parsed.data.questionIds:undefined;
 return createElement('main', {className:'parent-dashboard parent-family','data-parent-appearance':'light'},
  createElement('div',{className:'parent-content',style:{maxWidth:900,margin:'auto'}},
   createElement(Link,{href:'/parent',className:'parent-secondary'},'Back to family space'),
   createElement(ScienceParentGuide,{questionIds})));
}
