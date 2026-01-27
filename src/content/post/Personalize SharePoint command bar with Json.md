---
title: "Personalize SharePoint command bar with Json"
description: "Ghost sites in your Microsoft 365 tenant"
publishDate: "2025-12-20T14:27:42.069Z"

tags: ["SharePoint","Pnp","Sites","Gotchas", "Security"]
---

## The problem

In many companies data must be managed only through a specific process (for example via custom PowerAutomate flow) and allowing users, for example, to 𝗳𝗿𝗲𝗲𝗹𝘆 create items in a list can 𝗲𝗮𝘀𝗶𝗹𝘆 𝗯𝗿𝗲𝗮𝗸 𝘁𝗵𝗮𝘁 𝗽𝗿𝗼𝗰𝗲𝘀𝘀.


<img src="/Images/SPOCustomizeCommandBar.jpg" alt="Static image" />

## What to do?

You can manage this scenario with complex solutions, sure, but I think sometimes small declarative customizations can significantly improve governance and user behavior without complexity.

In this case with SharePoint you can easily:
• Hide specific commands
• Change the label of a command
• Reorder commands in the bar
• And more

📄 Here the Microsoft documentation: https://learn.microsoft.com/en-us/sharepoint/dev/declarative-customization/view-commandbar-formatting


## How to?

Below an example of how to hides the “𝗡𝗲𝘄”, “𝗘𝗱𝗶𝘁 𝗶𝗻 𝗴𝗿𝗶𝗱 𝘃𝗶𝗲𝘄”, and “𝗦𝗵𝗮𝗿𝗲” commands in a SharePoint list by formatting a specific view (for example, the “All Items” view).

```json
{
  "commandBarProps": {
    "commands": [
      {
        "key": "new",
        "hide": true
      },
      {
        "key": "editInGridView",
        "hide": true
      },
      {
        "key": "share",
        "hide": true
      }
    ]
  }
}


```

## Conclusion

𝗧𝗵𝗶𝘀 𝗶𝘀 𝗼𝗻𝗹𝘆 𝗮 𝘂𝘀𝗲𝗿 𝗶𝗻𝘁𝗲𝗿𝗳𝗮𝗰𝗲 𝗰𝘂𝘀𝘁𝗼𝗺𝗶𝘇𝗮𝘁𝗶𝗼𝗻.
Ensure that users do not have permissions to create custom views as they could otherwise bypass these UI restrictions.
In a document library context, for example, hiding the “New” button does not fully prevent file creation since users can still add files via drag & drop.

In a SharePoint list context where drag & drop is not supported this approach becomes a 𝗹𝗼𝘄-𝗰𝗼𝘀𝘁, 𝗹𝗼𝘄-𝗶𝗺𝗽𝗮𝗰𝘁, 𝗵𝗶𝗴𝗵-𝘃𝗮𝗹𝘂𝗲 solution.