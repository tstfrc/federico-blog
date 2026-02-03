---
title: "Handling SharePoint Custom Forms"
description: "Handling SharePoint Custom Forms"
publishDate: "2025-10-10T14:27:42.069Z"

tags: ["SharePoint","Gotchas","ALM"]
---

## The problem

Many people use them because they are intuitive and easy to use, but what about control?

## Quick Overview

You can create SharePoint Custom forms to easily customize a form for a SharePoint list that works best for your team or organization, for example by setting a field to read-only.
They reside in the list and cannot be found directly in the Power App Maker portal, but that's where you can edit them. 

## What to watch out for?

⚠️ If created directly from the list, they reside in the default environment.
⚠️ SPO list owners can edit/delete them.
⚠️ Version control is only guaranteed for the last 6 months.
⚠️ No backup.

## How to backup them?

Once created export them as a package and put them in your backup and/or version control tool.

## How to import them into another list?


You don't need to recreate the custom form from scratch. 
If you edit the source json file in the exported package you can find references to connections such as the site URL, list name, and list ID. 
Modify these fields with the destination site and list, import the package as an app (not in the default environment 🤪) and publish to SharePoint. 
Go to the new list and activate the custom form.

## Conclusion

Take care of your custom forms!

## LinkedIn relative post
https://www.linkedin.com/posts/federicotosetto_sharepoint-sharepoint-sharepoint-activity-7383860846931742720-GQ-j?utm_source=share&utm_medium=member_desktop&rcm=ACoAACKJlEABegKcSpQKizAvOzyH46f6JvcIZbM