Add-Type -AssemblyName System.Drawing
$files = @(
  "c__Users_qeema_AppData_Roaming_Cursor_User_workspaceStorage_196bf47de261250a23e610080323afaa_images_image-fa08c9d5-2fde-4375-8fa7-b504d970a33d.png",
  "c__Users_qeema_AppData_Roaming_Cursor_User_workspaceStorage_196bf47de261250a23e610080323afaa_images_image-18e78895-1128-476f-b6f4-1ae014f06217.png",
  "c__Users_qeema_AppData_Roaming_Cursor_User_workspaceStorage_196bf47de261250a23e610080323afaa_images_image-d77dfaec-f525-4deb-bf01-2897967d2ab6.png",
  "c__Users_qeema_AppData_Roaming_Cursor_User_workspaceStorage_196bf47de261250a23e610080323afaa_images_image-6a0e19df-b1cf-4139-8a3b-3f8e53899e34.png",
  "c__Users_qeema_AppData_Roaming_Cursor_User_workspaceStorage_196bf47de261250a23e610080323afaa_images_image-25845349-0e01-445b-8df2-1f9ae3a4d75e.png",
  "c__Users_qeema_AppData_Roaming_Cursor_User_workspaceStorage_196bf47de261250a23e610080323afaa_images_image-c4752390-88b9-4e51-9ab0-e40d41511fea.png",
  "c__Users_qeema_AppData_Roaming_Cursor_User_workspaceStorage_196bf47de261250a23e610080323afaa_images_image-a0130cce-7d43-4b94-9a50-73243d988f08.png"
)
$dir = "C:\Users\qeema\.cursor\projects\c-Users-qeema-OneDrive-Desktop-Medad\assets"
foreach ($name in $files) {
  $bmp = New-Object System.Drawing.Bitmap (Join-Path $dir $name)
  $w = $bmp.Width; $h = $bmp.Height
  function Px($x,$y) {
    $c = $bmp.GetPixel($x,$y)
    return "{0},{1},{2},{3}" -f $c.A,$c.R,$c.G,$c.B
  }
  $pts = @(
    (Px 2 2),
    (Px ([int]($w*0.5)) 4),
    (Px 4 ([int]($h*0.5))),
    (Px ([int]($w*0.18)) ([int]($h*0.5))),
    (Px ([int]($w*0.5)) ([int]($h*0.18))),
    (Px ([int]($w*0.5)) ([int]($h*0.5)))
  )
  Write-Output ("{0} {1}x{2} corner={3} top={4} left={5} ringL={6} ringT={7} mid={8}" -f $name.Substring(0,28), $w, $h, $pts[0], $pts[1], $pts[2], $pts[3], $pts[4], $pts[5])
  $bmp.Dispose()
}
