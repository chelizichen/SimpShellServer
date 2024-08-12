const path = require('path')
const yaml = require('js-yaml')
const { readFileSync } = require('fs')
function parseSimpConf(p) {
  const isProd = process.env.SIMP_PRODUCTION === "Yes";
  const cwd = process.cwd();
  const rootPath = isProd ? process.env.SIMP_SERVER_PATH : cwd;
  const fileName = isProd ? "simpProd.yaml" : p || "simp.yaml";
  const confPath = path.join(rootPath, fileName);
  const content = readFileSync(confPath, "utf-8");
  const conf = yaml.load(content);
  return conf;
}

function NewSimpHttpServer(ctx) {
  const SGRID_TARGET_PORT = process.env.SGRID_TARGET_PORT;
  const conf = parseSimpConf('simp.yaml');
  const SIMP_SERVER_PORT = conf.server.port
  const port = Number(SGRID_TARGET_PORT) || Number(SIMP_SERVER_PORT)
  ctx.listen(port, function () {
    console.log("server started at localhost:" + port);
  });
}

module.exports = {
  parseSimpConf,
  NewSimpHttpServer
};
