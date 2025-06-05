# PowerShell script to remove comments from component files while preserving ESLint comments

param(
    [string]$ComponentsPath = "src\components",
    [switch]$DryRun = $false,
    [switch]$Verbose = $false
)

# Configuration
$FileExtensions = @('.ts', '.tsx', '.js', '.jsx')
$ESLintPatterns = @(
    '\/\*\s*eslint',
    '\/\/\s*eslint',
    '\/\*\s*@ts-',
    '\/\/\s*@ts-',
    '\/\*\s*prettier',
    '\/\/\s*prettier'
)

function Test-ShouldPreserveComment {
    param([string]$Comment)
    
    foreach ($pattern in $ESLintPatterns) {
        if ($Comment -match $pattern) {
            return $true
        }
    }
    return $false
}

function Remove-CommentsFromContent {
    param([string]$Content)
    
    $lines = $Content -split "`n"
    $result = @()
    $inMultiLineComment = $false
    $multiLineCommentStart = ""
    
    for ($i = 0; $i -lt $lines.Length; $i++) {
        $line = $lines[$i]
        $processedLine = ""
        $j = 0
        
        while ($j -lt $line.Length) {
            if ($inMultiLineComment) {
                # Look for end of multi-line comment
                if ($j -lt ($line.Length - 1) -and $line.Substring($j, 2) -eq "*/") {
                    $fullComment = $multiLineCommentStart + $line.Substring(0, $j + 2)
                    if (Test-ShouldPreserveComment -Comment $fullComment) {
                        $processedLine += $line.Substring(0, $j + 2)
                    }
                    $inMultiLineComment = $false
                    $multiLineCommentStart = ""
                    $j += 2
                } else {
                    $j++
                }
            } else {
                # Check for start of comments
                if ($j -lt ($line.Length - 1) -and $line.Substring($j, 2) -eq "/*") {
                    # Multi-line comment start
                    $commentStart = $j
                    $commentEnd = $line.IndexOf("*/", $j + 2)
                    
                    if ($commentEnd -ne -1) {
                        # Single-line multi-line comment
                        $comment = $line.Substring($commentStart, $commentEnd - $commentStart + 2)
                        if (Test-ShouldPreserveComment -Comment $comment) {
                            $processedLine += $comment
                        }
                        $j = $commentEnd + 2
                    } else {
                        # Multi-line comment continues
                        $multiLineCommentStart = $line.Substring($commentStart)
                        $inMultiLineComment = $true
                        if (Test-ShouldPreserveComment -Comment $multiLineCommentStart) {
                            $processedLine += $line.Substring($commentStart)
                        }
                        break
                    }
                } elseif ($j -lt ($line.Length - 1) -and $line.Substring($j, 2) -eq "//") {
                    # Single-line comment
                    $comment = $line.Substring($j)
                    if (Test-ShouldPreserveComment -Comment $comment) {
                        $processedLine += $comment
                    }
                    break
                } elseif ($line[$j] -eq '"' -or $line[$j] -eq "'" -or $line[$j] -eq '`') {
                    # Handle strings to avoid removing comments inside them
                    $quote = $line[$j]
                    $processedLine += $quote
                    $j++
                    
                    # Find the end of the string
                    while ($j -lt $line.Length) {
                        if ($line[$j] -eq $quote -and ($j -eq 0 -or $line[$j - 1] -ne '\')) {
                            $processedLine += $quote
                            $j++
                            break
                        }
                        $processedLine += $line[$j]
                        $j++
                    }
                } else {
                    $processedLine += $line[$j]
                    $j++
                }
            }
        }
        
        # Only add the line if it's not empty or contains preserved comments
        if ($processedLine.Trim() -ne "" -or (Test-ShouldPreserveComment -Comment $processedLine)) {
            $result += $processedLine
        } elseif ($processedLine.Trim() -eq "" -and $result.Length -gt 0 -and $result[-1].Trim() -ne "") {
            # Preserve single empty lines between code blocks
            $result += ""
        }
    }
    
    # Clean up multiple consecutive empty lines
    $cleaned = @()
    $emptyLineCount = 0
    
    foreach ($line in $result) {
        if ($line.Trim() -eq "") {
            $emptyLineCount++
            if ($emptyLineCount -le 1) {
                $cleaned += $line
            }
        } else {
            $emptyLineCount = 0
            $cleaned += $line
        }
    }
    
    return ($cleaned -join "`n")
}

function Process-File {
    param([string]$FilePath)
    
    try {
        $content = Get-Content -Path $FilePath -Raw -Encoding UTF8
        $processedContent = Remove-CommentsFromContent -Content $content
        
        if ($content -ne $processedContent) {
            if (-not $DryRun) {
                Set-Content -Path $FilePath -Value $processedContent -Encoding UTF8 -NoNewline
            }
            $relativePath = Resolve-Path -Path $FilePath -Relative
            if ($DryRun) {
                Write-Host "🔍 Would modify: $relativePath" -ForegroundColor Yellow
            } else {
                Write-Host "✅ Processed: $relativePath" -ForegroundColor Green
            }
            return $true
        } else {
            if ($Verbose) {
                $relativePath = Resolve-Path -Path $FilePath -Relative
                Write-Host "⏭️  No changes: $relativePath" -ForegroundColor Gray
            }
            return $false
        }
    } catch {
        $relativePath = Resolve-Path -Path $FilePath -Relative
        Write-Host "❌ Error processing $relativePath : $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Get-ComponentFiles {
    param([string]$Directory)
    
    if (-not (Test-Path -Path $Directory)) {
        Write-Host "❌ Components directory not found: $Directory" -ForegroundColor Red
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
Write-Host "🚀 Starting comment removal process..." -ForegroundColor Cyan
Write-Host "📁 Components directory: $ComponentsPath" -ForegroundColor Cyan
Write-Host "📄 File extensions: $($FileExtensions -join ', ')" -ForegroundColor Cyan
Write-Host "🛡️  Preserving ESLint, TypeScript, and Prettier comments" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "🔍 DRY RUN MODE - No files will be modified" -ForegroundColor Yellow
}

Write-Host ""

$files = Get-ComponentFiles -Directory $ComponentsPath

if ($files.Length -eq 0) {
    Write-Host "⚠️  No component files found." -ForegroundColor Yellow
    exit 0
}

Write-Host "📋 Found $($files.Length) files to process:" -ForegroundColor Cyan
Write-Host ""

$processedCount = 0
$changedCount = 0

foreach ($file in $files) {
    $changed = Process-File -FilePath $file
    $processedCount++
    if ($changed) { $changedCount++ }
}

Write-Host ""
Write-Host "✨ Process completed!" -ForegroundColor Green
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   - Files processed: $processedCount" -ForegroundColor Cyan
Write-Host "   - Files that would be modified: $changedCount" -ForegroundColor $(if ($DryRun) { "Yellow" } else { "Green" })
Write-Host "   - Files unchanged: $($processedCount - $changedCount)" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host ""
    Write-Host "💡 Run without -DryRun to actually modify the files" -ForegroundColor Yellow
}
