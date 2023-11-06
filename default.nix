{ lib
, mkPnpmPackage
, fetchFromGitHub
, makeWrapper
, chromium
, nodejs
}:

mkPnpmPackage rec {
  name = "pup";

  src = ./.;

  distDir = ".gitignore";

  nativeBuildInputs = [
    makeWrapper
    nodejs.pkgs.pnpm
  ];

  PUPPETEER_SKIP_DOWNLOAD = true;

  postInstall = ''
    rm -rf $out
    cp -r $PWD $out
    ls $out
    chmod +x $out/lib/src/bin.js
    makeWrapper $out/lib/src/bin.js $out/bin/pup \
      --set PUPPETEER_EXECUTABLE_PATH ${chromium}/bin/chromium
  '';
}
