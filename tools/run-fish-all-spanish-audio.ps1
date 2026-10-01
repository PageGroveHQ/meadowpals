$ErrorActionPreference = 'Stop'

Write-Host ''
Write-Host 'Meadow Pals complete Spanish voice pack' -ForegroundColor Cyan
Write-Host 'This creates 156 native-Spanish clips for numbers, letters, colors, shapes, and First Words.'
Write-Host 'Existing Spanish clips are replaced; English clips are never changed.'
Write-Host 'Your Fish Audio key stays hidden and is not saved.'
Write-Host ''

$secureKey = Read-Host 'Paste your Fish Audio API key' -AsSecureString
$keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)

try {
  $env:FISH_AUDIO_API_KEY = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
  $projectRoot = Split-Path -Parent $PSScriptRoot
  Push-Location $projectRoot
  $voiceConfig = 'tools/fish-voices-spanish.json'

  Write-Host ''
  Write-Host 'Creating Spanish numbers, colors, shapes, and all 100 First Words...' -ForegroundColor Yellow
  node tools/fish-voice-pack.mjs --config=$voiceConfig --categories=numbers,colors,shapes,words --assigned=true --language=es --force=true
  if ($LASTEXITCODE -ne 0) { throw 'Spanish learning-area generation did not finish.' }

  Write-Host ''
  Write-Host 'Creating the 27-letter Spanish alphabet...' -ForegroundColor Yellow
  node tools/fish-voice-pack.mjs --config=$voiceConfig --categories=lettersEs --assigned=true --language=es --force=true
  if ($LASTEXITCODE -ne 0) { throw 'Spanish alphabet generation did not finish.' }

  Write-Host ''
  Write-Host 'All 156 native-Spanish Meadow Pals audio files are ready.' -ForegroundColor Green
}
finally {
  Pop-Location -ErrorAction SilentlyContinue
  Remove-Item Env:FISH_AUDIO_API_KEY -ErrorAction SilentlyContinue
  if ($keyPointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer)
  }
}
