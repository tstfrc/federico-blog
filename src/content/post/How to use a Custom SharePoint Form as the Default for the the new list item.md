---
title: "How to use a Custom SharePoint Form as the Default one"
description: ""
publishDate: "2026-01-22T14:27:42.069Z"

tags: ["SharePoint","PnP","List","Gotchas"]
---

# Use a Custom SharePoint Form as the Default "New Item" Form

When creating new list items in SharePoint, you can actually point to a **custom form URL** instead of the default one — and no, I’m not talking about *Power Apps Custom Forms*.  

I’m a huge fan of *Custom Forms*, truly. They’re powerful and flexible, but sometimes they introduce extra complexity in **management, deployment,** and **ALM (Application Lifecycle Management)**.  

If your only goal is to provide a **custom user interface for item creation**, you can skip the Power Platform layer and directly tell SharePoint to use any custom form you like.

---

## Demo Video

<video controls>
  <source src="/Videos/Video1.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>


## Why This Is Useful

Many organizations need lightweight UI customizations — a simpler layout, company branding, specific help text, or prefilled fields — without going full Power Apps.  

By changing a single property, you can make your custom form the **default experience** when users click “Add new item” in a list.

---

## How It Works

Every SharePoint list has one or more **content types**, and each content type includes a property called `NewFormUrl`.  

By default, this property points to the system form (e.g., `NewForm.aspx`). But you can override it with the URL of your own form.

📚 **Official Microsoft documentation:**  
[https://learn.microsoft.com/sharepoint/dev/schema/contenttype-element-newformurl](https://learn.microsoft.com/en-us/dotnet/api/microsoft.sharepoint.client.contenttype.newformurl?view=sharepoint-csom)

---

## Step-by-Step Setup

Follow these steps to configure your list:

1. **Create and customize** your new SharePoint form.  
   This can be a modern page or a static HTML form stored in the same site.
2. **Save the form** and **copy its link** (just the relative URL part).
3. **Run the following commands in PowerShell 7:**

```powershell
# Connect to your SharePoint site interactively
Connect-PnPOnline -Url "https://TENANTNAME.sharepoint.com/sites/SITENAME" -Interactive -ClientId "clientIDToConnectViaPnP"

# Retrieve the list content type
$Ct = Get-PnPContentType -List "LISTNAME" -Identity "Item"

# Set the NewFormUrl property to your custom form
$Ct.NewFormUrl = "SitePages/CustomForm.aspx"

# Apply the update
$Ct.Update($false)
Invoke-PnPQuery