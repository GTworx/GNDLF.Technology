<#
    GNDLF Technologies — kurumsal web sitesini KENDİ GitHub reposuna taşır.
    PowerShell'de bu klasörün (gndlf-website) içinden çalıştırın:

        cd gndlf-website
        .\create-repo.ps1

    Gereksinim: git. GitHub CLI (gh) kuruluysa repo otomatik oluşturulur ve
    push edilir. gh yoksa, script commit'i hazırlar; repoyu web'den açıp
    remote ekleyip push etmeniz için komutları yazdırır.

    Not: Yürütme politikası engellerse:
        powershell -ExecutionPolicy Bypass -File .\create-repo.ps1
#>

$ErrorActionPreference = 'Stop'

$RepoName = 'gndlf-website'
$Owner    = 'oya-paktas'
$Private  = $true   # gizli repo. Herkese açık isterseniz $false yapın.

# --- git kontrolü ---
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error 'git bulunamadı. Önce Git for Windows kurun: https://git-scm.com/download/win'
    return
}

# --- yerel repo hazırla ---
if (-not (Test-Path '.git')) {
    git init | Out-Null
    git branch -M main
}
git add -A
# değişiklik varsa commit'le
git diff --cached --quiet 2>$null
if ($LASTEXITCODE -ne 0) {
    git commit -m 'GNDLF Technologies kurumsal web sitesi (TR/EN)' | Out-Null
    Write-Host 'Yerel commit oluşturuldu.' -ForegroundColor Green
} else {
    Write-Host 'Commit edilecek yeni değişiklik yok.' -ForegroundColor Yellow
}

# --- GitHub CLI varsa: repo oluştur + push ---
if (Get-Command gh -ErrorAction SilentlyContinue) {
    $vis = if ($Private) { '--private' } else { '--public' }
    Write-Host "GitHub CLI bulundu. $Owner/$RepoName oluşturuluyor..." -ForegroundColor Cyan
    gh repo create "$Owner/$RepoName" $vis --source=. --remote=origin --push
    Write-Host "Bitti → https://github.com/$Owner/$RepoName" -ForegroundColor Green
}
else {
    Write-Host ''
    Write-Host 'GitHub CLI (gh) kurulu değil. İki seçenek:' -ForegroundColor Yellow
    Write-Host '  1) gh kurun (https://cli.github.com) ve bu scripti tekrar çalıştırın, veya'
    Write-Host '  2) Repoyu web arayüzünden açıp aşağıdaki komutları çalıştırın:'
    Write-Host ''
    Write-Host "     https://github.com/new  →  ad: $RepoName  (Private), README/gitignore EKLEMEYİN" -ForegroundColor Cyan
    Write-Host ''
    Write-Host "     git remote add origin https://github.com/$Owner/$RepoName.git"
    Write-Host '     git push -u origin main'
    Write-Host ''
}
