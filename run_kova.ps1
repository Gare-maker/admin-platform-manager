# ==============================================================================
# KOVA ADMIN DASHBOARD - Local Development HTTP Server
# Serves static files and provides SPA fallback on port 8080
# ==============================================================================
param(
    [int]$Port = 8080
)

$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host "   KOVA ADMIN DASHBOARD RUNNING AT: $prefix" -ForegroundColor Green
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C in this console window to stop the server.`n"

    $baseDir = $PSScriptRoot

    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $rawUrl = [System.Uri]::UnescapeDataString($request.Url.LocalPath)
            if ($rawUrl -eq "/" -or [string]::IsNullOrWhiteSpace($rawUrl)) {
                $rawUrl = "/index.html"
            }

            $localPath = Join-Path $baseDir ($rawUrl.TrimStart('/').Replace('/', '\'))

            # SPA Fallback: If requested path does not exist, serve index.html
            if (-not (Test-Path $localPath -PathType Leaf)) {
                $localPath = Join-Path $baseDir "index.html"
            }

            if (Test-Path $localPath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
                $contentType = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".json" { "application/json; charset=utf-8" }
                    ".svg"  { "image/svg+xml" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".jpeg" { "image/jpeg" }
                    ".webp" { "image/webp" }
                    ".ico"  { "image/x-icon" }
                    ".woff" { "font/woff" }
                    ".woff2" { "font/woff2" }
                    ".ttf"  { "font/ttf" }
                    default { "application/octet-stream" }
                }
                $response.ContentType = $contentType
                $bytes = [System.IO.File]::ReadAllBytes($localPath)
                $response.ContentLength64 = $bytes.Length

                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
                $response.StatusCode = 200
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.ContentLength64 = $msg.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($msg, 0, $msg.Length)
                }
            }
            $response.Close()
        } catch {
            try { $response.Close() } catch {}
        }
    }
} finally {
    $listener.Stop()
}
