import { Group, Mesh, MeshStandardMaterial, SphereGeometry, ConeGeometry, BoxGeometry } from 'three';
import { writeFileSync } from 'node:fs';
const tara = new Group(); tara.name = 'Tara';
const sphere = new SphereGeometry(1, 16, 12);
function oval(name,colour,position,scale){const mesh=new Mesh(sphere,new MeshStandardMaterial({color:colour,roughness:0.8}));mesh.name=name;mesh.position.set(...position);mesh.scale.set(...scale);tara.add(mesh);return mesh;}
oval('body','#248781',[0,-0.05,0],[0.65,0.8,0.48]);
oval('head','#a8e1cb',[0,0.78,0.1],[0.57,0.55,0.48]);
for(const x of [-0.19,0.19]){oval('eye','#164b49',[x,0.87,0.56],[0.055,0.07,0.035]);oval('eye-light','#ffffff',[x-0.015,0.895,0.585],[0.015,0.02,0.008]);}
const beak=new Mesh(new ConeGeometry(0.12,0.23,8),new MeshStandardMaterial({color:'#f3be5a',roughness:0.7}));beak.rotation.x=Math.PI/2;beak.position.set(0,0.67,0.62);tara.add(beak);
for(const side of [-1,1]){const wing=oval(`wing-${side}`,'#5ab7a2',[side*0.62,-0.02,0.04],[0.22,0.48,0.2]);wing.rotation.z=side*0.32;oval('foot','#f3be5a',[side*0.24,-0.82,0.15],[0.19,0.09,0.27]);}
for(let i=0;i<7;i++){const angle=(i-3)*0.36;const feather=oval('tail','#78bb94',[Math.sin(angle)*1.18,0.24+Math.cos(angle)*0.7,-0.55],[0.26,0.8,0.12]);feather.rotation.z=-angle;oval('tail-eye','#246b86',[Math.sin(angle)*1.45,0.28+Math.cos(angle)*1.14,-0.39],[0.095,0.12,0.035]);}
for(let i=-1;i<=1;i++) oval('crest','#248781',[i*0.11,1.4+0.06*(1-Math.abs(i)),0.1],[0.065,0.13,0.055]);
const blocks=new Group();blocks.name='DiscoveryBlocks';for(let i=0;i<3;i++){const b=new Mesh(new BoxGeometry(0.28,0.28,0.28),new MeshStandardMaterial({color:['#ef987d','#f3be5a','#a8e1cb'][i],roughness:0.65}));b.position.set(0.95+i*0.12,-0.78+i*0.28,0);b.rotation.y=i*0.3;blocks.add(b);}tara.add(blocks);
tara.updateMatrixWorld(true);
writeFileSync('public/learning/tara-model-v2.json',JSON.stringify(tara.toJSON()));
