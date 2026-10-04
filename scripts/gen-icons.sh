#!/usr/bin/env bash
# App icons from the official SwipeEd logo (public/brand/swipeed/, from The Equal Lens/Solutions, SWED-125).
# Run from the repo root after the logo changes: scripts/gen-icons.sh   (needs ImageMagick and Google Chrome)
set -e
L=public/brand/swipeed
T=$(mktemp -d)
# Rasterise with headless Chrome: ImageMagick's own SVG reader ignores rotate() transforms, which the logo uses.
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
raster() {  # raster <svg> <png>: 1024 px, transparent where the SVG is
  printf '<!doctype html><html><head><style>html,body{margin:0;background:transparent}img{display:block;width:1024px;height:1024px}</style></head><body><img src="file://%s"></body></html>' "$PWD/$1" > $T/r.html
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --default-background-color=00000000 --window-size=1024,1024 --screenshot="$2" "file://$T/r.html" >/dev/null 2>&1
}
raster $L/logo.svg $T/logo.png
raster $L/logo-white-bg.svg $T/white.png
# "any" icons: the transparent logo
magick $T/logo.png -resize 192x192 public/icon-192.png
magick $T/logo.png -resize 512x512 public/icon-512.png
# maskable: the logo at 72% inside the white square, so Android's mask never clips it
magick -size 512x512 xc:white \( $T/logo.png -resize 368x368 \) -gravity center -composite public/icon-maskable-512.png
# iOS needs an opaque icon
magick $T/white.png -resize 180x180 -alpha remove public/apple-icon.png
# favicon: 16, 32 and 48 px in one file
magick $T/logo.png -define icon:auto-resize=48,32,16 src/app/favicon.ico
# GitHub social preview (upload by hand in the repo's Settings, General, Social preview)
magick -size 1280x640 xc:'#FBF9FF' \( $T/logo.png -resize 440x440 \) -gravity center -composite public/brand/swipeed/social-preview.png
rm -rf $T
echo "icons written"
