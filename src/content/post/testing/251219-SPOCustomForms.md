

---
title: 'Point a custom SharePoint form to the "Add new item" button'
description: "Use a custom SharePoint form as the default 'Add new item' form by updating the ContentType.NewFormUrl property."
publishDate: "19 December 2025"
tags: ["sharepoint", "list", "pnp", "powershell", "forms"]
draft: false
---

If you've built a custom SharePoint form but don't want to manage a full Power Apps solution, you can still point the list's **Add new item** button to your custom form.

This approach changes the `ContentType.NewFormUrl` property for a list content type so the default "New" action opens your custom form URL.

See Microsoft's docs for the `ContentType.NewFormUrl` property for more details: https://learn.microsoft.com/en-us/dotnet/api/microsoft.sharepoint.client.contenttype.newformurl?view=sharepoint-csom

## When to use this

- Quick custom UI for creating items without the overhead of Power Platform and ALM
- Simple custom forms that don't require complex business logic

Not recommended when you need advanced validation or complex logic — Power Apps or a full Power Platform solution remains the better choice there.

## Steps

1. Create and customize your new SharePoint form on the target list.
2. Save the form and copy the direct URL to the form page (avoid redirect shorteners).
3. Run the following commands using PnP PowerShell (PowerShell 7+):

```powershell
# connect to the site (use your preferred auth method)
Connect-PnPOnline -Url "https://TENANTNAME.sharepoint.com/sites/SITENAME" -Interactive -CliendID "yourApplicationID"

# get the list content type (replace LISTNAME and Identity if different)
$ct = Get-PnPContentType -List "LISTNAME" -Identity "Item"

# set the NewFormUrl to your saved form URL
$ct.NewFormUrl = "linkToTheForm"

# apply the change and execute
$ct.Update($false)
Invoke-PnPQuery
```

## Try it out

After applying the change, click the list's **Add new** (New) button — it should open your custom form URL.

This works great when you just need a custom UI for item creation, but it’s not meant to replace complex business logic handled by Power Apps.

Check the Demo video on my LinkedIn page: 
https://www.linkedin.com/feed/update/urn:li:activity:7407695318173122560/


