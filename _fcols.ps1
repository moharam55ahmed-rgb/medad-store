Add-Type -AssemblyName System.Drawing
$src = "C:\Users\qeema\.cursor\projects\c-Users-qeema-OneDrive-Desktop-Medad\assets\c__Users_qeema_AppData_Roaming_Cursor_User_workspaceStorage_196bf47de261250a23e610080323afaa_images_image-1f3c8422-fd48-4ce0-8fc6-4ecac69023ff.png"
$bmp = New-Object System.Drawing.Bitmap $src
function Crop($name, $x, $y, $w, $h, $scale) {
  $c = New-Object System.Drawing.Bitmap ($w * $scale), ($h * $scale)
  $g = [System.Drawing.Graphics]::FromImage($c)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
  $g.DrawImage($bmp, (New-Object System.Drawing.Rectangle 0,0,($w*$scale),($h*$scale)), (New-Object System.Drawing.Rectangle $x,$y,$w,$h), [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $c.Save("C:\Users\qeema\OneDrive\Desktop\Medad\_$name.png", [System.Drawing.Imaging.ImageFormat]::Png)
  $c.Dispose()
}
Crop "c1" 250 48 170 100 4
Crop "c2" 400 48 160 100 4
Crop "c3" 540 48 170 100 4
Crop "c4" 700 48 310 110 4
Crop "blogo" 0 40 270 120 4
Crop "b1" 0 145 200 55 4
Crop "b2" 180 145 200 55 4
Crop "b3" 360 145 200 55 4
Crop "b4" 520 145 220 55 4
Crop "b5" 720 145 304 55 4
$bmp.Dispose()
Write-Output "ok"
