# PowerShell script to configure DeepSeek for Claude Code
# Usage: Run in PowerShell with ExecutionPolicy bypass:
#   powershell -ExecutionPolicy Bypass -File .\scripts\setup-deepseek.ps1

$profilePath = $PROFILE
if (!(Test-Path -Path $profilePath)) {
    New-Item -ItemType File -Force -Path $profilePath | Out-Null
}

$lines = @(
    "# DeepSeek / Claude Code settings (added by scripts/setup-deepseek.ps1)",
    "`$env:ANTHROPIC_BASE_URL='https://api.deepseek.com/anthropic'",
    "`$env:ANTHROPIC_AUTH_TOKEN='YOUR_DEEPSEEK_API_KEY_HERE'",
    "`$env:ANTHROPIC_MODEL='deepseek-v4-pro'",
    "`$env:ANTHROPIC_DEFAULT_OPUS_MODEL='deepseek-v4-pro'",
    "`$env:ANTHROPIC_DEFAULT_SONNET_MODEL='deepseek-v4-pro'",
    "`$env:ANTHROPIC_DEFAULT_HAIKU_MODEL='deepseek-v4-flash'",
    "`$env:CLAUDE_CODE_SUBAGENT_MODEL='deepseek-v4-flash'",
    "`$env:CLAUDE_CODE_EFFORT_LEVEL='max'"
)

Add-Content -Path $profilePath -Value $lines

# Export to current session as well
foreach ($line in $lines) {
    if ($line.StartsWith("`$env:")) {
        iex $line
    }
}

Write-Host "DeepSeek environment variables added to profile: $profilePath"
Write-Host "Replace YOUR_DEEPSEEK_API_KEY_HERE with your actual key in the file or run: (Get-Content $profilePath) -replace 'YOUR_DEEPSEEK_API_KEY_HERE','your-real-key' | Set-Content $profilePath"
Write-Host "Reload your profile with: . $profilePath or restart PowerShell to apply permanently."
