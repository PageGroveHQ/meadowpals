$ErrorActionPreference = 'Stop'

Write-Host ''
Write-Host 'Meadow Pals new learning audio' -ForegroundColor Cyan
Write-Host 'This repairs eight changed English letter associations and creates nine shape names.'
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
  Write-Host 'Repairing the changed Poppy letter clips...' -ForegroundColor Yellow
  node tools/fish-voice-pack.mjs --config=$voiceConfig --categories=letters --voices=poppy --only=G,H,L,N,R,T,W,Y --force=true
  if ($LASTEXITCODE -ne 0) { throw 'Letter audio generation did not finish.' }

  Write-Host ''
  Write-Host 'Creating the nine shape clips...' -ForegroundColor Yellow
  node tools/fish-voice-pack.mjs --config=$voiceConfig --categories=shapes --assigned=true
  if ($LASTEXITCODE -ne 0) { throw 'Shape audio generation did not finish.' }

  Write-Host ''
  Write-Host 'All repaired letter and new shape audio files are ready.' -ForegroundColor Green
}
finally {
  Pop-Location -ErrorAction SilentlyContinue
  Remove-Item Env:FISH_AUDIO_API_KEY -ErrorAction SilentlyContinue
  if ($keyPointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer)
  }
}
