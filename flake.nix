{
  description = "Agda library on containers";
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  # Flake outputs
  outputs = inputs @ {flake-parts, ...}:
    flake-parts.lib.mkFlake {inherit inputs;} (top: {
      systems = [
        "x86_64-linux" # 64-bit Intel/AMD Linux
        "aarch64-linux" # 64-bit ARM Linux
        "x86_64-darwin" # 64-bit Intel macOS
        "aarch64-darwin" # 64-bit ARM macOS
      ];
      perSystem = {pkgs, ...}: {
        apps.watch = {
          type = "app";
          program = with pkgs;
            writeShellApplication {
              name = "replicad-bun-watch";
              runtimeInputs = [bun];
              text = ''
                bun build ./src/index.ts \
                  --outfile ./dist/bundle.js \
                  --format esm --watch
              '';
            };
        };
        apps.install-deps = {
          type = "app";
          program = with pkgs;
            writeShellApplication {
              name = "replicad-install-deps";
              runtimeInputs = [bun];
              text = ''
                bun install
              '';
            };
        };
      };
    });
}
