---
title: "Massive Microsoft licenses unassignment"
description: "Massive Microsoft licenses unassignment"
publishDate: "2026-02-17T14:27:42.069Z"

tags: ["M365","Powershell 7","Maintenance","Gotchas"]
---

## The problem

Suppose your organization has been using Microsoft 365 for a while with Microsoft 365 Business Basic licenses, and your company decides to purchase new Microsoft 365 Business Premium licenses. This move allows you to fully leverage the security best practices shared on security baseline.
Now, you are tasked with changing the license for every single user: do you really want to do this manually?

## Solution

You can handle this massively using PowerShell 7 and MS Graph. These are the logical steps to automate the process:
1. Identify the SkuPartNumber and the product you need to remove.
2. Obtain the SkuId associated with the SkuPartNumber you want to remove.
3. Retrieve all users who have that specific SkuID assigned.
4. Remove the license from all these users.

Simple!

## Code

(Note: The following scripts were provided in our conversation history and are not part of the source documents. Please verify them in a test environment before production use.)

Scenario: Bulk removing the “Power Automate Free” license
Here is a practical script to remove the "Power Automate Free" license from all assigned users:

To get started, install the required modules:
```powershell
Install-Module Microsoft.Graph.Users -Scope CurrentUser
Install-Module Microsoft.Graph.Identity.DirectoryManagement -Scope CurrentUser
```

And connect:
```powershell
Connect-MgGraph -Scopes User.ReadWrite.All, Organization.Read.All
```

Find the SkuId for FLOW_FREE (that's the technical name of Power Automate Free)
```powershell
$flowFreeSku = Get-MgSubscribedSku | Where-Object { $_.SkuPartNumber -eq "FLOW_FREE" }
$flowFreeSkuId = $flowFreeSku.SkuId
```

Retrieve all users who have FLOW_FREE assigned
```powershell
$users = Get-MgUser -All -Property Id, DisplayName, AssignedLicenses | Where-Object {
    $_.AssignedLicenses.SkuId -contains $flowFreeSkuId
}

Write-Host "Users found with FLOW_FREE: $($users.Count)"

foreach ($user in $users) {
    try {
        $body = @{
            addLicenses    = @()
            removeLicenses = @($flowFreeSkuId)
        }

        Invoke-MgGraphRequest -Method POST `
            -Uri "https://graph.microsoft.com/v1.0/users/$($user.Id)/assignLicense" `
            -Body ($body | ConvertTo-Json) `
            -ContentType "application/json"

        Write-Host "✓ License removed from: $($user.DisplayName)"
    }
    catch {
        Write-Host "✗ Error for $($user.DisplayName): $_" -ForegroundColor Red
    }
}
```

## Conclusion
Stop wasting time on repetitive tasks and start automating your infrastructure today! 🚀

## LinkedIn relative post
https://www.linkedin.com/posts/federicotosetto_are-you-still-removing-hundreds-of-licenses-activity-7429530557304238080-iKNy?utm_source=share&utm_medium=member_desktop&rcm=ACoAACKJlEABegKcSpQKizAvOzyH46f6JvcIZbM