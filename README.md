![Node.js CI](https://github.com/weiserhei/christmas-house/workflows/Node.js%20CI/badge.svg)
![GitHub package.json dependency version (dev dep on branch)](https://img.shields.io/github/package-json/dependency-version/weiserhei/christmas-house/dev/three?style=flat-square)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![GitHub repo size](https://img.shields.io/github/repo-size/weiserhei/christmas-house?style=social)

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/weiserhei/christmas-house?style=flat-square)

# Christmas House (2015)(updated 2019)
My first three.js christmas experiment.

## Demo

![demo](/ogimage.jpg)

http://weiserhei.github.io/christmas-house/dist/

### Quickstart

- `git clone https://github.com/weiserhei/christmas-house.git`
- `npm i`
- delete folder `node_modules/shaderparticle-engine/node_modules/`
- patch SPE-file (`node_modules/shader-particle-engine/build/SPE.min.js`): https://github.com/squarefeet/ShaderParticleEngine/pull/132
- `npm run dev`
