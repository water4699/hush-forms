# PowerShell script to generate collaborative commits
# Users: UI (Bradley747) and Contract (Valentine59)

# User configurations
$users = @{
    UI = @{
        name = "Bradley747"
        email = "cirbocalamw7@outlook.com"
    }
    Contract = @{
        name = "Valentine59"
        email = "MarshallGraciebwlat@outlook.com"
    }
}

# Conventional commit types for UI
$uiCommitTypes = @("feat", "fix", "style", "refactor", "perf", "test", "chore", "docs")
$uiCommitScopes = @("ui", "frontend", "component", "layout", "hook", "style", "responsive")

# Conventional commit types for Contract
$contractCommitTypes = @("feat", "fix", "refactor", "test", "chore", "docs", "perf")
$contractCommitScopes = @("contract", "solidity", "deploy", "test", "config", "security")

# Commit messages templates
$uiMessages = @(
    "feat(ui): add responsive navigation component",
    "fix(frontend): resolve wallet connection issue",
    "style(component): improve button styling",
    "refactor(hook): optimize encrypted survey hook",
    "perf(ui): reduce re-renders in form components",
    "test(frontend): add component unit tests",
    "chore(ui): update dependencies",
    "docs(frontend): add component documentation",
    "feat(component): implement new survey form",
    "fix(ui): correct form validation logic",
    "style(layout): enhance mobile responsiveness",
    "refactor(hook): simplify encryption flow",
    "perf(component): optimize rendering performance",
    "test(ui): add integration tests",
    "chore(frontend): update build configuration"
)

$contractMessages = @(
    "feat(contract): add new encryption method",
    "fix(solidity): resolve gas optimization issue",
    "refactor(contract): improve code structure",
    "test(contract): add comprehensive test suite",
    "chore(deploy): update deployment scripts",
    "docs(contract): add contract documentation",
    "perf(contract): optimize gas consumption",
    "feat(contract): implement access control",
    "fix(solidity): fix reentrancy vulnerability",
    "refactor(test): improve test coverage",
    "test(contract): add edge case tests",
    "chore(config): update hardhat configuration",
    "docs(solidity): document contract functions",
    "perf(contract): reduce storage costs",
    "feat(deploy): add deployment automation"
)

# Generate random commit times between Nov 1 9:00 and Nov 6 17:00 PST (work hours only)
# Work hours: 9:00-17:00 (8 hours per day)
# Days: Nov 1-6 (6 days)
# Total work hours: 6 days * 8 hours = 48 hours
# We need 30+ commits distributed across these hours

$startDate = Get-Date "2025-11-01 09:00:00"
$endDate = Get-Date "2025-11-06 17:00:00"

# Create array of all work hours (9:00-17:00 each day)
$workHours = @()
for ($day = 1; $day -le 6; $day++) {
    for ($hour = 9; $hour -le 16; $hour++) {
        for ($minute = 0; $minute -lt 60; $minute += 15) {
            $dayStr = "0$day"
            $minStr = $minute.ToString('00')
            $workHours += Get-Date "2025-11-$dayStr $hour`:$minStr`:00"
        }
    }
}

# Randomly select 35 commit times from work hours
$random = New-Object System.Random
$selectedTimes = $workHours | Sort-Object { $random.Next() } | Select-Object -First 35 | Sort-Object

# Randomly alternate between UI and Contract
$currentUser = "UI"
$commits = @()

for ($i = 0; $i -lt $selectedTimes.Count; $i++) {
    $commitTime = $selectedTimes[$i]
    
    # Alternate users randomly (70% chance to switch)
    if ($random.Next(100) -lt 30) {
        $currentUser = if ($currentUser -eq "UI") { "Contract" } else { "UI" }
    }
    
    $user = $users[$currentUser]
    
    # Select random message
    $message = if ($currentUser -eq "UI") {
        $uiMessages[$random.Next($uiMessages.Count)]
    } else {
        $contractMessages[$random.Next($contractMessages.Count)]
    }
    
    $commits += @{
        User = $currentUser
        Name = $user.name
        Email = $user.email
        Message = $message
        Time = $commitTime
    }
}

# Sort commits by time
$commits = $commits | Sort-Object { $_.Time }

Write-Output "Generated $($commits.Count) commits"
Write-Output "UI commits: $(($commits | Where-Object { $_.User -eq 'UI' }).Count)"
Write-Output "Contract commits: $(($commits | Where-Object { $_.User -eq 'Contract' }).Count)"

# Export to JSON for use in git script
$commits | ConvertTo-Json -Depth 10 | Out-File -FilePath "commits.json" -Encoding UTF8

Write-Output "Commits saved to commits.json"

