$urls = @(
  'http://localhost:8080/',
  'http://localhost:8080/css/main.css',
  'http://localhost:8080/css/components.css',
  'http://localhost:8080/css/responsive.css',
  'http://localhost:8080/js/data.js',
  'http://localhost:8080/js/store.js',
  'http://localhost:8080/js/chart.js',
  'http://localhost:8080/js/components/subscriptionModal.js',
  'http://localhost:8080/js/components/userModal.js',
  'http://localhost:8080/js/components/reportModal.js',
  'http://localhost:8080/js/components/transactionModal.js',
  'http://localhost:8080/js/components/globalSearch.js',
  'http://localhost:8080/js/views/loginView.js',
  'http://localhost:8080/js/views/dashboardView.js',
  'http://localhost:8080/js/views/usersView.js',
  'http://localhost:8080/js/views/reportsView.js',
  'http://localhost:8080/js/app.js',
  'http://localhost:8080/assets/images/kova_logo.png'
)

$allPassed = $true
foreach ($u in $urls) {
  try {
    $r = Invoke-WebRequest -Uri $u -UseBasicParsing
    if ($r.StatusCode -eq 200) {
      Write-Host "PASS 200: $u" -ForegroundColor Green
    } else {
      Write-Host "WARN $($r.StatusCode): $u" -ForegroundColor Yellow
      $allPassed = $false
    }
  } catch {
    Write-Host "FAIL: $u - $($_.Exception.Message)" -ForegroundColor Red
    $allPassed = $false
  }
}

if ($allPassed) {
  Write-Host "`nALL 18 ASSET ENDPOINTS SERVED STATUS 200 OK!" -ForegroundColor Cyan
}
