# Push script using GitHub token
$repoUrl = "https://github.com/Valentine59/hush-forms.git"
$token = $env:GH_TOKEN_CONTRACT

# Extract repo URL and add token
$repoWithToken = $repoUrl -replace "https://", "https://$token@"

Write-Host "Pushing to remote repository..." -ForegroundColor Yellow

# Force push to remote
git push $repoWithToken master --force

Write-Host "Push completed!" -ForegroundColor Green

