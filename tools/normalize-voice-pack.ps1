param(
  [string]$InputRoot = "audio/voice-packs",
  [Parameter(Mandatory = $true)]
  [string]$OutputRoot,
  [double]$TargetLufs = -20,
  [double]$TruePeak = -1.5,
  [string]$Ffmpeg = ""
)

$ErrorActionPreference = "Stop"

$inputPath = (Resolve-Path -LiteralPath $InputRoot).Path
$workspacePath = (Resolve-Path -LiteralPath ".").Path
$outputPath = [IO.Path]::GetFullPath((Join-Path $workspacePath $OutputRoot))

if (-not $Ffmpeg) {
  $ffmpegCommand = Get-Command ffmpeg -ErrorAction SilentlyContinue
  if ($ffmpegCommand) {
    $Ffmpeg = $ffmpegCommand.Source
  } else {
    $Ffmpeg = Join-Path $env:LOCALAPPDATA "JDownloader 2/tools/Windows/ffmpeg/x64/ffmpeg.exe"
  }
}

if (-not (Test-Path -LiteralPath $Ffmpeg -PathType Leaf)) {
  throw "FFmpeg was not found at $Ffmpeg"
}

if ($outputPath -eq $inputPath -or $outputPath.StartsWith($inputPath + [IO.Path]::DirectorySeparatorChar)) {
  throw "OutputRoot must be outside InputRoot so source files cannot be overwritten during processing."
}

New-Item -ItemType Directory -Path $outputPath -Force | Out-Null
$files = @(Get-ChildItem -LiteralPath $inputPath -Filter *.mp3 -File -Recurse | Sort-Object FullName)
if (-not $files.Count) { throw "No MP3 files were found in $inputPath" }

for ($index = 0; $index -lt $files.Count; $index++) {
  $file = $files[$index]
  $relativePath = $file.FullName.Substring($inputPath.Length + 1)
  $destination = Join-Path $outputPath $relativePath
  New-Item -ItemType Directory -Path (Split-Path $destination) -Force | Out-Null

  Write-Host ("[{0}/{1}] {2}" -f ($index + 1), $files.Count, $relativePath)
  $firstPass = & $Ffmpeg -hide_banner -nostats -i $file.FullName -map 0:a:0 -af "loudnorm=I=${TargetLufs}:TP=${TruePeak}:LRA=7:print_format=json" -f null NUL 2>&1 | Out-String
  $jsonMatch = [regex]::Match($firstPass, '(?s)\{\s*"input_i".*?\}')
  if (-not $jsonMatch.Success) { throw "Could not measure $relativePath" }
  $measurement = $jsonMatch.Value | ConvertFrom-Json
  $culture = [Globalization.CultureInfo]::InvariantCulture
  $inputLufs = [Convert]::ToDouble($measurement.input_i, $culture)
  $inputPeak = [Convert]::ToDouble($measurement.input_tp, $culture)
  $loudnessGain = $TargetLufs - $inputLufs
  $peakSafeGain = $TruePeak - $inputPeak
  $gain = [Math]::Min($loudnessGain, $peakSafeGain)
  $gainText = $gain.ToString('0.00', $culture)

  & $Ffmpeg -hide_banner -loglevel error -y -i $file.FullName -map 0:a:0 -map_metadata 0 -af "volume=${gainText}dB" -ar 44100 -b:a 128k -id3v2_version 3 $destination
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $destination -PathType Leaf)) {
    throw "Could not normalize $relativePath"
  }
}

$outputFiles = @(Get-ChildItem -LiteralPath $outputPath -Filter *.mp3 -File -Recurse)
if ($outputFiles.Count -ne $files.Count) {
  throw "Expected $($files.Count) normalized files but found $($outputFiles.Count)."
}

Write-Host "Normalized $($outputFiles.Count) voice files into $outputPath"
