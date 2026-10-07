Add-Type -AssemblyName System.Drawing
$srcDir = "C:\Users\qeema\OneDrive\Desktop\Medad\public\product\src"
$dest = "C:\Users\qeema\OneDrive\Desktop\Medad\public\product"

function Cut([string]$file, [string]$outName, [int]$maxSide) {
  $src = Join-Path $srcDir $file
  $fs = [System.IO.File]::OpenRead($src)
  $bmp = New-Object System.Drawing.Bitmap $fs
  $scale = 1.0
  $side = [Math]::Max($bmp.Width, $bmp.Height)
  if ($side -gt $maxSide) { $scale = $maxSide / $side }
  $nw = [Math]::Max(1, [int]($bmp.Width * $scale))
  $nh = [Math]::Max(1, [int]($bmp.Height * $scale))
  $scaled = New-Object System.Drawing.Bitmap $nw, $nh
  $g = [System.Drawing.Graphics]::FromImage($scaled)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($bmp, 0, 0, $nw, $nh)
  $g.Dispose(); $bmp.Dispose(); $fs.Dispose()
  $rect = New-Object System.Drawing.Rectangle 0, 0, $nw, $nh
  $data = $scaled.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $stride = $data.Stride
  $bytes = New-Object byte[] ($stride * $nh)
  [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)
  for ($y = 0; $y -lt $nh; $y++) {
    $row = $y * $stride
    for ($x = 0; $x -lt $nw; $x++) {
      $i = $row + $x * 4
      $b = $bytes[$i]; $gg = $bytes[$i+1]; $r = $bytes[$i+2]
      if ($r -lt 28 -and $gg -lt 28 -and $b -lt 28) { $bytes[$i+3] = 0 }
    }
  }
  [System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $data.Scan0, $bytes.Length)
  $scaled.UnlockBits($data)
  $minX = $nw; $minY = $nh; $maxX = 0; $maxY = 0
  for ($y = 0; $y -lt $nh; $y++) {
    $row = $y * $stride
    for ($x = 0; $x -lt $nw; $x++) {
      if ($bytes[$row + $x * 4 + 3] -gt 18) {
        if ($x -lt $minX) { $minX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }
  if ($maxX -le $minX) { Write-Output "empty $outName"; $scaled.Dispose(); return }
  $pad = [Math]::Max(8, [int](($maxX - $minX) * 0.03))
  $x0 = [Math]::Max(0, $minX - $pad)
  $y0 = [Math]::Max(0, $minY - $pad)
  $x1 = [Math]::Min($nw - 1, $maxX + $pad)
  $y1 = [Math]::Min($nh - 1, $maxY + $pad)
  $cw = $x1 - $x0 + 1; $ch = $y1 - $y0 + 1
  $out = New-Object System.Drawing.Bitmap $cw, $ch
  $g2 = [System.Drawing.Graphics]::FromImage($out)
  $g2.DrawImage($scaled, (New-Object System.Drawing.Rectangle 0,0,$cw,$ch), (New-Object System.Drawing.Rectangle $x0,$y0,$cw,$ch), [System.Drawing.GraphicsUnit]::Pixel)
  $g2.Dispose(); $scaled.Dispose()
  $path = Join-Path $dest $outName
  $tmp = $path + ".tmp.png"
  $out.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
  $out.Dispose()
  Move-Item -Force $tmp $path
  Write-Output "$outName ${cw}x${ch}"
}

Cut "main.jpg" "main.png" 1600
Cut "jar.jpg" "jar.png" 1000
Cut "jar2.jpg" "jar2.png" 1000
Cut "smear.png" "smear.png" 1000
Cut "hero-badge.jpg" "hero.png" 1600
Cut "bloom.jpg" "bloom.png" 1400
Cut "bloom4.jpg" "bloom4.png" 1400
