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
for(let i=0;i<5;i++){const angle=(i-2)*0.38;const feather=oval('tail','#78bb94',[Math.sin(angle)*0.9,0.13+Math.cos(angle)*0.52,-0.47],[0.22,0.57,0.1]);feather.rotation.z=-angle;oval('tail-eye','#f3be5a',[Math.sin(angle)*1.02,0.15+Math.cos(angle)*0.85,-0.34],[0.085,0.11,0.04]);}
const blocks=new Group();blocks.name='DiscoveryBlocks';for(let i=0;i<3;i++){const b=new Mesh(new BoxGeometry(0.28,0.28,0.28),new MeshStandardMaterial({color:['#ef987d','#f3be5a','#a8e1cb'][i],roughness:0.65}));b.position.set(0.95+i*0.12,-0.78+i*0.28,0);b.rotation.y=i*0.3;blocks.add(b);}tara.add(blocks);
writeFileSync('public/learning/tara-model.json',JSON.stringify(tara.toJSON()));
