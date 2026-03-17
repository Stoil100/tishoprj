$p = Get-Item .\public\dancers-bw.png -ErrorAction SilentlyContinue
Write-Output "exists: $($p -ne $null)"
if ($p) {
    Write-Output "size_bytes: $($p.Length)"
    $bytes = Get-Content -Path $p.FullName -Encoding Byte -TotalCount 24
    if (($bytes[0..7] -ne @(0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A))) {
        Write-Output 'not a PNG'
    } else {
        $width = [System.BitConverter]::ToUInt32($bytes[16..19],0)
        $height = [System.BitConverter]::ToUInt32($bytes[20..23],0)
        Write-Output "dimensions: ${width}x${height}"
    }
}
