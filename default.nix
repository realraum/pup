{ lib
, buildNpmPackage
, fetchFromGitHub
, makeWrapper
, chromium
, curl
, jq
, gnugrep
, coreutils
, networkmanager
}:

buildNpmPackage rec {
  name = "pup";

  src = ./.;

  npmDepsHash = "sha256-o4bEK2trWHkuw0/BDwIT5C5zXxIJd0aHafQDu/1MZQg=";

  env = {
    PUPPETEER_SKIP_DOWNLOAD = true;
  };

  dontNpmBuild = true;

  nativeBuildInputs = [ makeWrapper ];

  postInstall = ''
    install -D script.sh $out/bin/pup-script
    wrapProgram $out/bin/pup \
      --set PUPPETEER_EXECUTABLE_PATH ${chromium}/bin/chromium
    wrapProgram $out/bin/pup-script \
      --prefix PATH : $out/bin:${lib.makeBinPath [ curl jq gnugrep coreutils networkmanager ]}
  '';
}

