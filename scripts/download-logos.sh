#!/usr/bin/env bash
# Download Thomas Supply brand + partner logos into public/photos
# Run from the project root:   bash scripts/download-logos.sh
set -u
base="https://www.thomassupply.net/images/"
dest="$(dirname "$0")/../public/photos"
mkdir -p "$dest"

# "original_on_site clean_local_name"
map=(
  "I1873_C1873_thomas_logo.png thomas-logo-original.png"
  "I1955_C1955_keeprite.png keeprite.png"
  "I1875_C1875_keeprite-logo.jpg keeprite-equipment.jpg"
  "I1949_C1949_lg-logo.png lg.png"
  "I1950_C1950_russell-logo.png russell.png"
  "I1951_C1951_manitowoclogo.png manitowoc.png"
  "I1952_C1952_glasfloss-color-logo1.jpg glasfloss.jpg"
  "I1953_C1953_diversitech.png diversitech.png"
  "I1954_C1954_fast.jpg fast.jpg"
  "I1956_C1956_icp_logo.PNG icp.png"
  "I1958_C1958_proud_member_of_bluehawk.png bluehawk.png"
)
ok=0; fail=0
for row in "${map[@]}"; do
  src="${row%% *}"; out="${row##* }"
  if curl -fsSL "${base}${src}" -o "${dest}/${out}"; then
    echo "OK   ${out}"; ok=$((ok+1))
  else
    echo "FAIL ${src}"; fail=$((fail+1))
  fi
done
echo ""
echo "Done. ${ok} downloaded, ${fail} failed. Files are in public/photos/"
