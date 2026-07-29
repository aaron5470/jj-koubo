[CmdletBinding()]
param(
    [ValidateSet('codex', 'claude', 'agents')]
    [string]$Target = 'agents',

    [ValidateSet('user', 'project')]
    [string]$Scope = 'user',

    [string]$ProjectPath = (Get-Location).Path,

    [switch]$Force
)

$ErrorActionPreference = 'Stop'

$repositoryRoot = Split-Path -Parent $PSScriptRoot
$source = Join-Path $repositoryRoot 'jj'

if (-not (Test-Path -LiteralPath (Join-Path $source 'SKILL.md') -PathType Leaf)) {
    throw "Skill source not found: $source"
}

if ($Scope -eq 'user') {
    $userProfilePath = [Environment]::GetFolderPath([Environment+SpecialFolder]::UserProfile)
    $skillsRoot = if ($Target -eq 'claude') {
        Join-Path $userProfilePath '.claude\skills'
    } else {
        Join-Path $userProfilePath '.agents\skills'
    }
} else {
    $resolvedProjectPath = [IO.Path]::GetFullPath($ProjectPath)
    if (-not (Test-Path -LiteralPath $resolvedProjectPath -PathType Container)) {
        throw "Project directory not found: $resolvedProjectPath"
    }

    $skillsRoot = if ($Target -eq 'claude') {
        Join-Path $resolvedProjectPath '.claude\skills'
    } else {
        Join-Path $resolvedProjectPath '.agents\skills'
    }
}

$destination = Join-Path $skillsRoot 'jj'
$destinationExists = Test-Path -LiteralPath $destination
$excludedDirectories = @('node_modules', '.cache', '.remotion', 'out', 'dist')

if ($destinationExists -and -not $Force) {
    throw "Skill already exists: $destination. Re-run with -Force to update it."
}

New-Item -ItemType Directory -Path $skillsRoot -Force | Out-Null

function Copy-SkillDirectory {
    param(
        [Parameter(Mandatory = $true)]
        [string]$SourceDirectory,

        [Parameter(Mandatory = $true)]
        [string]$DestinationDirectory
    )

    New-Item -ItemType Directory -Path $DestinationDirectory -Force | Out-Null

    foreach ($item in Get-ChildItem -LiteralPath $SourceDirectory -Force) {
        if ($item.PSIsContainer) {
            if ($excludedDirectories -contains $item.Name) {
                continue
            }

            Copy-SkillDirectory `
                -SourceDirectory $item.FullName `
                -DestinationDirectory (Join-Path $DestinationDirectory $item.Name)
            continue
        }

        Copy-Item -LiteralPath $item.FullName -Destination (Join-Path $DestinationDirectory $item.Name) -Force
    }
}

Copy-SkillDirectory -SourceDirectory $source -DestinationDirectory $destination

Write-Output "Installed jj for $Target ($Scope): $destination"
