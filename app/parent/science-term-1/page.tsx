import { createElement } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireParent } from '@/lib/auth/session';
import { ScienceParentGuide } from '@/components/revision/science-parent-guide';
import '../family-dashboard.css';
export const dynamic='force-dynamic';
export default async function Page(){
 if(!await requireParent())redirect('/parent');
 return createElement('main', {className:'parent-dashboard parent-family','data-parent-appearance':'light'},
  createElement('div',{className:'parent-content',style:{maxWidth:900,margin:'auto'}},
   createElement(Link,{href:'/parent',className:'parent-secondary'},'Back to family space'),
   createElement(ScienceParentGuide)));
}
