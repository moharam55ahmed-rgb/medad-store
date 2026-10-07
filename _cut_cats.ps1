Add-Type -AssemblyName System.Drawing
$root = "C:\Users\qeema\.cursor\projects\c-Users-qeema-OneDrive-Desktop-Medad\assets"
$outDir = "C:\Users\qeema\OneDrive\Desktop\Medad\public\categories"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$jobs = @(
  @{ name = "skin"; file = "c__Users_qeema_AppData_Roaming_Cursor_User_workspaceStorage_196bf47de261250a23e610080323afaa_images_image-fa08c9d5-2fde-4375-8fa7-b504d970a33d.png" },
  @{ name = "makeup"; file = "c__Users_qeema_AppData_Roaming_Cursor_User_workspaceStorage_196bf47de261250a23e610080323afaa_images_image-18e78895-1128-476f-b6f4-1ae014f06217.png" },
  @{ name = "fragrance"; file = "c__Users_qeema_AppData_Roaming_Cursor_User_workspaceStorage_196bf47de261250a23e610080323afaa_images_image-d77dfaec-f525-4deb-bf01-2897967d2ab6.png" },
  @{ name = "hair"; file = "c__Users_qeema_AppData_Roaming_Cursor_User_workspaceStorage_196bf47de261250a23e610080323afaa_images_image-6a0e19df-b1cf-4139-8a3b-3f8e53899e34.png" },
  @{ name = "body"; file = "c__Users_qeema_AppData_Roaming_Cursor_User_workspaceStorage_196bf47de261250a23e610080323afaa_images_image-25845349-0e01-445b-8df2-1f9ae3a4d75e.png" },
  @{ name = "gifts"; file = "c__Users_qeema_AppData_Roaming_Cursor_User_workspaceStorage_196bf47de261250a23e610080323afaa_images_image-c4752390-88b9-4e51-9ab0-e40d41511fea.png" },
  @{ name = "tools"; file = "c__Users_qeema_AppData_Roaming_Cursor_User_workspaceStorage_196bf47de261250a23e610080323afaa_images_image-a0130cce-7d43-4b94-9a50-73243d988f08.png" }
)

function Invoke-Cut([string]$srcPath, [string]$destPath) {
  $src = New-Object System.Drawing.Bitmap $srcPath
  $w = $src.Width
  $h = $src.Height
  $bmp = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.DrawImage($src, 0, 0, $w, $h)
  $g.Dispose()
  $src.Dispose()

  $rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
  $data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $stride = $data.Stride
  $bytes = New-Object byte[] ($stride * $h)
  [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)

  $count = $w * $h
  $kill = New-Object bool[] $count
  $q = New-Object System.Collections.Generic.Queue[int]

  function Test-Bg([int]$x, [int]$y) {
    $i = $y * $stride + $x * 4
    $b = $bytes[$i]; $gg = $bytes[$i + 1]; $r = $bytes[$i + 2]
    if ($r -lt 206 -or $gg -lt 176 -or $b -lt 164) { return $false }
    if (($r - $b) -gt 78 -or ($r - $gg) -gt 48) { return $false }
    $maxd = 0
    foreach ($pair in @(@(-1,0),@(1,0),@(0,-1),@(0,1))) {
      $nx = $x + $pair[0]; $ny = $y + $pair[1]
      if ($nx -lt 0 -or $ny -lt 0 -or $nx -ge $w -or $ny -ge $h) { continue }
      $j = $ny * $stride + $nx * 4
      $d = [Math]::Abs($r - $bytes[$j + 2]) + [Math]::Abs($gg - $bytes[$j + 1]) + [Math]::Abs($b - $bytes[$j])
      if ($d -gt $maxd) { $maxd = $d }
    }
    return ($maxd -lt 42)
  }

  for ($x = 0; $x -lt $w; $x++) {
    $q.Enqueue($x)
    $q.Enqueue(($h - 1) * $w + $x)
  }
  for ($y = 0; $y -lt $h; $y++) {
    $q.Enqueue($y * $w)
    $q.Enqueue($y * $w + ($w - 1))
  }

  while ($q.Count -gt 0) {
    $p = $q.Dequeue()
    if ($kill[$p]) { continue }
    $x = $p % $w
    $y = [int][Math]::Floor($p / $w)
    if (-not (Test-Bg $x $y)) { continue }
    $kill[$p] = $true
    if ($x -gt 0) { $q.Enqueue($p - 1) }
    if ($x + 1 -lt $w) { $q.Enqueue($p + 1) }
    if ($y -gt 0) { $q.Enqueue($p - $w) }
    if ($y + 1 -lt $h) { $q.Enqueue($p + $w) }
  }

  $minX = $w; $maxX = 0; $minY = $h; $maxY = 0; $cores = 0
  for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
      $p = $y * $w + $x
      if ($kill[$p]) { continue }
      $i = $y * $stride + $x * 4
      $b = $bytes[$i]; $gg = $bytes[$i + 1]; $r = $bytes[$i + 2]
      $avg = ($r + $gg + $b) / 3
      $core = ($avg -lt 206) -or (($r - $b) -gt 48 -and $gg -lt 188)
      if (-not $core) { continue }
      $cores++
      if ($x -lt $minX) { $minX = $x }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
  if ($cores -gt 20) {
    $minX = [Math]::Max(0, $minX - 4)
    $maxX = [Math]::Min($w - 1, $maxX + 4)
    $minY = [Math]::Max(0, $minY - 18)
    $maxY = [Math]::Min($h - 1, $maxY + 2)
    for ($y = 0; $y -lt $h; $y++) {
      for ($x = 0; $x -lt $w; $x++) {
        $p = $y * $w + $x
        if ($kill[$p]) { continue }
        if ($x -lt $minX -or $x -gt $maxX -or $y -lt $minY -or $y -gt $maxY) { $kill[$p] = $true }
      }
    }
  }

  for ($pass = 0; $pass -lt 2; $pass++) {
    $peel = New-Object System.Collections.Generic.List[int]
    for ($y = 0; $y -lt $h; $y++) {
      for ($x = 0; $x -lt $w; $x++) {
        $p = $y * $w + $x
        if ($kill[$p]) { continue }
        $edge = $false
        foreach ($pair in @(@(-1,0),@(1,0),@(0,-1),@(0,1))) {
          $nx = $x + $pair[0]; $ny = $y + $pair[1]
          if ($nx -lt 0 -or $ny -lt 0 -or $nx -ge $w -or $ny -ge $h -or $kill[$ny * $w + $nx]) { $edge = $true; break }
        }
        if (-not $edge) { continue }
        $i = $y * $stride + $x * 4
        $b = $bytes[$i]; $gg = $bytes[$i + 1]; $r = $bytes[$i + 2]
        if ($r -gt 228 -and $gg -gt 205 -and $b -gt 196) { $peel.Add($p) }
      }
    }
    foreach ($p in $peel) { $kill[$p] = $true }
  }

  for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
      if ($kill[$y * $w + $x]) { $bytes[$y * $stride + $x * 4 + 3] = 0 }
    }
  }

  [System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $data.Scan0, $bytes.Length)
  $bmp.UnlockBits($data)

  $scale = 3
  $big = New-Object System.Drawing.Bitmap ($w * $scale), ($h * $scale), ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gg2 = [System.Drawing.Graphics]::FromImage($big)
  $gg2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $gg2.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $gg2.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $gg2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $gg2.DrawImage($bmp, 0, 0, $big.Width, $big.Height)
  $gg2.Dispose()
  $bmp.Dispose()

  $big.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $big.Dispose()
}

foreach ($job in $jobs) {
  $srcPath = Join-Path $root $job.file
  $dest = Join-Path $outDir ($job.name + ".png")
  Invoke-Cut $srcPath $dest
  Write-Output ("wrote " + $job.name)
}
