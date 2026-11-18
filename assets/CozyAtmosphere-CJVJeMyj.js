import{A as e,B as t,Cn as n,D as r,Et as i,Fn as a,Ln as o,O as s,P as c,Pn as l,T as u,U as d,Un as f,W as p,Wn as m,_ as h,an as g,at as _,bt as v,ct as y,dt as b,g as x,ht as S,it as C,kn as w,l as T,ln as E,m as D,mt as O,n as ee,qn as k,rt as A,u as j,vn as M,yt as N,z as P}from"./noise-BUuZjVDc.js";import{i as F}from"./index-BvESJ31y.js";import{o as te,r as ne,t as re}from"./CozyMaterials-DwLV5VJH.js";var ie=new m,I=new m,L=[0,.22,.78,1],R=class{capacity;points;geo=new j;mat;p0;v0;birth;life;seed;head=0;time=0;carry=0;constructor(t,n,r=1){this.capacity=t,this.p0=new Float32Array(t*3),this.v0=new Float32Array(t*3),this.birth=new Float32Array(t).fill(-100),this.life=new Float32Array(t).fill(1),this.seed=Float32Array.from({length:t},(e,t)=>t*.61803398875%1),this.geo.setAttribute(`position`,new T(this.p0,3).setUsage(e)),this.geo.setAttribute(`vel`,new T(this.v0,3).setUsage(e)),this.geo.setAttribute(`birth`,new T(this.birth,1).setUsage(e)),this.geo.setAttribute(`life`,new T(this.life,1).setUsage(e)),this.geo.setAttribute(`seed`,new T(this.seed,1)),this.mat=new M({uniforms:l.merge([F.fog,{uTime:{value:0},uTex:{value:n},uScale:{value:300},uSize:{value:r}}]),vertexShader:`
        attribute vec3 vel;
        attribute float birth;
        attribute float life;
        attribute float seed;
        uniform float uTime;
        uniform float uScale;
        uniform float uSize;
        varying float vAlpha;
        varying float vSeed;
        #include <fog_pars_vertex>
        void main() {
          float t = max(0.,uTime - birth);
          float k = clamp(t / life, 0.0, 1.0);
          // 空气阻力使雪粉迅速减速并缓慢下落
          float drag = (1.0 - exp(-2.6 * t)) / 2.6;
          vec3 p = position + vel * drag + vec3(0.0, -1.6 * t * t, 0.0);
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          // Fine kicked grains settle quickly; the smaller fraction of powder
          // blooms into a translucent wake instead of opaque cotton balls.
          float mist = step(.68,seed);
          float size = mix(.045+seed*.055, mix(.12,.55,sqrt(k)), mist) * uSize;
          gl_PointSize = (uTime < birth || t > life || mvPosition.z >= -.05) ? 0.0 : min(56.,size * uScale / -mvPosition.z);
          vAlpha = pow(1.0-k, mix(1.5,2.4,mist)) * mix(.7,.22,mist) * smoothstep(0.,.035,t);
          vSeed=seed;
          #include <fog_vertex>
        }`,fragmentShader:`
        uniform sampler2D uTex;
        varying float vAlpha;
        varying float vSeed;
        #include <fog_pars_fragment>
        void main() {
          vec2 p=gl_PointCoord-.5;
          float grain=1.-smoothstep(.26,.49,length(p));
          float a = mix(grain,texture2D(uTex,gl_PointCoord).a,step(.68,vSeed)) * vAlpha;
          if (a < 0.01) discard;
          gl_FragColor = vec4(mix(vec3(.84,.91,.87),vec3(.985,.98,.94),vSeed),a);
          #include <fog_fragment>
        }`,transparent:!0,depthWrite:!1,blending:1,fog:!0}),this.points=new N(this.geo,this.mat),this.points.frustumCulled=!1,this.points.renderOrder=5}setViewportHeight(e,t){this.mat.uniforms.uScale.value=e/(2*Math.tan(t*Math.PI/360))}emit(e,t,n,r,i,a){this.carry+=t*e;let o=Math.floor(this.carry);this.carry-=o;for(let e=0;e<o;e++)this.spawn(n,r,i,a)}burst(e,t,n,r,i){for(let a=0;a<e;a++)this.spawn(t,n,r,i)}spawn(e,t,n,r){let i=this.head;this.head=(this.head+1)%this.capacity;let a=i*3;this.p0[a]=e.x+(Math.random()-.5)*.5,this.p0[a+1]=e.y+Math.random()*.15,this.p0[a+2]=e.z+(Math.random()-.5)*.5;let o=r*(.5+Math.random()*.7);this.v0[a]=t.x*o+(Math.random()-.5)*n,this.v0[a+1]=t.y*o+Math.random()*n*.8+.6,this.v0[a+2]=t.z*o+(Math.random()-.5)*n,this.birth[i]=this.time,this.life[i]=.6+Math.random()*.7,this.dirty=!0}dirty=!1;update(e){if(this.time+=e,this.mat.uniforms.uTime.value=this.time,this.dirty){for(let e of[`position`,`vel`,`birth`,`life`])this.geo.getAttribute(e).needsUpdate=!0;this.dirty=!1}}clear(){this.birth.fill(-100),this.dirty=!0}dispose(){this.geo.dispose(),this.mat.dispose()}},z=class{segments;mesh;geo=new j;mat;pos;birth;head=0;time=0;last=[null,null];lastEdge=[[new m,new m],[new m,new m]];constructor(t,n=7308963,r=.3){this.segments=t,this.pos=new Float32Array(t*8*3),this.birth=new Float32Array(t*8).fill(-1e3);let i=new Float32Array(t*8),a=new Uint32Array(t*18);for(let e=0;e<t;e++){let t=e*8;i.set([-1,-.56,.56,1,-1,-.56,.56,1],t);for(let n=0;n<3;n++){let r=t+n;a.set([r,r+4,r+1,r+1,r+4,r+5],e*18+n*6)}}this.geo.setAttribute(`position`,new T(this.pos,3).setUsage(e)),this.geo.setAttribute(`birth`,new T(this.birth,1).setUsage(e)),this.geo.setAttribute(`crossSection`,new T(i,1)),this.geo.setIndex(new T(a,1)),this.mat=new M({uniforms:l.merge([F.fog,{uTime:{value:0},uColor:{value:new x(n)},uOpacity:{value:r}}]),vertexShader:`
        attribute float birth;
        attribute float crossSection;
        uniform float uTime;
        uniform float uOpacity;
        varying float vA;
        varying float vCross;
        #include <fog_pars_vertex>
        void main() {
          float age = uTime - birth;
          vA = clamp(1.0 - age / 45.0, 0.0, 1.0) * uOpacity;
          vCross=crossSection;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        uniform vec3 uColor;
        varying float vA;
        varying float vCross;
        #include <fog_pars_fragment>
        void main() {
          float edge=abs(vCross);
          // A pressed trough with a raised, softly lit powder lip on each side.
          // The edge disappears into the snow, rather than painting a blue stripe.
          float lip=smoothstep(.35,.63,edge);
          vec3 snow=mix(uColor,vec3(.985,.977,.929),lip);
          float a=vA * (1.-smoothstep(.68,1.,edge)) * mix(.9,.65,lip);
          if(a<.003) discard;
          gl_FragColor = vec4(snow,a);
          #include <fog_fragment>
        }`,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3,fog:!0}),this.mesh=new C(this.geo,this.mat),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1}add(e,t,n,r,i=.7,a){let o=this.last[e];if(o&&o.distanceToSquared(t)>144&&(this.last[e]=null,o=null),o&&o.distanceToSquared(t)<i*i)return;let s=ie.copy(t).addScaledVector(n,r*.5),c=I.copy(t).addScaledVector(n,-r*.5);if(o){let[t,n]=this.lastEdge[e],r=this.head;this.head=(this.head+1)%this.segments;let i=r*24;for(let e=0;e<2;e++){let r=e?c:n,o=e?s:t;for(let t=0;t<4;t++){let n=L[t],s=i+(e*4+t)*3,c=t===0||t===3?.006:.025;this.pos[s]=r.x+(o.x-r.x)*n+(a?.x??0)*c,this.pos[s+1]=r.y+(o.y-r.y)*n+(a?.y??1)*c,this.pos[s+2]=r.z+(o.z-r.z)*n+(a?.z??0)*c}}this.birth.fill(this.time,r*8,r*8+8),this.dirty=!0}this.last[e]=(o??new m).copy(t),this.lastEdge[e][0].copy(s),this.lastEdge[e][1].copy(c)}lift(){this.last[0]=null,this.last[1]=null}dirty=!1;update(e){this.time+=e,this.mat.uniforms.uTime.value=this.time,this.dirty&&=(this.geo.getAttribute(`position`).needsUpdate=!0,this.geo.getAttribute(`birth`).needsUpdate=!0,!1)}clear(){this.birth.fill(-1e3),this.lift(),this.dirty=!0}dispose(){this.geo.dispose(),this.mat.dispose()}},ae=class{capacity;mesh;births;birthAttribute;material;matrix=new A;rotation=new v;point=new m;z=new m(0,0,1);scale=new m(.075,.075,1);head=0;time=0;constructor(t=64){this.capacity=t;let n=new D(1,20);this.births=new Float32Array(t).fill(-100),this.birthAttribute=new d(this.births,1).setUsage(e),n.setAttribute(`imprintBirth`,this.birthAttribute),this.material=new M({uniforms:l.merge([F.fog,{uTime:{value:0}}]),vertexShader:`attribute float imprintBirth; uniform float uTime; varying vec2 vMark; varying float vFade;
      #include <fog_pars_vertex>
      void main(){vMark=position.xy;vFade=max(0.,1.-(uTime-imprintBirth)/18.);
      vec4 mvPosition=modelViewMatrix*instanceMatrix*vec4(position,1.);gl_Position=projectionMatrix*mvPosition;
      #include <fog_vertex>
      }`,fragmentShader:`varying vec2 vMark; varying float vFade;
      #include <fog_pars_fragment>
      void main(){float r=length(vMark);float rim=exp(-pow((r-.69)*11.,2.));
      float indent=1.-smoothstep(.13,.52,r);float alpha=(indent*.26+rim*.16)*(1.-smoothstep(.78,1.,r))*vFade;
      if(alpha<.004)discard;gl_FragColor=vec4(mix(vec3(.52,.69,.65),vec3(.98,.97,.91),rim),alpha);
      #include <fog_fragment>
      }`,transparent:!0,depthWrite:!1,fog:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),this.mesh=new p(n,this.material,t),this.mesh.frustumCulled=!1,this.mesh.renderOrder=2,this.matrix.makeScale(0,0,0);for(let e=0;e<t;e++)this.mesh.setMatrixAt(e,this.matrix)}plant(e,t){this.rotation.setFromUnitVectors(this.z,t),this.point.copy(e).addScaledVector(t,.018),this.matrix.compose(this.point,this.rotation,this.scale),this.mesh.setMatrixAt(this.head,this.matrix),this.births[this.head]=this.time,this.head=(this.head+1)%this.capacity,this.mesh.instanceMatrix.needsUpdate=!0,this.birthAttribute.needsUpdate=!0}update(e){this.time+=e,this.material.uniforms.uTime.value=this.time}clear(){this.births.fill(-100),this.birthAttribute.needsUpdate=!0}dispose(){this.mesh.geometry.dispose(),this.material.dispose(),this.mesh.dispose()}},oe=class{points;mat;time=0;constructor(e,t){let n=new j,r=new Float32Array(e*3),i=new Float32Array(e);for(let t=0;t<e;t++)r[t*3]=Math.random()*60,r[t*3+1]=Math.random()*30,r[t*3+2]=Math.random()*60,i[t]=Math.random();n.setAttribute(`position`,new T(r,3)),n.setAttribute(`seed`,new T(i,1)),this.mat=new M({uniforms:{uTime:{value:0},uCam:{value:new m},uTex:{value:t},uScale:{value:300}},vertexShader:`
        attribute float seed;
        uniform float uTime;
        uniform vec3 uCam;
        uniform float uScale;
        varying float vA;
        void main() {
          vec3 p = position;
          p.y -= uTime * (0.8 + seed * 0.7);
          p.x += uTime * 1.6 + sin(uTime * 0.7 + seed * 30.0) * 0.8;
          p.z += sin(uTime * 0.5 + seed * 17.0) * 0.6;
          vec3 box = vec3(60.0, 30.0, 60.0);
          vec3 rel = mod(p - uCam + box * 0.5, box) - box * 0.5;
          vec4 mv = modelViewMatrix * vec4(uCam + rel, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (0.06 + seed * 0.06) * uScale / -mv.z;
          vA = 0.75 * smoothstep(30.0, 6.0, length(rel));
        }`,fragmentShader:`
        uniform sampler2D uTex;
        varying float vA;
        void main() {
          float a = texture2D(uTex, gl_PointCoord).a * vA;
          if (a < 0.02) discard;
          gl_FragColor = vec4(1.0, 1.0, 1.0, a);
        }`,transparent:!0,depthWrite:!1,blending:2}),this.points=new N(n,this.mat),this.points.frustumCulled=!1}setViewportHeight(e,t){this.mat.uniforms.uScale.value=e/(2*Math.tan(t*Math.PI/360))}update(e,t){this.time+=e,this.mat.uniforms.uTime.value=this.time,this.mat.uniforms.uCam.value.copy(t)}dispose(){this.points.geometry.dispose(),this.mat.dispose()}},se=class{ctx=null;master;windGain;windFilter;skiGain;skiFilter;avalancheGain;carveGain;noiseBuf;volume=.7;muted=!1;paused=!1;get ready(){return!!this.ctx}init(){if(this.ctx){this.ctx.resume();return}let e=window.AudioContext||window.webkitAudioContext;if(!e)return;let t=new e;this.ctx=t,this.master=t.createGain(),this.master.connect(t.destination),this.applyVolume();let n=t.sampleRate*3;this.noiseBuf=t.createBuffer(1,n,t.sampleRate);let r=this.noiseBuf.getChannelData(0),i=0,a=0,o=0,s=0,c=0,l=0,u=0;for(let e=0;e<n;e++){let t=Math.random()*2-1;i=.99886*i+t*.0555179,a=.99332*a+t*.0750759,o=.969*o+t*.153852,s=.8665*s+t*.3104856,c=.55*c+t*.5329522,l=-.7616*l-t*.016898,r[e]=(i+a+o+s+c+l+u+t*.5362)*.11,u=t*.115926}let d=t.createBuffer(1,n,t.sampleRate),f=d.getChannelData(0);for(let e=0;e<n;e++)f[e]=Math.random()*2-1;let p=t.createBufferSource();p.buffer=this.noiseBuf,p.loop=!0,this.windFilter=t.createBiquadFilter(),this.windFilter.type=`bandpass`,this.windFilter.Q.value=.7,this.windFilter.frequency.value=400,this.windGain=t.createGain(),this.windGain.gain.value=.05,p.connect(this.windFilter).connect(this.windGain).connect(this.master),p.start();let m=t.createBufferSource();m.buffer=this.noiseBuf,m.loop=!0;let h=t.createBiquadFilter();h.type=`lowpass`,h.frequency.value=210,this.avalancheGain=t.createGain(),this.avalancheGain.gain.value=0,m.connect(h).connect(this.avalancheGain).connect(this.master),m.start();let g=t.createBufferSource();g.buffer=d,g.loop=!0;let _=t.createBiquadFilter();_.type=`highpass`,_.frequency.value=700,this.skiFilter=t.createBiquadFilter(),this.skiFilter.type=`bandpass`,this.skiFilter.frequency.value=2200,this.skiFilter.Q.value=.6,this.skiGain=t.createGain(),this.skiGain.gain.value=0,g.connect(_).connect(this.skiFilter).connect(this.skiGain).connect(this.master),g.start();let v=t.createBufferSource();v.buffer=d,v.loop=!0,v.playbackRate.value=.7;let y=t.createBiquadFilter();y.type=`bandpass`,y.frequency.value=3800,y.Q.value=1.2,this.carveGain=t.createGain(),this.carveGain.gain.value=0,v.connect(y).connect(this.carveGain).connect(this.master),v.start()}setVolume(e,t){this.volume=e,this.muted=t,this.applyVolume()}setPaused(e){this.paused=e,this.applyVolume()}applyVolume(){if(!this.ctx)return;let e=this.muted||this.paused?0:this.volume;this.master.gain.setTargetAtTime(e,this.ctx.currentTime,.05)}update(e,t,n,r){if(!this.ctx)return;let i=this.ctx.currentTime,a=Math.min(1,e/35);this.windGain.gain.setTargetAtTime(.04+a*a*.5,i,.15),this.windFilter.frequency.setTargetAtTime(300+a*1400,i,.2);let o=t?Math.min(1,e/25):0;this.skiGain.gain.setTargetAtTime(o*.16,i,.06),this.skiFilter.frequency.setTargetAtTime(1500+o*2500,i,.1);let s=t?Math.min(1,n/8+r*Math.min(1,e/6)*.8):0;this.carveGain.gain.setTargetAtTime(s*.22,i,.05)}blip(e,t,n,r,i=0,a){if(!this.ctx)return;let o=this.ctx,s=o.currentTime+i,c=o.createOscillator();c.type=n,c.frequency.setValueAtTime(e,s),a&&c.frequency.exponentialRampToValueAtTime(a,s+t);let l=o.createGain();l.gain.setValueAtTime(1e-4,s),l.gain.exponentialRampToValueAtTime(r,s+.01),l.gain.exponentialRampToValueAtTime(1e-4,s+t),c.connect(l).connect(this.master),c.start(s),c.stop(s+t+.05)}thump(e,t,n){if(!this.ctx)return;let r=this.ctx,i=r.createBufferSource();i.buffer=this.noiseBuf;let a=r.createBiquadFilter();a.type=`lowpass`,a.frequency.value=t;let o=r.createGain(),s=r.currentTime;o.gain.setValueAtTime(e,s),o.gain.exponentialRampToValueAtTime(1e-4,s+n),i.connect(a).connect(o).connect(this.master),i.start(s,Math.random()*2),i.stop(s+n+.05)}land(e){let t=Math.min(1,e/10);this.thump(.25+t*.6,500+t*600,.25+t*.2),this.blip(90,.18,`sine`,.2+t*.3,0,45)}crash(){this.thump(.9,900,.6),this.blip(70,.35,`sine`,.5,0,35)}bump(){this.thump(.35,700,.2)}jump(){this.thump(.12,2500,.12)}checkpoint(){this.blip(880,.18,`triangle`,.18),this.blip(1320,.25,`triangle`,.16,.1)}finish(){[660,880,1100,1320].forEach((e,t)=>this.blip(e,.35,`triangle`,.16,t*.11))}warn(){this.blip(440,.15,`square`,.05)}coin(e=0){this.blip(1e3+Math.min(8,e)*80,.08,`sine`,.07)}updateAvalanche(e){if(!this.ctx)return;let t=Math.max(0,Math.min(1,1-e/240));this.avalancheGain.gain.setTargetAtTime(t*t*.65,this.ctx.currentTime,.15)}ride(){[520,780,1040].forEach((e,t)=>this.blip(e,.17,`triangle`,.13,t*.055))}boost(){this.thump(.28,2200,.22),this.blip(180,.3,`triangle`,.12,0,1e3)}},B={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},V=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},ce=new S(-1,1,1,-1,0,1),le=new class extends j{constructor(){super(),this.setAttribute(`position`,new c([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new c([0,2,0,0,2,0],2))}},H=class{constructor(e){this._mesh=new C(le,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,ce)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},U=class extends V{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof M?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=l.clone(e.uniforms),this.material=new M({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new H(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},ue=class extends V{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},de=class extends V{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},fe=class{constructor(e,n){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),n===void 0){let r=e.getSize(new f);this._width=r.width,this._height=r.height,n=new k(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:t}),n.texture.name=`EffectComposer.rt1`}else this._width=n.width,this._height=n.height;this.renderTarget1=n,this.renderTarget2=n.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new U(B),this.copyPass.material.blending=0,this.timer=new w}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}ue!==void 0&&(r instanceof ue?n=!0:r instanceof de&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new f);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},pe=class extends V{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new x}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},W={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},me=class extends V{constructor(){super(),this.isOutputPass=!0,this.uniforms=l.clone(W.uniforms),this.material=new g({name:W.name,uniforms:this.uniforms,vertexShader:W.vertexShader,fragmentShader:W.fragmentShader}),this._fsQuad=new H(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},h.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},G={name:`GTAOShader`,defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:`x`,SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new f},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new A},cameraProjectionMatrixInverse:{value:new A},cameraWorldMatrix:{value:new A},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new m(-1,-1,-1)},sceneBoxMax:{value:new m(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);

			#ifdef USE_REVERSED_DEPTH_BUFFER
				if (depth <= 0.0) {
					discard;
					return;
				}
			#else
				if (depth >= 1.0) {
					discard;
					return;
				}
			#endif
			
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},K={name:`GTAODepthShader`,defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},q={name:`GTAOBlendShader`,uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function J(e=5){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=Y(t),r=n.length,i=new Uint8Array(r*4);for(let e=0;e<r;++e){let t=n[e],a=2*Math.PI*t/r,o=new m(Math.cos(a),Math.sin(a),0).normalize();i[e*4]=(o.x*.5+.5)*255,i[e*4+1]=(o.y*.5+.5)*255,i[e*4+2]=127,i[e*4+3]=255}let a=new u(i,t,t);return a.wrapS=E,a.wrapT=E,a.needsUpdate=!0,a}function Y(e){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=t*t,r=Array(n).fill(0),i=Math.floor(t/2),a=t-1;for(let e=1;e<=n;){if(i===-1&&a===t?(a=t-2,i=0):(a===t&&(a=0),i<0&&(i=t-1)),r[i*t+a]!==0){a-=2,i++;continue}r[i*t+a]=e++,a++,i--}return r}var X={name:`PoissonDenoiseShader`,defines:{SAMPLES:16,SAMPLE_VECTORS:Z(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new f},cameraProjectionMatrixInverse:{value:new A},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function Z(e,t,n){let r=he(e,t,n),i=`vec3[SAMPLES](`;for(let t=0;t<e;t++){let n=r[t];i+=`vec3(${n.x}, ${n.y}, ${n.z})${t<e-1?`,`:`)`}`}return i}function he(e,t,n){let r=[];for(let i=0;i<e;i++){let a=2*Math.PI*t*i/e,o=(i/(e-1))**n;r.push(new m(Math.cos(a),Math.sin(a),o))}return r}var ge=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let n,r,i,a=.5*(Math.sqrt(3)-1),o=(e+t)*a,s=Math.floor(e+o),c=Math.floor(t+o),l=(3-Math.sqrt(3))/6,u=(s+c)*l,d=s-u,f=c-u,p=e-d,m=t-f,h,g;p>m?(h=1,g=0):(h=0,g=1);let _=p-h+l,v=m-g+l,y=p-1+2*l,b=m-1+2*l,x=s&255,S=c&255,C=this.perm[x+this.perm[S]]%12,w=this.perm[x+h+this.perm[S+g]]%12,T=this.perm[x+1+this.perm[S+1]]%12,E=.5-p*p-m*m;E<0?n=0:(E*=E,n=E*E*this._dot(this.grad3[C],p,m));let D=.5-_*_-v*v;D<0?r=0:(D*=D,r=D*D*this._dot(this.grad3[w],_,v));let O=.5-y*y-b*b;return O<0?i=0:(O*=O,i=O*O*this._dot(this.grad3[T],y,b)),70*(n+r+i)}noise3d(e,t,n){let r,i,a,o,s=(e+t+n)*(1/3),c=Math.floor(e+s),l=Math.floor(t+s),u=Math.floor(n+s),d=1/6,f=(c+l+u)*d,p=c-f,m=l-f,h=u-f,g=e-p,_=t-m,v=n-h,y,b,x,S,C,w;g>=_?_>=v?(y=1,b=0,x=0,S=1,C=1,w=0):g>=v?(y=1,b=0,x=0,S=1,C=0,w=1):(y=0,b=0,x=1,S=1,C=0,w=1):_<v?(y=0,b=0,x=1,S=0,C=1,w=1):g<v?(y=0,b=1,x=0,S=0,C=1,w=1):(y=0,b=1,x=0,S=1,C=1,w=0);let T=g-y+d,E=_-b+d,D=v-x+d,O=g-S+2*d,ee=_-C+2*d,k=v-w+2*d,A=g-1+3*d,j=_-1+3*d,M=v-1+3*d,N=c&255,P=l&255,F=u&255,te=this.perm[N+this.perm[P+this.perm[F]]]%12,ne=this.perm[N+y+this.perm[P+b+this.perm[F+x]]]%12,re=this.perm[N+S+this.perm[P+C+this.perm[F+w]]]%12,ie=this.perm[N+1+this.perm[P+1+this.perm[F+1]]]%12,I=.6-g*g-_*_-v*v;I<0?r=0:(I*=I,r=I*I*this._dot3(this.grad3[te],g,_,v));let L=.6-T*T-E*E-D*D;L<0?i=0:(L*=L,i=L*L*this._dot3(this.grad3[ne],T,E,D));let R=.6-O*O-ee*ee-k*k;R<0?a=0:(R*=R,a=R*R*this._dot3(this.grad3[re],O,ee,k));let z=.6-A*A-j*j-M*M;return z<0?o=0:(z*=z,o=z*z*this._dot3(this.grad3[ie],A,j,M)),32*(r+i+a+o)}noise4d(e,t,n,r){let i=this.grad4,a=this.simplex,o=this.perm,s=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,l,u,d,f,p,m=(e+t+n+r)*s,h=Math.floor(e+m),g=Math.floor(t+m),_=Math.floor(n+m),v=Math.floor(r+m),y=(h+g+_+v)*c,b=h-y,x=g-y,S=_-y,C=v-y,w=e-b,T=t-x,E=n-S,D=r-C,O=w>T?32:0,ee=w>E?16:0,k=T>E?8:0,A=w>D?4:0,j=T>D?2:0,M=+(E>D),N=O+ee+k+A+j+M,P=+(a[N][0]>=3),F=+(a[N][1]>=3),te=+(a[N][2]>=3),ne=+(a[N][3]>=3),re=+(a[N][0]>=2),ie=+(a[N][1]>=2),I=+(a[N][2]>=2),L=+(a[N][3]>=2),R=+(a[N][0]>=1),z=+(a[N][1]>=1),ae=+(a[N][2]>=1),oe=+(a[N][3]>=1),se=w-P+c,B=T-F+c,V=E-te+c,ce=D-ne+c,le=w-re+2*c,H=T-ie+2*c,U=E-I+2*c,ue=D-L+2*c,de=w-R+3*c,fe=T-z+3*c,pe=E-ae+3*c,W=D-oe+3*c,me=w-1+4*c,G=T-1+4*c,K=E-1+4*c,q=D-1+4*c,J=h&255,Y=g&255,X=_&255,Z=v&255,he=o[J+o[Y+o[X+o[Z]]]]%32,ge=o[J+P+o[Y+F+o[X+te+o[Z+ne]]]]%32,_e=o[J+re+o[Y+ie+o[X+I+o[Z+L]]]]%32,ve=o[J+R+o[Y+z+o[X+ae+o[Z+oe]]]]%32,ye=o[J+1+o[Y+1+o[X+1+o[Z+1]]]]%32,Q=.6-w*w-T*T-E*E-D*D;Q<0?l=0:(Q*=Q,l=Q*Q*this._dot4(i[he],w,T,E,D));let $=.6-se*se-B*B-V*V-ce*ce;$<0?u=0:($*=$,u=$*$*this._dot4(i[ge],se,B,V,ce));let be=.6-le*le-H*H-U*U-ue*ue;be<0?d=0:(be*=be,d=be*be*this._dot4(i[_e],le,H,U,ue));let xe=.6-de*de-fe*fe-pe*pe-W*W;xe<0?f=0:(xe*=xe,f=xe*xe*this._dot4(i[ve],de,fe,pe,W));let Se=.6-me*me-G*G-K*K-q*q;return Se<0?p=0:(Se*=Se,p=Se*Se*this._dot4(i[ye],me,G,K,q)),27*(l+u+d+f+p)}_dot(e,t,n){return e[0]*t+e[1]*n}_dot3(e,t,n,r){return e[0]*t+e[1]*n+e[2]*r}_dot4(e,t,n,r,i){return e[0]*t+e[1]*n+e[2]*r+e[3]*i}},_e=class e extends V{constructor(e,n,r=512,i=512,a,o,s){super(),this.width=r,this.height=i,this.clear=!0,this.camera=n,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=J(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new k(this.width,this.height,{type:t,depthBuffer:!1}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new M({defines:Object.assign({},G.defines),uniforms:l.clone(G.uniforms),vertexShader:G.vertexShader,fragmentShader:G.fragmentShader,blending:0,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=+!!this.camera.isPerspectiveCamera,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new y,this.normalMaterial.blending=0,this.pdMaterial=new M({defines:Object.assign({},X.defines),uniforms:l.clone(X.uniforms),vertexShader:X.vertexShader,fragmentShader:X.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new M({defines:Object.assign({},K.defines),uniforms:l.clone(K.uniforms),vertexShader:K.vertexShader,fragmentShader:K.fragmentShader,blending:0}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new M({uniforms:l.clone(B.uniforms),vertexShader:B.vertexShader,fragmentShader:B.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this.blendMaterial=new M({uniforms:l.clone(q.uniforms),vertexShader:q.vertexShader,fragmentShader:q.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:5,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this._fsQuad=new H(null),this._originalClearColor=new x,this.setGBuffer(a?a.depthTexture:void 0,a?a.normalTexture:void 0),o!==void 0&&this.updateGtaoMaterial(o),s!==void 0&&this.updatePdMaterial(s)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,n){e===void 0?(this.depthTexture=new s,this.depthTexture.format=r,this.depthTexture.type=o,this.normalRenderTarget=new k(this.width,this.height,{minFilter:b,magFilter:b,type:t,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0):(this.depthTexture=e,this.normalTexture=n,this._renderGBuffer=!1);let i=+!!this.normalTexture,a=this.depthTexture===this.normalTexture?`w`:`x`;this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=i,this.gtaoMaterial.defines.DEPTH_SWIZZLING=a,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=i,this.pdMaterial.defines.DEPTH_SWIZZLING=a,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&+!!e.screenSpaceRadius!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=+!!e.screenSpaceRadius,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=Z(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(t,n,r){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(t,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(t,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case e.OUTPUT.Off:break;case e.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(t,this.blendMaterial,this.renderToScreen?null:n);break;default:console.warn(`THREE.GTAOPass: Unknown output type.`)}}_renderPass(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_renderOverride(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r=t.clearColor||r,i=t.clearAlpha||i,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(e){(e.isPoints||e.isLine||e.isLine2)&&e.visible&&(e.visible=!1,t.push(e))})}_restoreVisibility(){let e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}_generateNoise(e=64){let t=new ge,n=e*e*4,r=new Uint8Array(n);for(let n=0;n<e;n++)for(let i=0;i<e;i++){let a=n,o=i;r[(n*e+i)*4]=(t.noise(a,o)*.5+.5)*255,r[(n*e+i)*4+1]=(t.noise(a+e,o)*.5+.5)*255,r[(n*e+i)*4+2]=(t.noise(a,o+e)*.5+.5)*255,r[(n*e+i)*4+3]=(t.noise(a+e,o+e)*.5+.5)*255}let o=new u(r,e,e,i,a);return o.wrapS=E,o.wrapT=E,o.needsUpdate=!0,o}};_e.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var ve={name:`FXAAShader`,uniforms:{tDiffuse:{value:null},resolution:{value:new f(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define EDGE_STEP_COUNT 6
		#define EDGE_GUESS 8.0
		#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 4.0
		const float edgeSteps[EDGE_STEP_COUNT] = float[EDGE_STEP_COUNT]( EDGE_STEPS );

		float _ContrastThreshold = 0.0312;
		float _RelativeThreshold = 0.063;
		float _SubpixelBlending = 1.0;

		vec4 Sample( sampler2D  tex2D, vec2 uv ) {

			return texture( tex2D, uv );

		}

		float SampleLuminance( sampler2D tex2D, vec2 uv ) {

			return dot( Sample( tex2D, uv ).rgb, vec3( 0.3, 0.59, 0.11 ) );

		}

		float SampleLuminance( sampler2D tex2D, vec2 texSize, vec2 uv, float uOffset, float vOffset ) {

			uv += texSize * vec2(uOffset, vOffset);
			return SampleLuminance(tex2D, uv);

		}

		struct LuminanceData {

			float m, n, e, s, w;
			float ne, nw, se, sw;
			float highest, lowest, contrast;

		};

		LuminanceData SampleLuminanceNeighborhood( sampler2D tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData l;
			l.m = SampleLuminance( tex2D, uv );
			l.n = SampleLuminance( tex2D, texSize, uv,  0.0,  1.0 );
			l.e = SampleLuminance( tex2D, texSize, uv,  1.0,  0.0 );
			l.s = SampleLuminance( tex2D, texSize, uv,  0.0, -1.0 );
			l.w = SampleLuminance( tex2D, texSize, uv, -1.0,  0.0 );

			l.ne = SampleLuminance( tex2D, texSize, uv,  1.0,  1.0 );
			l.nw = SampleLuminance( tex2D, texSize, uv, -1.0,  1.0 );
			l.se = SampleLuminance( tex2D, texSize, uv,  1.0, -1.0 );
			l.sw = SampleLuminance( tex2D, texSize, uv, -1.0, -1.0 );

			l.highest = max( max( max( max( l.n, l.e ), l.s ), l.w ), l.m );
			l.lowest = min( min( min( min( l.n, l.e ), l.s ), l.w ), l.m );
			l.contrast = l.highest - l.lowest;
			return l;

		}

		bool ShouldSkipPixel( LuminanceData l ) {

			float threshold = max( _ContrastThreshold, _RelativeThreshold * l.highest );
			return l.contrast < threshold;

		}

		float DeterminePixelBlendFactor( LuminanceData l ) {

			float f = 2.0 * ( l.n + l.e + l.s + l.w );
			f += l.ne + l.nw + l.se + l.sw;
			f *= 1.0 / 12.0;
			f = abs( f - l.m );
			f = clamp( f / l.contrast, 0.0, 1.0 );

			float blendFactor = smoothstep( 0.0, 1.0, f );
			return blendFactor * blendFactor * _SubpixelBlending;

		}

		struct EdgeData {

			bool isHorizontal;
			float pixelStep;
			float oppositeLuminance, gradient;

		};

		EdgeData DetermineEdge( vec2 texSize, LuminanceData l ) {

			EdgeData e;
			float horizontal =
				abs( l.n + l.s - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.se - 2.0 * l.e ) +
				abs( l.nw + l.sw - 2.0 * l.w );
			float vertical =
				abs( l.e + l.w - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.nw - 2.0 * l.n ) +
				abs( l.se + l.sw - 2.0 * l.s );
			e.isHorizontal = horizontal >= vertical;

			float pLuminance = e.isHorizontal ? l.n : l.e;
			float nLuminance = e.isHorizontal ? l.s : l.w;
			float pGradient = abs( pLuminance - l.m );
			float nGradient = abs( nLuminance - l.m );

			e.pixelStep = e.isHorizontal ? texSize.y : texSize.x;

			if (pGradient < nGradient) {

				e.pixelStep = -e.pixelStep;
				e.oppositeLuminance = nLuminance;
				e.gradient = nGradient;

			} else {

				e.oppositeLuminance = pLuminance;
				e.gradient = pGradient;

			}

			return e;

		}

		float DetermineEdgeBlendFactor( sampler2D  tex2D, vec2 texSize, LuminanceData l, EdgeData e, vec2 uv ) {

			vec2 uvEdge = uv;
			vec2 edgeStep;
			if (e.isHorizontal) {

				uvEdge.y += e.pixelStep * 0.5;
				edgeStep = vec2( texSize.x, 0.0 );

			} else {

				uvEdge.x += e.pixelStep * 0.5;
				edgeStep = vec2( 0.0, texSize.y );

			}

			float edgeLuminance = ( l.m + e.oppositeLuminance ) * 0.5;
			float gradientThreshold = e.gradient * 0.25;

			vec2 puv = uvEdge + edgeStep * edgeSteps[0];
			float pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
			bool pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++ ) {

				puv += edgeStep * edgeSteps[i];
				pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
				pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			}

			if ( !pAtEnd ) {

				puv += edgeStep * EDGE_GUESS;

			}

			vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
			float nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
			bool nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !nAtEnd; i++ ) {

				nuv -= edgeStep * edgeSteps[i];
				nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
				nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			}

			if ( !nAtEnd ) {

				nuv -= edgeStep * EDGE_GUESS;

			}

			float pDistance, nDistance;
			if ( e.isHorizontal ) {

				pDistance = puv.x - uv.x;
				nDistance = uv.x - nuv.x;

			} else {

				pDistance = puv.y - uv.y;
				nDistance = uv.y - nuv.y;

			}

			float shortestDistance;
			bool deltaSign;
			if ( pDistance <= nDistance ) {

				shortestDistance = pDistance;
				deltaSign = pLuminanceDelta >= 0.0;

			} else {

				shortestDistance = nDistance;
				deltaSign = nLuminanceDelta >= 0.0;

			}

			if ( deltaSign == ( l.m - edgeLuminance >= 0.0 ) ) {

				return 0.0;

			}

			return 0.5 - shortestDistance / ( pDistance + nDistance );

		}

		vec4 ApplyFXAA( sampler2D  tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData luminance = SampleLuminanceNeighborhood( tex2D, texSize, uv );
			if ( ShouldSkipPixel( luminance ) ) {

				return Sample( tex2D, uv );

			}

			float pixelBlend = DeterminePixelBlendFactor( luminance );
			EdgeData edge = DetermineEdge( texSize, luminance );
			float edgeBlend = DetermineEdgeBlendFactor( tex2D, texSize, luminance, edge, uv );
			float finalBlend = max( pixelBlend, edgeBlend );

			if (edge.isHorizontal) {

				uv.y += edge.pixelStep * finalBlend;

			} else {

				uv.x += edge.pixelStep * finalBlend;

			}

			return Sample( tex2D, uv );

		}

		void main() {

			gl_FragColor = ApplyFXAA( tDiffuse, resolution.xy, vUv );

		}`};function ye(e,t=new Set){let n=e=>{if(!(t.has(e)||e.onBeforeRender!==O.prototype.onBeforeRender||e.onBeforeShadow!==O.prototype.onBeforeShadow)){e.updateMatrix(),e.matrixAutoUpdate=!1;for(let t of e.children)n(t)}};n(e)}function Q(e,t){let n=e.matrixWorldAutoUpdate;n&&e.updateMatrixWorld(),e.matrixWorldAutoUpdate=!1;try{t()}finally{e.matrixWorldAutoUpdate=n}}var $=class{scene;composer;ao;fxaa;finish;width=0;height=0;pixelRatio=0;motionBlur=!1;constructor(e,n){this.scene=e;let r=new k(1,1,{type:t});r.samples=2,this.composer=new fe(e.renderer,r),this.composer.addPass(new pe(e.scene,e.camera)),this.ao=new _e(e.scene,e.camera,640,360),this.ao.updateGtaoMaterial({radius:1.25,distanceExponent:2,thickness:.45,scale:.35,samples:8}),this.ao.blendIntensity=.2,this.composer.addPass(this.ao),this.composer.addPass(new me),this.fxaa=new U(ve),this.composer.addPass(this.fxaa),this.finish=new U({uniforms:{tDiffuse:{value:null},pixel:{value:new f},speed:{value:0},blurEnabled:{value:0}},vertexShader:`varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform sampler2D tDiffuse;uniform vec2 pixel;uniform float speed;uniform float blurEnabled;varying vec2 vUv;
      float lum(vec3 c){return dot(c,vec3(.299,.587,.114));}
      void main(){
        vec3 c=texture2D(tDiffuse,vUv).rgb;float l=lum(c),edge=0.;
        edge=max(edge,abs(l-lum(texture2D(tDiffuse,vUv+vec2(pixel.x,0.)).rgb)));
        edge=max(edge,abs(l-lum(texture2D(tDiffuse,vUv+vec2(0.,pixel.y)).rgb)));
        edge=max(edge,abs(l-lum(texture2D(tDiffuse,vUv-vec2(pixel.x,0.)).rgb)));
        edge=max(edge,abs(l-lum(texture2D(tDiffuse,vUv-vec2(0.,pixel.y)).rgb)));
        // Fine colored contour, deliberately below comic-book black outlines.
        c=mix(c,vec3(.23,.39,.36),smoothstep(.09,.28,edge)*.23);
        float paper=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5;
        c+=paper*.003;
        if(blurEnabled>0.){
          vec2 dir=vUv-vec2(.5);float blur=smoothstep(.32,.72,length(dir))*clamp((speed-35.)/25.,0.,1.)*.0025*blurEnabled;
          c=mix(c,texture2D(tDiffuse,vUv-dir*blur).rgb,.22*blurEnabled);
        }
        gl_FragColor=vec4(c,1.);
      }`}),this.composer.addPass(this.finish),this.setQuality(n)}setQuality(e){this.ao.enabled=e===`high`,this.fxaa.enabled=e!==`low`,this.resize()}resize(){let e=this.scene.renderer,t=e.getSize(new f),n=e.getPixelRatio();(t.x!==this.width||t.y!==this.height||n!==this.pixelRatio)&&(n!==this.pixelRatio&&this.composer.setPixelRatio(n),this.composer.setSize(t.x,t.y),this.ao.setSize(Math.round(t.x*n*.5),Math.round(t.y*n*.5)),this.fxaa.uniforms.resolution.value.set(1/(t.x*n),1/(t.y*n)),this.finish.uniforms.pixel.value.set(1/(t.x*n),1/(t.y*n)),this.width=t.x,this.height=t.y,this.pixelRatio=n)}render(e){this.finish.uniforms.speed.value=e,this.finish.uniforms.blurEnabled.value=+!!this.motionBlur,this.scene.renderer.info.autoReset=!1,this.scene.renderer.info.reset(),this.scene.renderer.shadowMap.autoUpdate=!1,this.scene.renderer.shadowMap.needsUpdate=!0,Q(this.scene.scene,()=>this.composer.render())}},be=class{root=new P;constructor(e=1800){let t=new C(new n(1,24,14),new M({side:1,depthWrite:!1,fog:!1,uniforms:{high:{value:new x(re.sky)},low:{value:new x(16116950)}},vertexShader:`varying vec3 ray;void main(){ray=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec3 ray;uniform vec3 high;uniform vec3 low;void main(){float t=smoothstep(-.10,.55,normalize(ray).y);gl_FragColor=vec4(mix(low,high,t),1.);}`}));t.scale.setScalar(e),t.frustumCulled=!1,t.renderOrder=-20,this.root.add(t);let r=new p(new n(1,22,14),ne(16380639,`cloud`,{fog:!1}),60),i=ee(3527),a=new A;for(let e=0;e<60;e++){let t=Math.floor(e/4),n=(t%2?1:-1)*(180+t%5*140)+e%4*21,o=-300-t*90;a.makeScale(26+i()*14,12+i()*13,27+i()*15),a.setPosition(n,120+t%4*35+Math.sin(e*3)*8,o),r.setMatrixAt(e,a)}r.computeBoundingSphere(),this.root.add(r);let o=new C(new n(12,24,16),new _({color:16770224,fog:!1}));o.name=`storybook-sun`,o.position.copy(te).multiplyScalar(1100),this.root.add(o)}update(e){this.root.position.copy(e)}};export{ae as a,oe as c,se as i,$ as n,z as o,ye as r,R as s,be as t};