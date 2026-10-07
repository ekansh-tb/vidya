import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks=vi.hoisted(()=>({identity:vi.fn(),configured:vi.fn(),origin:vi.fn(),load:vi.fn(),save:vi.fn()}));
vi.mock("@/lib/auth/session",()=>({requireLearnerFrom:mocks.identity}));
vi.mock("@/lib/db/client",()=>({dbConfigured:mocks.configured}));
vi.mock("@/lib/api/guard",()=>({isSameOrigin:mocks.origin}));
vi.mock("@/lib/planning/service",()=>({loadPlanResponse:mocks.load,savePlanResponse:mocks.save,planResponse:(body:unknown,status=200)=>Response.json(body,{status,headers:{"Cache-Control":"private, no-store"}})}));
import { GET, PUT } from "./route";
beforeEach(()=>{vi.clearAllMocks();mocks.configured.mockReturnValue(true);mocks.origin.mockReturnValue(true);mocks.identity.mockResolvedValue({learner:{id:"authenticated-device-learner"}});mocks.load.mockResolvedValue(Response.json({}));mocks.save.mockResolvedValue(Response.json({}));});
describe("learner plan endpoint identity",()=>{
 it("does not substitute parent or anonymous access for a revoked learner",async()=>{mocks.identity.mockResolvedValue(null);expect((await GET(new Request("https://vidya.example/plan",{headers:{"x-vidya-device":"revoked"}}))).status).toBe(401);expect((await PUT(new Request("https://vidya.example/plan",{method:"PUT"}))).status).toBe(401);expect(mocks.load).not.toHaveBeenCalled();expect(mocks.save).not.toHaveBeenCalled();});
 it("uses authenticated learner instead of client-selected placement",async()=>{const req=new Request("https://vidya.example/plan",{method:"PUT",body:JSON.stringify({learnerId:"another",grade:5})});await PUT(req);expect(mocks.identity).toHaveBeenCalledWith(req);expect(mocks.save).toHaveBeenCalledWith(req,{id:"authenticated-device-learner"});});
 it("rejects cross-origin writes",async()=>{mocks.origin.mockReturnValue(false);expect((await PUT(new Request("https://other.example/plan",{method:"PUT"}))).status).toBe(403);expect(mocks.identity).not.toHaveBeenCalled();});
});
