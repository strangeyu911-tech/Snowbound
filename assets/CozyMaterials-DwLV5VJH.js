import{T as e,Wn as t,Y as n,c as r,g as i,lt as a,sn as o}from"./noise-BUuZjVDc.js";var s=new t;function c(e,t,n,r,i,a){let o=2*Math.PI*i/4,c=Math.max(a-2*i,0),l=Math.PI/4;s.copy(t),s[r]=0,s.normalize();let u=.5*o/(o+c),d=1-s.angleTo(e)/l;return Math.sign(s[n])===1?d*u:c/(o+c)+u+u*(1-d)}var l=class e extends r{constructor(e=1,n=1,r=1,i=2,a=.1){let o=i*2+1;if(a=Math.min(e/2,n/2,r/2,a),super(1,1,1,o,o,o),this.type=`RoundedBoxGeometry`,this.parameters={width:e,height:n,depth:r,segments:i,radius:a},o===1)return;let s=this.toNonIndexed();this.index=null,this.attributes.position=s.attributes.position,this.attributes.normal=s.attributes.normal,this.attributes.uv=s.attributes.uv;let l=new t,u=new t,d=new t(e,n,r).divideScalar(2).subScalar(a),f=this.attributes.position.array,p=this.attributes.normal.array,m=this.attributes.uv.array,h=f.length/6,g=new t,_=.5/o;for(let t=0,i=0;t<f.length;t+=3,i+=2)switch(l.fromArray(f,t),u.copy(l),u.x-=Math.sign(u.x)*_,u.y-=Math.sign(u.y)*_,u.z-=Math.sign(u.z)*_,u.normalize(),f[t+0]=d.x*Math.sign(l.x)+u.x*a,f[t+1]=d.y*Math.sign(l.y)+u.y*a,f[t+2]=d.z*Math.sign(l.z)+u.z*a,p[t+0]=u.x,p[t+1]=u.y,p[t+2]=u.z,Math.floor(t/h)){case 0:g.set(1,0,0),m[i+0]=c(g,u,`z`,`y`,a,r),m[i+1]=1-c(g,u,`y`,`z`,a,n);break;case 1:g.set(-1,0,0),m[i+0]=1-c(g,u,`z`,`y`,a,r),m[i+1]=1-c(g,u,`y`,`z`,a,n);break;case 2:g.set(0,1,0),m[i+0]=1-c(g,u,`x`,`z`,a,e),m[i+1]=c(g,u,`z`,`x`,a,r);break;case 3:g.set(0,-1,0),m[i+0]=1-c(g,u,`x`,`z`,a,e),m[i+1]=1-c(g,u,`z`,`x`,a,r);break;case 4:g.set(0,0,1),m[i+0]=1-c(g,u,`x`,`y`,a,e),m[i+1]=1-c(g,u,`y`,`x`,a,n);break;case 5:g.set(0,0,-1),m[i+0]=c(g,u,`x`,`y`,a,e),m[i+1]=1-c(g,u,`y`,`x`,a,n)}}static fromJSON(t){return new e(t.width,t.height,t.depth,t.segments,t.radius)}},u=`
  // Quintic interpolation gives continuous slopes at cell boundaries. No
  // animated noise or screen-coordinate pattern can swim beneath the skis.
  float powderHash(vec2 p) {
    vec3 h=fract(vec3(p.x,p.y,p.x)*vec3(.1031,.1030,.0973));
    h+=dot(h,h.yzx+33.33);
    return fract((h.x+h.y)*h.z);
  }
  // x is height in [0,1]; yz is its analytic derivative in the lattice plane.
  vec3 powderNoise(vec2 p) {
    vec2 cell=floor(p), f=fract(p);
    vec2 u=f*f*f*(f*(f*6.-15.)+10.);
    vec2 du=30.*f*f*(f-1.)*(f-1.);
    float a=powderHash(cell), b=powderHash(cell+vec2(1.,0.));
    float c=powderHash(cell+vec2(0.,1.)), d=powderHash(cell+vec2(1.));
    return vec3(mix(mix(a,b,u.x),mix(c,d,u.x),u.y),
      du.x*mix(b-a,d-c,u.y),du.y*mix(c-a,d-b,u.x));
  }
  vec3 powderField(vec2 q) {
    float footprint=max(length(dFdx(q)),length(dFdy(q)));
    mat2 turn=mat2(.8,.6,-.6,.8), unturn=mat2(.8,-.6,.6,.8);
    float driftFade=1.-smoothstep(.28,.85,footprint*.31);
    float packedFade=1.-smoothstep(.22,.7,footprint*2.3);
    float grainFade=1.-smoothstep(.18,.6,footprint*13.5);
    vec3 drift=powderNoise(turn*q*.31+vec2(8.7,2.4));
    vec3 packed=powderNoise(q*2.3+vec2(43.1,19.6));
    vec3 grain=powderNoise(turn*q*13.5+vec2(71.4,26.8));
    // Drifts (metres), soft clumps (decimetres), fine loose grains (centimetres).
    // Slopes are deliberately shallow; deep gray pits would read as rock.
    float pigment=(drift.x-.5)*.078*driftFade
      +(packed.x-.5)*.068*packedFade+(grain.x-.5)*.022*grainFade;
    vec2 slope=(unturn*drift.yz)*(.19*.31*driftFade)
      +packed.yz*(.025*2.3*packedFade)
      +(unturn*grain.yz)*(.0042*13.5*grainFade);
    return vec3(pigment,slope);
  }
`,d=`
  // Coverage is chosen from the untouched geometric normal. Shading grains
  // cannot expose little rock islands or move the snowline as the camera moves.
  float rock=1.-smoothstep(.48,.76,normalize(paintNormal).y+brush(paintWorld)*.018);
  float powderCover=1.-rock;
  float powderLoose=1.;
  // POWDER_GROOM_RESPONSE
  vec3 powderRelief=powderField(paintWorld.xz)*powderLoose;
  diffuseColor.rgb=mix(paintSnow,paintStone,rock);
  diffuseColor.rgb*=1.+powderRelief.x*powderCover+brush(paintWorld)*.012;
  // A gentle cool wash in hollows and warm cream on the uncompressed crests.
  float powderHollow=smoothstep(.006,.035,-powderRelief.x);
  diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.77,.86,.84),powderHollow*.075*powderCover);
`,f=`
  vec3 powderNormalW=normalize(inverseTransformDirection(normal,viewMatrix));
  vec3 powderGradient=vec3(powderRelief.y,0.,powderRelief.z);
  // Project the gradient into the real slope's tangent plane. This works for
  // terrain, snowcaps and instanced snow, without UVs or geometry displacement.
  powderGradient-=powderNormalW*dot(powderGradient,powderNormalW);
  powderNormalW=normalize(powderNormalW-powderGradient*powderCover);
  normal=normalize((viewMatrix*vec4(powderNormalW,0.)).xyz);
`,p=`
  float illumination=dot(outgoingLight,vec3(.2126,.7152,.0722))
    /max(.02,dot(diffuseColor.rgb,vec3(.2126,.7152,.0722)));
  float lit=smoothstep(.28,1.45,illumination);
  vec3 powderLightDir=paintSunDirection;
  // Wide diffuse wrap is a bounded artistic approximation of multiple
  // scattering. Actual light/shadow still controls most of the response.
  float powderWrap=clamp((dot(powderNormalW,powderLightDir)+.36)/1.36,0.,1.);
  float paintLight=mix(lit,powderWrap,.25);
  float stepped=.35*smoothstep(.23,.39,paintLight)
    +.38*smoothstep(.56,.70,paintLight)+.27*smoothstep(.83,.94,paintLight);
  float paintedValue=mix(stepped,smoothstep(.16,.94,paintLight),powderCover*.76);
  vec3 shaded=diffuseColor.rgb*mix(vec3(.67,.79,.80),vec3(.77,.85,.86),powderCover);
  outgoingLight=mix(shaded,diffuseColor.rgb*vec3(1.02,1.01,.965),paintedValue);
`,m={elevation:34,azimuth:330},h=m.elevation*Math.PI/180,g=m.azimuth*Math.PI/180,_=new t(Math.sin(g)*Math.cos(h),Math.sin(h),-Math.cos(g)*Math.cos(h)).normalize(),v={value:_};function y(e){e.sunDir.copy(_),e.sun.position.copy(e.sun.target.position).addScaledVector(_,300),e.hemi.color.set(14215647),e.hemi.groundColor.set(7442312),e.hemi.intensity=1.05,e.sun.color.set(16773075),e.sun.intensity=1.85,e.sun.shadow.radius=2.5}var b={snow:16053223,stone:10204581,pine:7509879,ink:3234912,ice:10279116,wood:12294266,coral:15376514,gold:15252851,mist:13819847,sky:11128253},x=new Uint8Array(256),S=[.31,.44,.61,.79,1];for(let e=0;e<256;e++){let t=e/255,n=Math.min(4,Math.floor(t*5)),r=(n+1)/5,i=Math.max(0,Math.min(1,(t-r+.015)/.03));x[e]=Math.round((S[n]+((S[n+1]??S[n])-S[n])*i)*255)}var C=new e(x,256,1,o);C.minFilter=C.magFilter=n,C.generateMipmaps=!1,C.needsUpdate=!0;var w={value:0};function T(e,t=`plain`,n={}){let r=new a({color:e,gradientMap:C,...n});return r.userData.paintSurface=t,r.onBeforeCompile=e=>{e.uniforms.artTime=w,e.uniforms.paintSnow={value:new i(b.snow)},e.uniforms.paintStone={value:new i(b.stone)},e.uniforms.paintSunDirection=v,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 paintWorld; varying vec3 paintLocal; varying vec3 paintNormal; uniform float artTime;`),t===`foliage`&&(e.vertexShader=e.vertexShader.replace(`#include <begin_vertex>`,`#include <begin_vertex>
      float phase = 0.;
      #ifdef USE_INSTANCING
        phase = instanceMatrix[3].x*.13 + instanceMatrix[3].z*.03;
      #endif
      transformed.x += sin(artTime*.8+phase)*.018*position.y*position.y;
    `)),e.vertexShader=e.vertexShader.replace(`#include <worldpos_vertex>`,`#include <worldpos_vertex>
      vec4 paintP = vec4(transformed,1.);
      #ifdef USE_INSTANCING
        paintP = instanceMatrix * paintP;
      #endif
      paintWorld = (modelMatrix * paintP).xyz;
      paintLocal = position;
      paintNormal = normalize(inverseTransformDirection(transformedNormal,viewMatrix));
    `),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
      varying vec3 paintWorld; varying vec3 paintLocal; varying vec3 paintNormal;
      uniform vec3 paintSnow; uniform vec3 paintStone; uniform vec3 paintSunDirection;
      float brush(vec3 p) { return sin(p.x*.19+p.z*.11)*sin(p.z*.15-p.y*.12); }
      float pigmentHash(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
      float pigment(vec3 p){
        vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(mix(pigmentHash(i),pigmentHash(i+vec3(1,0,0)),f.x),mix(pigmentHash(i+vec3(0,1,0)),pigmentHash(i+vec3(1,1,0)),f.x),f.y),
          mix(mix(pigmentHash(i+vec3(0,0,1)),pigmentHash(i+vec3(1,0,1)),f.x),mix(pigmentHash(i+vec3(0,1,1)),pigmentHash(i+vec3(1,1,1)),f.x),f.y),f.z);
      }
      ${t===`snow`?u:``}
    `);let n=t===`snow`?d:t===`stone`?`
      float cap = smoothstep(.46,.78,paintNormal.y+brush(paintWorld)*.06);
      diffuseColor.rgb = mix(diffuseColor.rgb,paintSnow,cap);
      float wash=pigment(paintWorld*.22);
      diffuseColor.rgb *= 1.+brush(paintWorld)*.055 + (wash-.5)*.09;
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.59,.70,.60),smoothstep(.54,.9,wash)*.09*(1.-cap));
    `:t===`ice`?`
      float flow=paintWorld.y*.43 + paintWorld.z*.025 + sin(paintWorld.x*.22)*.8;
      float streak = smoothstep(.84,.99,sin(flow));
      diffuseColor.rgb = mix(diffuseColor.rgb,paintSnow,streak*.24);
      float mineral=pigment(paintWorld*.12+vec3(sin(paintWorld.y*.12)));
      diffuseColor.rgb*=1.+(mineral-.5)*.085;
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.78,.86,.75),smoothstep(.64,.91,mineral)*.12);
    `:t===`cloud`?`
      float wash=pigment(paintWorld*.12);
      diffuseColor.rgb*=1.+(wash-.5)*.024;
      diffuseColor.rgb=mix(diffuseColor.rgb,paintSnow,smoothstep(.40,.86,paintNormal.y)*.12);
    `:t===`wood`?`
      float grain=sin(paintLocal.x*28.+sin(paintLocal.y*3.+paintLocal.z*2.)*1.6);
      float grainFade=1.-smoothstep(.25,1.1,fwidth(paintLocal.x*28.));
      diffuseColor.rgb*=1.+grain*.04*grainFade+(pigment(paintLocal*4.)-.5)*.045;
    `:t===`fabric`?`
      vec2 stitch=paintLocal.xy*185.;
      float textileFade=1.-smoothstep(.25,1.25,max(length(fwidth(stitch)),.0));
      float weave=sin(stitch.x+sin(stitch.y)*.4)*sin(stitch.y);
      diffuseColor.rgb*=1.+weave*.025*textileFade;
      diffuseColor.rgb*=1.+sin(paintLocal.y*17.+paintLocal.z*3.)*.018;
    `:t===`foliage`?`diffuseColor.rgb*=1.+(pigment(paintWorld*.7)-.5)*.085;`:``;e.fragmentShader=e.fragmentShader.replace(`#include <color_fragment>`,`#include <color_fragment>
`+n),t===`snow`&&(e.fragmentShader=e.fragmentShader.replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
`+f)),e.fragmentShader=e.fragmentShader.replace(`#include <opaque_fragment>`,`
      ${t===`snow`?p:`
      // Transfer real light and shadow into a painter's restricted value range.
      // Shadows remain colored and airy instead of turning snow gray or muddy.
      float illumination=dot(outgoingLight,vec3(.2126,.7152,.0722))/max(.02,dot(diffuseColor.rgb,vec3(.2126,.7152,.0722)));
      float paintLight=smoothstep(.28,1.45,illumination);
      float softVolume=.5+.5*dot(normalize(paintNormal),paintSunDirection);
      paintLight=mix(paintLight,softVolume,${t===`cloud`?`.36`:`.22`});
      // Broad, softened paint values keep sculpted shapes readable without plastic highlights.
      float paintedValue=.35*smoothstep(.23,.39,paintLight)+.38*smoothstep(.56,.70,paintLight)+.27*smoothstep(.83,.94,paintLight);
      outgoingLight=mix(diffuseColor.rgb*vec3(${t===`cloud`?`.85,.91,.92`:t===`stone`?`.60,.72,.73`:`.64,.76,.77`}),diffuseColor.rgb*vec3(1.02,1.01,.955),paintedValue);
      `}
      #include <opaque_fragment>
    `)},r.customProgramCacheKey=()=>`cozy-painted-${t}-v5`,r}export{y as a,m as i,w as n,_ as o,T as r,l as s,b as t};