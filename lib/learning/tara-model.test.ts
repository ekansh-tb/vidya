import { readFileSync } from "node:fs";
import { ObjectLoader } from "three";
import { expect, it } from "vitest";
it("serialized Tara preserves distinct mesh transforms instead of overlapping all parts at the origin",()=>{
  const tara=new ObjectLoader().parse(JSON.parse(readFileSync(new URL("../../public/learning/tara-model.json",import.meta.url),"utf8")));
  expect(tara.getObjectByName("head")?.position.y).toBeCloseTo(0.78);
  expect(tara.getObjectByName("body")?.scale.x).toBeCloseTo(0.65);
  expect(tara.getObjectByName("wing-1")?.position.x).toBeCloseTo(0.62);
  expect(tara.getObjectByName("DiscoveryBlocks")?.children).toHaveLength(3);
});
