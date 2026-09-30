$ErrorActionPreference = 'Stop'

Write-Host ''
Write-Host 'Meadow Pals Spanish voice generator' -ForegroundColor Cyan
Write-Host 'This creates all 100 Spanish First Words using each card''s assigned Meadow Pal.'
Write-Host 'Your Fish Audio key stays hidden and is not saved.'
Write-Host ''

$secureKey = Read-Host 'Paste your Fish Audio API key' -AsSecureString
$keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)

try {
  $env:FISH_AUDIO_API_KEY = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
  $projectRoot = Split-Path -Parent $PSScriptRoot
  Push-Location $projectRoot

  $voiceConfig = 'tools/fish-voices.json'
  if (-not (Test-Path $voiceConfig)) {
    $voiceConfig = 'tools/fish-voices.example.json'
  }

  Write-Host ''
  Write-Host 'Making the 100 Spanish First Words...' -ForegroundColor Yellow
  node tools/fish-voice-pack.mjs --config=$voiceConfig --categories=words --assigned=true --language=es
  if ($LASTEXITCODE -ne 0) { throw 'Spanish First Words generation did not finish.' }

  Write-Host ''
  Write-Host 'All 100 Spanish First Words voice files are ready.' -ForegroundColor Green
}
finally {
  Pop-Location -ErrorAction SilentlyContinue
  Remove-Item Env:FISH_AUDIO_API_KEY -ErrorAction SilentlyContinue
  if ($keyPointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer)
  }
}
