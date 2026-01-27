---
title: "Allow users to see and edit only the files they uploaded themselves"
description: "Allow users to see and edit only the files they uploaded themselves"
publishDate: "2026-01-20T14:27:42.069Z"

tags: ["SharePoint","PnP","List","Gotchas"]
---

## The problem

Microsoft doesn’t allow users to see and edit only the files they uploaded themselves in a Document Library like in the List. There is no out-of-the-box option to turn on this feature like for the List Items.

## Solution

Connect to your SharePoint site vina PnP.
```powershell
Connect-PnPOnline -Url "https://tenantname.sharepoint.com/sites/yoursitename" -ClientID "yourClientID"
```
Setup the ReadSecurity and Write security properties.
```powershell
$docLib = Get-PnPList "YourDocumentLibraryName" -Includes ReadSecurity
$docLib.ReadSecurity = 2
$docLib.WriteSecurity = 2
$docLib.Update()
```

Apply the changes
```powershell
Invoke-PnPQuery
```
---

## Demo Video

<video controls>
  <source src="/Videos/SpecificUserPermissionsDocumentLibrary.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## LinkedIn relative post
https://www.linkedin.com/posts/federicotosetto_why-microsoft-doesnt-allow-users-to-see-activity-7418936537641336832-NulQ?utm_source=share&utm_medium=member_desktop&rcm=ACoAACKJlEABegKcSpQKizAvOzyH46f6JvcIZbM