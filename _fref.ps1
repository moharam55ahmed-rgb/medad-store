Add-Type -AssemblyName System.Drawing
$src = "C:\Users\qeema\.cursor\projects\c-Users-qeema-OneDrive-Desktop-Medad\assets\c__Users_qeema_AppData_Roaming_Cursor_User_workspaceStorage_196bf47de261250a23e610080323afaa_images_image-1f3c8422-fd48-4ce0-8fc6-4ecac69023ff.png"
$bmp = New-Object System.Drawing.Bitmap $src
$w = $bmp.Width; $h = $bmp.Height
Write-Output "size ${w}x${h}"
function Save-Crop($name, $x, $y, $cw, $ch) {
  $c = New-Object System.Drawing.Bitmap $cw, $ch
  $g = [System.Drawing.Graphics]::FromImage($c)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($bmp, (New-Object System.Drawing.Rectangle 0,0,$cw,$ch), (New-Object System.Drawing.Rectangle $x,$y,$cw,$ch), [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $c.Save("C:\Users\qeema\OneDrive\Desktop\Medad\_$name.png", [System.Drawing.Imaging.ImageFormat]::Png)
  $c.Dispose()
}
# sample a few pixels for pink
$pts = @(
  @(10, [int]($h*0.35)),
  @([int]($w*0.5), [int]($h*0.45)),
  @([int]($w*0.5), 8),
  @([int]($w*0.5), [int]($h*0.9))
)
foreach ($p in $pts) {
  $px = $bmp.GetPixel($p[0], $p[1])
  Write-Output ("px {0},{1} = {2},{3},{4}" -f $p[0], $p[1], $px.R, $px.G, $px.B)
}
$mid = [int]($h * 0.22)
$bot = [int]($h * 0.72)
Save-Crop "ftop" 0 0 $w $mid
Save-Crop "fmid" 0 $mid $w ($bot - $mid)
$strip = [int]($w / 5)
for ($i = 0; $i -lt 5; $i++) {
  Save-Crop "fcol$i" ($i * $strip) $mid $strip ($bot - $mid)
}
Save-Crop "fbot" 0 $bot $w ($h - $bot)
$bmp.Dispose()
Write-Output "crops done"
