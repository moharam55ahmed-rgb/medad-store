Add-Type -AssemblyName System.Drawing
$root = "C:\Users\qeema\OneDrive\Desktop\Medad"
$assets = "C:\Users\qeema\.cursor\projects\c-Users-qeema-OneDrive-Desktop-Medad\assets"

function Upscale($src, $dest, $scale) {
  $bmp = New-Object System.Drawing.Bitmap $src
  $nw = $bmp.Width * $scale
  $nh = $bmp.Height * $scale
  $out = New-Object System.Drawing.Bitmap $nw, $nh
  $g = [System.Drawing.Graphics]::FromImage($out)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($bmp, 0, 0, $nw, $nh)
  $g.Dispose()
  $bmp.Dispose()
  $out.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
  $out.Dispose()
}

Upscale "$root\_fmid.png" "$root\_fmid2.png" 3
Upscale "$root\_fbot.png" "$root\_fbot2.png" 3
Upscale "$root\_ftop.png" "$root\_ftop2.png" 3

# wave profile: first pink-ish pixel from top
$ref = New-Object System.Drawing.Bitmap "$assets\c__Users_qeema_AppData_Roaming_Cursor_User_workspaceStorage_196bf47de261250a23e610080323afaa_images_image-1f3c8422-fd48-4ce0-8fc6-4ecac69023ff.png"
$w = $ref.Width; $h = $ref.Height
$ys = @()
for ($x = 0; $x -lt $w; $x += 40) {
  $yHit = -1
  for ($y = 0; $y -lt $h; $y++) {
    $p = $ref.GetPixel($x, $y)
    if ($p.R -gt 240 -and $p.G -lt 235 -and $p.B -lt 230) { $yHit = $y; break }
  }
  $ys += "${x}:$yHit"
}
Write-Output ($ys -join " ")
$ref.Dispose()

function Cut-Icon($srcName, $destName) {
  $src = Join-Path $assets $srcName
  $bmp = New-Object System.Drawing.Bitmap $src
  $w = $bmp.Width; $h = $bmp.Height
  $max = 640
  $scale = 1.0
  if ([Math]::Max($w, $h) -gt $max) { $scale = $max / [Math]::Max($w, $h) }
  $nw = [int]($w * $scale); $nh = [int]($h * $scale)
  $scaled = New-Object System.Drawing.Bitmap $nw, $nh
  $g = [System.Drawing.Graphics]::FromImage($scaled)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($bmp, 0, 0, $nw, $nh)
  $g.Dispose(); $bmp.Dispose()
  $rect = New-Object System.Drawing.Rectangle 0,0,$nw,$nh
  $data = $scaled.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $stride = $data.Stride
  $bytes = New-Object byte[] ($stride * $nh)
  [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)
  for ($y = 0; $y -lt $nh; $y++) {
    $row = $y * $stride
    for ($x = 0; $x -lt $nw; $x++) {
      $i = $row + $x * 4
      $b = $bytes[$i]; $gg = $bytes[$i+1]; $r = $bytes[$i+2]
      $dark = ($r -lt 36 -and $gg -lt 36 -and $b -lt 36)
      $fringe = ($r -lt 72 -and $gg -lt 72 -and $b -lt 72 -and [Math]::Abs($r - $gg) -lt 14 -and [Math]::Abs($r - $b) -lt 14)
      if ($dark -or $fringe) { $bytes[$i+3] = 0 }
    }
  }
  [System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $data.Scan0, $bytes.Length)
  $scaled.UnlockBits($data)
  $minX = $nw; $minY = $nh; $maxX = -1; $maxY = -1
  for ($y = 0; $y -lt $nh; $y++) {
    $row = $y * $stride
    for ($x = 0; $x -lt $nw; $x++) {
      if ($bytes[$row + $x*4 + 3] -gt 16) {
        if ($x -lt $minX) { $minX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }
  $pad = [Math]::Max(6, [int](($maxX - $minX) * 0.03))
  $x0 = [Math]::Max(0, $minX - $pad)
  $y0 = [Math]::Max(0, $minY - $pad)
  $x1 = [Math]::Min($nw - 1, $maxX + $pad)
  $y1 = [Math]::Min($nh - 1, $maxY + $pad)
  $cw = $x1 - $x0 + 1; $ch = $y1 - $y0 + 1
  $out = New-Object System.Drawing.Bitmap $cw, $ch
  $g2 = [System.Drawing.Graphics]::FromImage($out)
  $g2.DrawImage($scaled, (New-Object System.Drawing.Rectangle 0,0,$cw,$ch), (New-Object System.Drawing.Rectangle $x0,$y0,$cw,$ch), [System.Drawing.GraphicsUnit]::Pixel)
  $g2.Dispose(); $scaled.Dispose()
  $dir = Join-Path $root "public\footer"
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
  $dest = Join-Path $dir $destName
  $tmp = Join-Path $dir ($destName + ".tmp.png")
  $out.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
  $out.Dispose()
  Move-Item -Force $tmp $dest
  Write-Output "$destName ${cw}x${ch}"
}

$prefix = "c__Users_qeema_AppData_Roaming_Cursor_User_workspaceStorage_196bf47de261250a23e610080323afaa_images_"
Cut-Icon ($prefix + "ChatGPT_Image_Oct_7__2026__10_53_48_AM-2-ee8bc23e-2e44-4c12-a2d5-ebf336e4a564.png") "app-store.png"
Cut-Icon ($prefix + "ChatGPT_Image_Oct_7__2026__10_53_50_AM-3-51ee4929-5f3a-47b1-bc8c-feed32aca881.png") "google-play.png"
Cut-Icon ($prefix + "ChatGPT_Image_Oct_7__2026__10_53_51_AM-4-564fd487-6d1a-49d9-83b9-cbdde7641136.png") "payments.png"
Cut-Icon ($prefix + "ChatGPT_Image_Oct_7__2026__10_58_57_AM-5-bb488268-fed6-46ed-870e-f402e4fb8360.png") "facebook.png"
Cut-Icon ($prefix + "ChatGPT_Image_Oct_7__2026__10_58_55_AM-3-2653bd86-597a-475b-9344-eb573a3ac6c4.png") "youtube.png"
Cut-Icon ($prefix + "ChatGPT_Image_Oct_7__2026__10_58_56_AM-4-274a468b-53a6-49d0-b026-bf869c0b528f.png") "snapchat.png"
Cut-Icon ($prefix + "ChatGPT_Image_Oct_7__2026__10_58_52_AM-2-8816ac74-5ba7-4d99-b2e8-ed2bec30cef4.png") "tiktok.png"
Cut-Icon ($prefix + "ChatGPT_Image_Oct_7__2026__10_58_49_AM-1-eeaa5a69-df3e-4369-9266-ad91843476b3.png") "instagram.png"
Cut-Icon ($prefix + "ChatGPT_Image_Oct_7__2026__11_01_08_AM-2-8a8b2718-0e97-4653-88a3-be32c2bbf6b5.png") "truck.png"
Cut-Icon ($prefix + "ChatGPT_Image_Oct_7__2026__11_01_07_AM-1-5b55a096-4cd1-46ae-9c16-adb2f67d6daa.png") "shield-check.png"
Cut-Icon ($prefix + "ChatGPT_Image_Oct_7__2026__11_01_10_AM-3-435dbae5-ffdf-4112-b46d-ab314971fada.png") "shield-drop.png"
Cut-Icon ($prefix + "ChatGPT_Image_Oct_7__2026__11_01_13_AM-5-c3b0cdbd-f269-4fbe-966b-4e9438b78668.png") "phone.png"
Cut-Icon ($prefix + "ChatGPT_Image_Oct_7__2026__11_01_11_AM-4-bac2f50b-50ce-488e-920d-7e54a2e8556f.png") "returns.png"
