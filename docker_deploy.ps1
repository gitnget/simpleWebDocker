# === CONFIG ===
$ImageName   = "myschool-app"
$ProjectID   = "web1-468305"
$Region      = "asia-southeast1"
$RepoName    = "myschool-repo"
$ServiceName = "myschool-service"

# === DERIVED VARIABLES ===
$ImageUri = "$Region-docker.pkg.dev/$ProjectID/$RepoName/$ImageName"

Write-Host "[INFO] Cleaning up old Docker image..." -ForegroundColor Yellow
docker rmi -f $ImageName 2>$null
docker rmi -f $ImageUri 2>$null
docker system prune -f

Write-Host "[INFO] Building Docker image..." -ForegroundColor Yellow
docker build -t $ImageName .

Write-Host "[INFO] Tagging image for Artifact Registry..." -ForegroundColor Yellow
docker tag $ImageName $ImageUri

Write-Host "[INFO] Pushing image to Artifact Registry..." -ForegroundColor Yellow
docker push $ImageUri

Write-Host "[INFO] Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $ServiceName `
  --image=$ImageUri `
  --platform=managed `
  --region=$Region `
  --allow-unauthenticated

Write-Host "[SUCCESS] Deployment complete!" -ForegroundColor Green
