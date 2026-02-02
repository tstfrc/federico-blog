---
title: "Compare 2 folder on different Sites and Document Library"
description: "Compare 2 folder on different Sites and Document Library"
publishDate: "2026-02-03T14:27:42.069Z"

tags: ["SharePoint","PnP","Gotchas"]
---

## The problem

Ever needed to compare the contents of two SharePoint document libraries across different sites? 🧐
It's a nightmare, I know.. but it's possible!

I recently encountered this challenge and decided to automate it with PowerShell. 
Using the PnP PowerShell module I've written a script that performs an intelligent folder comparison between two SharePoint Online Document Libraries.
In case of 2 duplication how to understand wich one is the right one or dedicede what in official or newer?


## What to do?

- Connects to two SharePoint sites and retrieves all files (recursively) from the specified folders.
- Compares files by name and folder structure (using path normalization to ignore differences in root folder names).
- Checks each matching file's last modified date and size to identify which version is newer or if they're identical.
- Identifies files that exist only in one site or the other.
- Generates detailed **CSV reports** and a text summary with stats (identical files, newer/older files, files only in Site A or Site B, etc.).

This helps quickly spot out-of-sync files, discover newer versions, or catch any mismatches between the two libraries. It’s a huge time-saver for SharePoint content audits or migrations! 🚀

## Full script

Here's a snippet of the core comparison logic (using a helper Normalize-Path function to standardize folder paths):

```powershell

$ErrorActionPreference = "Continue"

# Script purpose:
#   Compare files between two SharePoint Online folders across different sites and
#   produce a CSV report summarizing identical files, newer/older versions and
#   files that exist only on one side.
# Notes:
#   - Uses PnP PowerShell (Connect-PnPOnline, Get-PnPFolderItem)
#   - Expects $Site1 and $Site2 to be hashtables with Url, Folder, Name (Library optional)

# Change $Site1 and $SiteB with your parameters
$Site1 = @{
    Url = "https://tenant.sharepoint.com/sites/SiteA"
    Library = "Documents"
    Folder = "Documents"
    Name = "NameA"
}

$Site2 = @{
    Url = "https://tenant.sharepoint.com/sites/SiteB"
    Library = "Documents"
    Folder = "Documents/Subfolder"
    Name = "NameB"
}

# Output location and timestamp used for report file naming
$OutputPath = "C:\Temp\Report_SharePoint"
$ReportDate = Get-Date -Format "yyyyMMdd_HHmmss"

# Create the folder if it not exist
if (-not (Test-Path $OutputPath)) { New-Item -ItemType Directory -Path $OutputPath | Out-Null }


# Retrieves all files from a SharePoint site folder using PnP PowerShell.
# Parameters:
#   [hashtable] $Site - Hashtable containing at least: Url, Folder, Name (optional: Library)
# Returns:
#   Array of file objects from Get-PnPFolderItem (or exits on failure).
function Get-SharePointFiles {
    param([hashtable]$Site)
    # Inform the user which site is being processed
    Write-Host "Connessione a: $($Site.Name)" -ForegroundColor Yellow
    try {
        # Connect interactively to the specified SharePoint site
        Connect-PnPOnline -Url $Site.Url -Interactive
        # Retrieve files recursively from the given folder path
        $files = Get-PnPFolderItem -FolderSiteRelativeUrl $Site.Folder -ItemType File -Recursive
        Write-Host "Trovati $($files.Count) file" -ForegroundColor Green
        # Return the collection of files
        return $files
    } catch {
        # Print the error message and stop execution (non-recoverable in this script)
        Write-Host "ERRORE: $_" -ForegroundColor Red
        exit
    } finally {
        # Always disconnect from the PnP session to clean up resources
        Disconnect-PnPOnline
    }
}

# Normalizes a ServerRelativeUrl to a consistent path used for comparison.
# Parameters:
#   $ServerRelativeUrl - The file's ServerRelativeUrl as returned by SharePoint
#   $BaseFolder - The configured base folder to strip from the path
# Returns:
#   A decoded, normalized path relative to the configured folder (no leading site segment)
function Get-NormalizedPath {
    param($ServerRelativeUrl, $BaseFolder)
    
    # Extract the part after /sites/{siteName}/
    if ($ServerRelativeUrl -match "/sites/[^/]+/(.*)") {
        $path = $matches[1]
    }
    
    # Remove the root library/base folder prefix so comparisons ignore different root names
    $path = $path -replace "^[^/]+/(.+)$", "`$1"
    
    # Decode any URL encoded characters (e.g. %20 => space)
    $path = [System.Web.HttpUtility]::UrlDecode($path)
    return $path
} 

# ===== RETRIEVE FILES FROM BOTH SITES =====
Write-Host ""
# Retrieve file objects from each configured site using the helper function
$files1 = Get-SharePointFiles -Site $Site1
Write-Host ""
$files2 = Get-SharePointFiles -Site $Site2
Write-Host ""

# ===== COMPARE FILES =====
# The comparison matches files by normalized path + filename, then compares timestamps and sizes
Write-Host "Starting file comparison..." -ForegroundColor Yellow

$result = @()
$stats = @{ Same = 0; Older = 0; Newer = 0; OnlyS1 = 0; OnlyS2 = 0 }

# Create an index (hashtable) of Site 2 files for fast lookup by filename+path
# Key format: "FileName|NormalizedPath"
$files2Index = @{}
foreach ($f in $files2) {
    $normPath = Get-NormalizedPath -ServerRelativeUrl $f.ServerRelativeUrl -BaseFolder $Site2.Folder
    $key = "$($f.Name)|$normPath"
    $files2Index[$key] = $f
} 

# Compare files from Site 1 with the indexed Site 2 files
# - If a matching key exists, compare timestamps to mark newer/older/identical
# - If not, mark the file as only present on Site 1
$matched = @{}
foreach ($f1 in $files1) {
    $normPath1 = Get-NormalizedPath -ServerRelativeUrl $f1.ServerRelativeUrl -BaseFolder $Site1.Folder
    $key = "$($f1.Name)|$normPath1"
    
    if ($files2Index.ContainsKey($key)) {
        # Matching file found on Site 2
        $f2 = $files2Index[$key]
        $matched[$key] = $true
        
        # Compare last modified timestamps to determine which copy is newer
        $comparison = switch ($f1.TimeLastModified) {
            { $_ -gt $f2.TimeLastModified } { "SITE1_NEWER"; $stats.Newer++ }
            { $_ -lt $f2.TimeLastModified } { "SITE2_NEWER"; $stats.Older++ }
            default { "IDENTICAL"; $stats.Same++ }
        }
        
        # Append comparison result to the output collection (preserve metadata)
        $result += [PSCustomObject]@{
            NomeFile = $f1.Name
            Percorso = $normPath1
            Stato = $comparison
            Sito1_Data = $f1.TimeLastModified
            Sito2_Data = $f2.TimeLastModified
            Sito1_Size = $f1.Length
            Sito2_Size = $f2.Length
            Sito1_Modified_By = $f1.ModifiedBy.LookupValue
            Sito2_Modified_By = $f2.ModifiedBy.LookupValue
        }
    } else {
        # File exists only on Site 1
        $stats.OnlyS1++
        $result += [PSCustomObject]@{
            NomeFile = $f1.Name
            Percorso = $normPath1
            Stato = "ONLY_SITE1"
            Sito1_Data = $f1.TimeLastModified
            Sito2_Data = $null
            Sito1_Size = $f1.Length
            Sito2_Size = $null
            Sito1_Modified_By = $f1.ModifiedBy.LookupValue
            Sito2_Modified_By = $null
        }
    }
} 

# Check for files that exist only on Site 2 (no match recorded)
foreach ($f2 in $files2) {
    $normPath2 = Get-NormalizedPath -ServerRelativeUrl $f2.ServerRelativeUrl -BaseFolder $Site2.Folder
    $key = "$($f2.Name)|$normPath2"
    
    if (-not $matched.ContainsKey($key)) {
        $stats.OnlyS2++
        $result += [PSCustomObject]@{
            NomeFile = $f2.Name
            Percorso = $normPath2
            Stato = "ONLY_SITE2"
            Sito1_Data = $null
            Sito2_Data = $f2.TimeLastModified
            Sito1_Size = $null
            Sito2_Size = $f2.Length
            Sito1_Modified_By = $null
            Sito2_Modified_By = $f2.ModifiedBy.LookupValue
        }
    }
} 

$result = $result | Sort-Object Stato, Percorso, NomeFile

# ===== SAVE RESULTS =====
Write-Host ""
Write-Host "Saving report..." -ForegroundColor Yellow
$reportFile = "$OutputPath\Confronto_$ReportDate.csv"
# Export the final result set to a UTF-8 CSV file (no type information)
$result | Export-Csv -Path $reportFile -NoTypeInformation -Encoding UTF8
Write-Host "✓ Report saved: $reportFile" -ForegroundColor Green

# ===== DISPLAY STATISTICS =====
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "COMPARISON SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total files analyzed: $($result.Count)" -ForegroundColor White
Write-Host "✓ Identical: $($stats.Same)" -ForegroundColor Green
Write-Host "↑ Newer on $($Site1.Name): $($stats.Newer)" -ForegroundColor Yellow
Write-Host "↑ Newer on $($Site2.Name): $($stats.Older)" -ForegroundColor Yellow
Write-Host "⊕ Only on $($Site1.Name): $($stats.OnlyS1)" -ForegroundColor Magenta
Write-Host "⊕ Only on $($Site2.Name): $($stats.OnlyS2)" -ForegroundColor Magenta
Write-Host ""
Write-Host "📊 Report: $reportFile" -ForegroundColor Green
Write-Host "" 

# Display results in an interactive grid (optional)
$result | Out-GridView -Title "SharePoint File Comparison"
```