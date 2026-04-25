$body = @{
    prenom = "John"
    nom = "Doe"
    email = "test3@test.com"
    password = "password"
    password_confirmation = "password"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/auth/register" -Method POST -Body $body -Headers @{"Content-Type"="application/json"; "Accept"="application/json"}
    Write-Output $response.Content
} catch {
    Write-Output $_.Exception.Response.StatusCode
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $reader.ReadToEnd()
}
