---
title: "Automate PowerAutomate flow activation"
description: "Automate PowerAutomate flow activation"
publishDate: "2026-01-15T14:27:42.069Z"

tags: ["PowerAutomate","PowerPlatform","Gotchas"]
---

## The problem

Came back from holidays and lots of your hashtag#PowerAutomate workflows have been turned off due to 14 days of inactivity? Don’t activate them manually, solve the problem with… another automation 🤪

# Note
In this case I’ll show a solution based on an environment with Dataverse.

## Solution

1- List rows from the “𝗦𝗼𝗹𝘂𝘁𝗶𝗼𝗻𝘀” table and filter 𝘆𝗼𝘂𝗿𝗦𝗼𝗹𝘂𝘁𝗶𝗼𝗻𝗚𝗨𝗜𝗗 and the component type (𝟮𝟵 is a Cloud Flow).

2- For each result "𝗚𝗲𝘁 𝗮 𝗿𝗼𝘄 𝗯𝘆 𝗜𝗗" from the selected environment and the table “Processes”; where the Row ID is the "𝗼𝗯𝗷𝗲𝗰𝘁𝗜𝗗" obtained from the previous step.

3- Check with a condition if the “𝗦𝘁𝗮𝘁𝗲 𝗰𝗼𝗱𝗲” obtained from the previous step is not equal to 1 (1 equal to "Active") and if not activate the flow using the “Turn on flow”.

## Tech tip
In the “Turn on flow” action use the flow ID (aka “objectID”) instead of the Flow name 😉

## Demo Video

<video controls>
  <source src="/Videos/PowerAutomateReactivation.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## LinkedIn relative post
https://www.linkedin.com/posts/federicotosetto_powerautomate-activity-7414657996196159489-UnEX?utm_source=share&utm_medium=member_desktop&rcm=ACoAACKJlEABegKcSpQKizAvOzyH46f6JvcIZbM