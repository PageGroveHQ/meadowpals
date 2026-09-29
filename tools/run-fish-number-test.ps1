$ErrorActionPreference = 'Stop'

Write-Host ''
Write-Host 'Meadow Pals Fish Audio number test' -ForegroundColor Cyan
Write-Host 'SECURE HIDDEN PROMPT: paste the key only after the prompt below appears.' -ForegroundColor Yellow
$secureKey = Read-Host 'Fish Audio API key' -AsSecureString
$keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)

try {
  $env:FISH_AUDIO_API_KEY = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
  Push-Location (Resolve-Path (Join-Path $PSScriptRoot '..'))
  try {
    $voiceConfig = if (Test-Path 'tools/fish-voices.json') { 'tools/fish-voices.json' } else { 'tools/fish-voices.example.json' }
    node tools/fish-voice-pack.mjs --config=$voiceConfig --categories=numbers
    if ($LASTEXITCODE -ne 0) {
      throw "The Fish Audio generator stopped with exit code $LASTEXITCODE."
    }
  }
  finally {
    Pop-Location
  }
}
finally {
  Remove-Item Env:FISH_AUDIO_API_KEY -ErrorAction SilentlyContinue
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer)
  $secureKey.Dispose()
  Write-Host 'The API key has been removed from this terminal session.' -ForegroundColor Green
}
