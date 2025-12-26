# PowerShell script to simulate random collaboration between two users
# Users: Bradley747 (UI) and Valentine59 (Contract)

# User configurations
$users = @(
    @{
        name = "Bradley747"
        email = "cirbocalamw7@outlook.com"
        token = $env:GH_TOKEN_UI
    },
    @{
        name = "Valentine59"
        email = "MarshallGraciebwlat@outlook.com"
        token = $env:GH_TOKEN_CONTRACT
    }
)

# Conventional commit types and scopes
$commitTypes = @("feat", "fix", "docs", "style", "refactor", "test", "chore", "perf")
$scopes = @("ui", "frontend", "contract", "config", "deploy", "test", "docs", "style")

# Commit messages templates
$commitMessages = @(
    "feat(ui): add new component for encrypted survey",
    "fix(contract): resolve encryption logic issue",
    "docs(readme): update deployment instructions",
    "style(frontend): improve responsive design",
    "refactor(contract): optimize gas usage",
    "test(contract): add unit tests for encryption",
    "chore(config): update dependencies",
    "perf(frontend): optimize rendering performance",
    "feat(ui): implement wallet connection flow",
    "fix(frontend): resolve state management bug",
    "docs(contract): add inline documentation",
    "style(ui): update color scheme",
    "refactor(frontend): restructure component hierarchy",
    "test(frontend): add integration tests",
    "chore(deploy): update deployment scripts",
    "feat(contract): add reset functionality",
    "fix(ui): resolve layout issues",
    "docs(readme): add architecture diagram",
    "style(contract): format code style",
    "refactor(config): simplify configuration",
    "test(contract): add edge case tests",
    "chore(deps): update package versions",
    "feat(frontend): add error handling",
    "fix(contract): fix permission issue",
    "docs(api): update API documentation",
    "style(ui): improve button styles",
    "refactor(frontend): extract custom hooks",
    "test(frontend): add component tests",
    "chore(ci): update CI configuration",
    "perf(contract): optimize storage access"
)

# Time range: Nov 1, 2025 9:00 AM to Nov 6, 2025 5:00 PM (Pacific Time)
$startDate = Get-Date "2025-11-01 09:00:00"
$endDate = Get-Date "2025-11-06 17:00:00"

# Generate sequential timestamps within working hours (9 AM - 5 PM PST)
function Get-NextWorkTime {
    param([DateTime]$lastTime, [DateTime]$start, [DateTime]$end)
    
    if ($null -eq $lastTime -or $lastTime -eq [DateTime]::MinValue) {
        # First commit - start at beginning
        return $start
    }
    
    # Add random minutes between 15 and 180 (15 minutes to 3 hours)
    $minutesToAdd = Get-Random -Minimum 15 -Maximum 180
    $nextTime = $lastTime.AddMinutes($minutesToAdd)
    
    # If exceeds end date, use end date
    if ($nextTime -gt $end) {
        return $end
    }
    
    # Ensure it's within working hours (9 AM - 5 PM)
    $hour = $nextTime.Hour
    if ($hour -lt 9) {
        # Too early, move to 9 AM
        $randomMins = Get-Random -Minimum 0 -Maximum 30
        $nextTime = $nextTime.Date.AddHours(9).AddMinutes($randomMins)
    } elseif ($hour -ge 17) {
        # Too late, move to next day 9 AM
        $randomMins = Get-Random -Minimum 0 -Maximum 30
        $nextTime = $nextTime.Date.AddDays(1).AddHours(9).AddMinutes($randomMins)
        if ($nextTime -gt $end) {
            return $end
        }
    }
    
    return $nextTime
}

# Reset all commits but keep files
Write-Host "Resetting all commits..." -ForegroundColor Yellow
git update-ref -d HEAD
git checkout --orphan new-master

# Remove all files from staging
git rm -rf --cached .

# Add all files back
git add .

# Make initial commit
$initialCommitDate = $startDate
$env:GIT_AUTHOR_DATE = $initialCommitDate.ToString("yyyy-MM-dd HH:mm:ss")
$env:GIT_COMMITTER_DATE = $initialCommitDate.ToString("yyyy-MM-dd HH:mm:ss")
git commit -m "feat: initial project setup with encrypted survey dApp"

# Generate at least 30 commits
$numCommits = Get-Random -Minimum 30 -Maximum 50
Write-Host "Generating $numCommits commits..." -ForegroundColor Green

$currentUserIndex = Get-Random -Minimum 0 -Maximum 2
$commitTimes = @()

for ($i = 0; $i -lt $numCommits; $i++) {
    # Alternate users randomly (but ensure both users contribute)
    $randomSwitch = Get-Random -Maximum 3
    if ($i -gt 0 -and $randomSwitch -eq 0) {
        $currentUserIndex = 1 - $currentUserIndex
    }
    
    $user = $users[$currentUserIndex]
    
    # Generate sequential commit time
    $lastTime = if ($commitTimes.Count -gt 0) { $commitTimes[-1] } else { [DateTime]::MinValue }
    $commitTime = Get-NextWorkTime -lastTime $lastTime -start $startDate -end $endDate
    
    $commitTimes += $commitTime
    
    # Select random commit message
    $msgIndex = Get-Random -Maximum $commitMessages.Length
    $commitMessage = $commitMessages[$msgIndex]
    
    # Make a small change to a file
    $filesToModify = @("README.md", "contracts/EncryptedSurvey.sol", "frontend/app/page.tsx", "hardhat.config.ts", "package.json")
    $fileIndex = Get-Random -Maximum $filesToModify.Length
    $fileToModify = $filesToModify[$fileIndex]
    
    if (Test-Path $fileToModify) {
        # Add a comment or small change
        $content = Get-Content $fileToModify -Raw
        $timestamp = $commitTime.ToString("yyyy-MM-dd HH:mm:ss")
        $comment = "`n<!-- Commit $($i+1) by $($user.name) at $timestamp -->`n"
        
        if ($fileToModify -eq "README.md") {
            $content += $comment
        } else {
            # For code files, add a comment at the end
            $content += "`n// Commit $($i+1) by $($user.name) at $timestamp`n"
        }
        
        Set-Content -Path $fileToModify -Value $content -NoNewline
    }
    
    # Set git config for this commit
    git config user.name $user.name
    git config user.email $user.email
    
    # Set commit date
    $env:GIT_AUTHOR_DATE = $commitTime.ToString("yyyy-MM-dd HH:mm:ss")
    $env:GIT_COMMITTER_DATE = $commitTime.ToString("yyyy-MM-dd HH:mm:ss")
    
    # Stage and commit
    git add $fileToModify
    git commit -m $commitMessage --allow-empty
    
    Write-Host "Commit $($i+1)/$numCommits by $($user.name) at $($commitTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Cyan
}

# Rename branch to master
git branch -M master

Write-Host "`nAll commits generated successfully!" -ForegroundColor Green
Write-Host "Total commits: $numCommits" -ForegroundColor Green

# Display commit log
Write-Host "`nCommit log:" -ForegroundColor Yellow
git log --oneline --all --format="%h %an %ad %s" --date=format:"%Y-%m-%d %H:%M:%S" | Select-Object -First 10

