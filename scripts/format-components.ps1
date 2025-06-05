# PowerShell script for comprehensive component formatting

param(
    [string]$ComponentsPath = "src\components",
    [switch]$DryRun = $false,
    [switch]$Verbose = $false,
    [switch]$SkipPrettier = $false,
    [switch]$SkipESLint = $false
)

# Configuration
$FileExtensions = @('.ts', '.tsx', '.js', '.jsx')

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Invoke-SafeCommand {
    param(
        [string]$Command,
        [string]$FilePath,
        [string]$ToolName
    )
    
    try {
        $output = Invoke-Expression $Command 2>&1
        if ($LASTEXITCODE -eq 0 -or ($ToolName -eq "ESLint" -and $LASTEXITCODE -eq 1)) {
            if ($Verbose) {
                Write-ColorOutput "   ✅ $ToolName applied successfully" "Green"
            }
            return $true
        } else {
            Write-ColorOutput "   ⚠️  $ToolName warning for $FilePath" "Yellow"
            return $false
        }
    } catch {
        Write-ColorOutput "   ❌ $ToolName error for $FilePath : $($_.Exception.Message)" "Red"
        return $false
    }
}

function Format-ImportOrder {
    param([string]$Content)
    
    $lines = $Content -split "`n"
    $imports = @()
    $nonImports = @()
    $inImportSection = $true
    
    foreach ($line in $lines) {
        if ($line.Trim().StartsWith("import ") -or ($line.Trim().StartsWith("export ") -and $line.Contains("from"))) {
            if ($inImportSection) {
                $imports += $line
            } else {
                $nonImports += $line
            }
        } elseif ($line.Trim() -eq "" -and $inImportSection) {
            $imports += $line
        } else {
            $inImportSection = $false
            $nonImports += $line
        }
    }
    
    # Categorize and sort imports
    $categories = @{
        react = @()
        external = @()
        internal = @()
        relative = @()
        types = @()
        styles = @()
    }
    
    foreach ($import in ($imports | Where-Object { $_.Trim() -ne "" })) {
        if ($import -match "from ['\`"]react['\`"]") {
            $categories.react += $import
        } elseif ($import -match "from ['\`"]@/") {
            $categories.internal += $import
        } elseif ($import -match "from ['\`"]\.\./|from ['\`"]\./") {
            $categories.relative += $import
        } elseif ($import -match "type |./types") {
            $categories.types += $import
        } elseif ($import -match "\.(css|scss)|./styles") {
            $categories.styles += $import
        } else {
            $categories.external += $import
        }
    }
    
    # Sort each category
    foreach ($key in $categories.Keys) {
        $categories[$key] = $categories[$key] | Sort-Object
    }
    
    # Combine categories
    $sortedImports = @()
    $order = @('react', 'external', 'internal', 'relative', 'types', 'styles')
    
    for ($i = 0; $i -lt $order.Length; $i++) {
        $category = $order[$i]
        if ($categories[$category].Count -gt 0) {
            $sortedImports += $categories[$category]
            # Add empty line between categories (except last)
            $hasNext = $false
            for ($j = $i + 1; $j -lt $order.Length; $j++) {
                if ($categories[$order[$j]].Count -gt 0) {
                    $hasNext = $true
                    break
                }
            }
            if ($hasNext) {
                $sortedImports += ""
            }
        }
    }
    
    # Combine with non-imports
    $result = $sortedImports + @("") + ($nonImports | Where-Object { $_.Trim() -ne "" -or $nonImports.IndexOf($_) -eq 0 })
    
    return ($result -join "`n")
}

function Format-ComponentStructure {
    param([string]$Content)
    
    # Ensure proper spacing around component declarations
    $formatted = $Content -replace "(export\s+(?:default\s+)?(?:function|const|class)\s+\w+)", "`n`$1"
    
    # Ensure proper spacing around interfaces and types
    $formatted = $formatted -replace "((?:export\s+)?(?:interface|type)\s+\w+)", "`n`$1"
    
    # Clean up multiple empty lines
    $formatted = $formatted -replace "`n{3,}", "`n`n"
    
    return $formatted
}

function Process-File {
    param([string]$FilePath)
    
    try {
        $originalContent = Get-Content -Path $FilePath -Raw -Encoding UTF8
        $processedContent = $originalContent
        
        if ($Verbose) {
            Write-ColorOutput "Processing: $FilePath" "Cyan"
        }
        
        # Apply our custom formatting
        $processedContent = Format-ImportOrder -Content $processedContent
        $processedContent = Format-ComponentStructure -Content $processedContent
        
        # Write intermediate result
        if (-not $DryRun) {
            Set-Content -Path $FilePath -Value $processedContent -Encoding UTF8 -NoNewline
        }
        
        # Apply Prettier
        if (-not $SkipPrettier) {
            $prettierCmd = "npx prettier --write `"$FilePath`""
            if ($DryRun) {
                $prettierCmd = "npx prettier --check `"$FilePath`""
            }
            Invoke-SafeCommand -Command $prettierCmd -FilePath $FilePath -ToolName "Prettier" | Out-Null
        }
        
        # Apply ESLint
        if (-not $SkipESLint) {
            $eslintCmd = "npx eslint `"$FilePath`" --fix"
            if ($DryRun) {
                $eslintCmd = "npx eslint `"$FilePath`""
            }
            Invoke-SafeCommand -Command $eslintCmd -FilePath $FilePath -ToolName "ESLint" | Out-Null
        }
        
        # Check if file was modified
        $finalContent = if ($DryRun) { $processedContent } else { Get-Content -Path $FilePath -Raw -Encoding UTF8 }
        
        if ($originalContent -ne $finalContent) {
            $relativePath = Resolve-Path -Path $FilePath -Relative
            if ($DryRun) {
                Write-ColorOutput "🔍 Would format: $relativePath" "Yellow"
            } else {
                Write-ColorOutput "✅ Formatted: $relativePath" "Green"
            }
            return $true
        } else {
            if ($Verbose) {
                $relativePath = Resolve-Path -Path $FilePath -Relative
                Write-ColorOutput "⏭️  No changes: $relativePath" "Gray"
            }
            return $false
        }
    } catch {
        $relativePath = Resolve-Path -Path $FilePath -Relative
        Write-ColorOutput "❌ Error processing $relativePath : $($_.Exception.Message)" "Red"
        return $false
    }
}

function Get-ComponentFiles {
    param([string]$Directory)
    
    if (-not (Test-Path -Path $Directory)) {
        Write-ColorOutput "❌ Components directory not found: $Directory" "Red"
        return @()
    }
    
    $files = @()
    Get-ChildItem -Path $Directory -Recurse -File | Where-Object {
        $FileExtensions -contains $_.Extension
    } | ForEach-Object {
        $files += $_.FullName
    }
    
    return $files
}

# Main execution
Write-ColorOutput "🎨 Starting component formatting process..." "Cyan"
Write-ColorOutput "📁 Components directory: $ComponentsPath" "Cyan"
Write-ColorOutput "📄 File extensions: $($FileExtensions -join ', ')" "Cyan"

$tools = @()
if (-not $SkipPrettier) { $tools += "Prettier" }
if (-not $SkipESLint) { $tools += "ESLint" }
$tools += "Import organization", "Structure formatting"

Write-ColorOutput "🔧 Applying: $($tools -join ', ')" "Cyan"

if ($DryRun) {
    Write-ColorOutput "🔍 DRY RUN MODE - No files will be modified" "Yellow"
}

Write-ColorOutput "" "White"

$files = Get-ComponentFiles -Directory $ComponentsPath

if ($files.Length -eq 0) {
    Write-ColorOutput "⚠️  No component files found." "Yellow"
    exit 0
}

Write-ColorOutput "📋 Found $($files.Length) files to format:" "Cyan"
Write-ColorOutput "" "White"

$processedCount = 0
$changedCount = 0

foreach ($file in $files) {
    $changed = Process-File -FilePath $file
    $processedCount++
    if ($changed) { $changedCount++ }
}

Write-ColorOutput "" "White"
Write-ColorOutput "✨ Formatting completed!" "Green"
Write-ColorOutput "📊 Summary:" "Cyan"
Write-ColorOutput "   - Files processed: $processedCount" "Cyan"
Write-ColorOutput "   - Files modified: $changedCount" "Green"
Write-ColorOutput "   - Files unchanged: $($processedCount - $changedCount)" "Cyan"

if ($DryRun) {
    Write-ColorOutput "" "White"
    Write-ColorOutput "💡 Run without -DryRun to actually format the files" "Yellow"
}
