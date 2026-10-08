$file = "src\app\interview\voice\page.tsx"
$content = Get-Content $file -Raw

$start = $content.IndexOf("                {/* Yuna */}")
$endMarker = "              </div>`r`n            </div>            {/* CANDIDATE VIDEO */}"
$end = $content.IndexOf($endMarker, $start)

if ($start -lt 0 -or $end -lt 0) {
    Write-Host "ERROR: Avatar block could not be located. Nothing changed." -ForegroundColor Red
    exit
}

$newBlock = @"
                {/* ANAM LIVE AVATAR */}
                <video
                  id="anam-video"
                  ref={anamVideoRef}
                  autoPlay
                  playsInline
                  controls={false}
                  className="absolute inset-0 z-10 h-full w-full object-fill"
                />

"@

$content = $content.Substring(0, $start) + $newBlock + $content.Substring($end)

Set-Content $file $content -Encoding UTF8

Write-Host "SUCCESS: Yuna/Interaction display replaced with Anam." -ForegroundColor Green
