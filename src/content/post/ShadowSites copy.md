---
title: "Personalize SharePoint command bar with Json"
description: "Ghost sites in your Microsoft 365 tenant"
publishDate: "2025-12-20T14:27:42.069Z"

tags: ["SharePoint","Pnp","Sites","Gotchas", "Security"]
---

## The problem

In many companies data must be managed only through a specific process (for example via custom PowerAutomate flow) and allowing users, for example, to 𝗳𝗿𝗲𝗲𝗹𝘆 create items in a list can 𝗲𝗮𝘀𝗶𝗹𝘆 𝗯𝗿𝗲𝗮𝗸 𝘁𝗵𝗮𝘁 𝗽𝗿𝗼𝗰𝗲𝘀𝘀.


<img src="/Images/OrphanedSharePointSites.jpg" alt="Static image" />

## The problem

Microsoft 365 accumulates invisible "technical debt" over time.
Every time a service gets deprecated the old sites could not be automatically deleted. They stay there, with their permissions, sharing links, and content intact.

If you're implementing (or have already implemented) Microsoft 365 Copilot this problem amplifies exponentially.

But I want to give you a practical tip for your environment.

## What to do?

Check if your tenant still has the site for the old "Office 365 Video Portal" service. It might even have external sharing enabled.

---


## How to?

Use PowerShell to list "Portals" type sites:
```powershell
𝗚𝗲𝘁-𝗦𝗣𝗢𝗦𝗶𝘁𝗲 | 𝗪𝗵𝗲𝗿𝗲-𝗢𝗯𝗷𝗲𝗰𝘁 {$_.𝗨𝗿𝗹 -𝗹𝗶𝗸𝗲 "𝗽𝗼𝗿𝘁𝗮𝗹𝘀"}
```

If you get "𝘩𝘵𝘵𝘱𝘴://𝘵𝘦𝘯𝘢𝘯𝘵.𝘴𝘩𝘢𝘳𝘦𝘱𝘰𝘪𝘯𝘵.𝘤𝘰𝘮/𝘱𝘰𝘳𝘵𝘢𝘭𝘴/𝘩𝘶𝘣", dig deeper.

Check the site details:
```powershell
𝗚𝗲𝘁-𝗦𝗣𝗢𝗦𝗶𝘁𝗲 -𝗜𝗱𝗲𝗻𝘁𝗶𝘁𝘆 "𝗵𝘁𝘁𝗽𝘀://𝘁𝗲𝗻𝗮𝗻𝘁.𝘀𝗵𝗮𝗿𝗲𝗽𝗼𝗶𝗻𝘁.𝗰𝗼𝗺/𝗽𝗼𝗿𝘁𝗮𝗹𝘀/𝗵𝘂𝗯" -𝗗𝗲𝘁𝗮𝗶𝗹𝗲𝗱 | 𝗦𝗲𝗹𝗲𝗰𝘁-𝗢𝗯𝗷𝗲𝗰𝘁 𝗨𝗿𝗹, 𝗢𝘄𝗻𝗲𝗿, 𝗦𝗵𝗮𝗿𝗶𝗻𝗴𝗖𝗮𝗽𝗮𝗯𝗶𝗹𝗶𝘁𝘆, 𝗦𝘁𝗼𝗿𝗮𝗴𝗲𝗤𝘂𝗼𝘁𝗮, 𝗦𝘁𝗼𝗿𝗮𝗴𝗲𝗨𝘀𝗮𝗴𝗲𝗖𝘂𝗿𝗿𝗲𝗻𝘁, 𝗟𝗮𝘀𝘁𝗖𝗼𝗻𝘁𝗲𝗻𝘁𝗠𝗼𝗱𝗶𝗳𝗶𝗲𝗱𝗗𝗮𝘁𝗲
```
If "𝗦𝗵𝗮𝗿𝗶𝗻𝗴𝗖𝗮𝗽𝗮𝗯𝗶𝗹𝗶𝘁𝘆" is enabled, disable it immediately:

```powershell
𝗦𝗲𝘁-𝗦𝗣𝗢𝗦𝗶𝘁𝗲 -𝗜𝗱𝗲𝗻𝘁𝗶𝘁𝘆 "𝗵𝘁𝘁𝗽𝘀://𝘁𝗲𝗻𝗮𝗻𝘁.𝘀𝗵𝗮𝗿𝗲𝗽𝗼𝗶𝗻𝘁.𝗰𝗼𝗺/𝗽𝗼𝗿𝘁𝗮𝗹𝘀/𝗵𝘂𝗯" -𝗦𝗵𝗮𝗿𝗶𝗻𝗴𝗖𝗮𝗽𝗮𝗯𝗶𝗹𝗶𝘁𝘆 𝗗𝗶𝘀𝗮𝗯𝗹𝗲𝗱
```
---

## Conclusion

This isn't Microsoft's fault: it's a lack of active governance.
𝘈 𝘴𝘪𝘵𝘦 𝘯𝘰𝘣𝘰𝘥𝘺 𝘬𝘯𝘦𝘸 𝘦𝘹𝘪𝘴𝘵𝘦𝘥.
𝘈 𝘴𝘪𝘵𝘦 𝘯𝘰𝘣𝘰𝘥𝘺 𝘸𝘢𝘴 𝘮𝘰𝘯𝘪𝘵𝘰𝘳𝘪𝘯𝘨.
𝘈 𝘴𝘪𝘵𝘦 𝘵𝘩𝘢𝘵 𝘸𝘢𝘴 𝘢 𝘵𝘪𝘤𝘬𝘪𝘯𝘨 𝘴𝘦𝘤𝘶𝘳𝘪𝘵𝘺 𝘵𝘪𝘮𝘦 𝘣𝘰𝘮𝘣.

Did you know about this?