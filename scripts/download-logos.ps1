# Download Thomas Supply brand + partner logos into public/photos
# Run from the project root in PowerShell:   ./scripts/download-logos.ps1
# (You have permission to use these brand logos.)

$ErrorActionPreference = "Stop"
$base = "https://www.thomassupply.net/images/"
$dest = Join-Path $PSScriptRoot "..\public\photos"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

# original filename on the site  =>  clean local filename
$files = [ordered]@{
  "I1873_C1873_thomas_logo.png"            = "thomas-logo-original.png"
  "I1955_C1955_keeprite.png"               = "keeprite.png"
  "I1875_C1875_keeprite-logo.jpg"          = "keeprite-equipment.jpg"
  "I1949_C1949_lg-logo.png"                = "lg.png"
  "I1950_C1950_russell-logo.png"           = "russell.png"
  "I1951_C1951_manitowoclogo.png"          = "manitowoc.png"
  "I1952_C1952_glasfloss-color-logo1.jpg"  = "glasfloss.jpg"
  "I1953_C1953_diversitech.png"            = "diversitech.png"
  "I1954_C1954_fast.jpg"                    = "fast.jpg"
  "I1956_C1956_icp_logo.PNG"               = "icp.png"
  "I1958_C1958_proud_member_of_bluehawk.png" = "bluehawk.png"
}

$ok = 0; $fail = 0
foreach ($src in $files.Keys) {
  $out = Join-Path $dest $files[$src]
  try {
    Invoke-WebRequest -Uri ($base + $src) -OutFile $out -UseBasicParsing
    Write-Host ("OK   " + $files[$src]) -ForegroundColor Green
    $ok++
  } catch {
    Write-Host ("FAIL " + $src + "  -> " + $_.Exception.Message) -ForegroundColor Yellow
    $fail++
  }
}
Write-Host ""
Write-Host ("Done. $ok downloaded, $fail failed. Files are in public/photos/") -ForegroundColor Cyan
