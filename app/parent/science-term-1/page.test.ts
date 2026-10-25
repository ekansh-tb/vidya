import {beforeEach,expect,it,vi} from 'vitest';
const m=vi.hoisted(()=>({parent:vi.fn(),redirect:vi.fn()}));
vi.mock('@/lib/auth/session',()=>({requireParent:m.parent}));
vi.mock('next/navigation',()=>({redirect:m.redirect}));
vi.mock('@/components/revision/science-parent-guide',()=>({ScienceParentGuide:()=>null}));
import Page from './page';
beforeEach(()=>{vi.resetAllMocks();m.redirect.mockImplementation(()=>{throw Error('redirect');});});
it('requires parent authority before showing the parent guide',async()=>{m.parent.mockResolvedValue(null);await expect(Page()).rejects.toThrow('redirect');expect(m.redirect).toHaveBeenCalledWith('/parent');});
