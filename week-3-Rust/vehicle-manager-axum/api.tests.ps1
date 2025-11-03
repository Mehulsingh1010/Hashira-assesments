Invoke-RestMethod -Uri "httplocalhost:3000/vehicle"
Invoke-RestMethod -Uri "httplocalhost:3000/vehicle" -Method Get 
Invoke-RestMethod -Uri "httplocalhost:3000/vehicle" -Method Post

$Params = @{
    Uri         = 'http://localhost:3000/vehicle'
    Method      = 'Post'
    Body        = (@{
        manufacturer = 'Tesla'
        model        = 'Model Y'
        year         = 2020
    } | ConvertTo-Json)
    ContentType = 'application/json'
}

Invoke-RestMethod @Params
