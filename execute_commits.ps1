# PowerShell script to execute git commits from commits.json

# Read commits from JSON
$commitsJson = Get-Content "commits.json" -Raw | ConvertFrom-Json

# Get the first commit hash to reset to (or create orphan branch)
$firstCommit = git rev-list --max-parents=0 HEAD 2>$null

if ($firstCommit) {
    Write-Output "Resetting to initial commit: $firstCommit"
    git reset --hard $firstCommit
} else {
    Write-Output "No commits found, creating orphan branch"
    git checkout --orphan temp-branch
    git rm -rf .
}

# Make sure we have some files to commit
if (-not (Test-Path "README.md")) {
    Write-Output "README.md not found, creating it"
    "# Project" | Out-File -FilePath "README.md" -Encoding UTF8
}

# Process each commit
foreach ($commit in $commitsJson) {
    # Parse the date from JSON (PowerShell date format)
    $dateStr = $commit.Time
    if ($dateStr -match 'Date\((\d+)\)') {
        $timestamp = [int64]$matches[1] / 1000
        $commitDate = [DateTimeOffset]::FromUnixTimeSeconds($timestamp).DateTime
    } else {
        $commitDate = [DateTime]::Parse($dateStr)
    }
    
    # Format date for git
    $gitDate = $commitDate.ToString("yyyy-MM-dd HH:mm:ss")
    
    # Set git config for this commit
    git config user.name $commit.Name
    git config user.email $commit.Email
    
    # Make a small change to ensure commit
    $changeFile = if ($commit.User -eq "UI") { "frontend/.gitkeep" } else { "contracts/.gitkeep" }
    $dir = Split-Path $changeFile -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    "$(Get-Date)" | Out-File -FilePath $changeFile -Encoding UTF8 -Append
    
    # Stage the change
    git add $changeFile
    
    # Create commit with specific date
    $env:GIT_AUTHOR_DATE = $gitDate
    $env:GIT_COMMITTER_DATE = $gitDate
    git commit -m $commit.Message --date="$gitDate"
    
    Write-Output "Commit: $($commit.Message) by $($commit.Name) at $gitDate"
}

Write-Output "All commits created successfully"

