$urls = @(
  "http://localhost:5173/",
  "http://localhost:5173/get-aid",
  "http://localhost:5173/give-support",
  "http://localhost:5173/donate",
  "http://localhost:5173/health"
)
$failures = 0
foreach ($u in $urls) {
  try {
    $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 10
    if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 400) {
      Write-Output "OK $u $($r.StatusCode)"
    } else {
      Write-Output "FAIL $u $($r.StatusCode)"
      $failures++
    }
  } catch {
    Write-Output "ERROR $u $_"
    $failures++
  }
}
if ($failures -gt 0) { exit 1 } else { exit 0 }
