$ErrorActionPreference = 'Stop'

Write-Host ''
Write-Host 'Meadow Pals voice generator' -ForegroundColor Cyan
Write-Host 'This creates A-Z with Poppy and the nine colors with Doodle.'
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
  Write-Host 'Making Poppy letters (A through Z)...' -ForegroundColor Yellow
  node tools/fish-voice-pack.mjs --config=$voiceConfig --categories=letters --voices=poppy
  if ($LASTEXITCODE -ne 0) { throw 'Poppy letter generation did not finish.' }

  Write-Host ''
  Write-Host 'Making Doodle colors...' -ForegroundColor Yellow
  node tools/fish-voice-pack.mjs --config=$voiceConfig --categories=colors --voices=doodle
  if ($LASTEXITCODE -ne 0) { throw 'Doodle color generation did not finish.' }

  Write-Host ''
  Write-Host 'All 35 voice files are ready.' -ForegroundColor Green
}
finally {
  Pop-Location -ErrorAction SilentlyContinue
  Remove-Item Env:FISH_AUDIO_API_KEY -ErrorAction SilentlyContinue
  if ($keyPointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer)
  }
}
