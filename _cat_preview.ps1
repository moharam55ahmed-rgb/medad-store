Add-Type -AssemblyName System.Drawing
$dir = "C:\Users\qeema\OneDrive\Desktop\Medad\public\categories"
$names = @("skin","makeup","fragrance","hair","body","gifts","tools")
$sheet = New-Object System.Drawing.Bitmap (7 * 180), 180
$g = [System.Drawing.Graphics]::FromImage($sheet)
$g.Clear([System.Drawing.Color]::FromArgb(255, 40, 40, 40))
$i = 0
foreach ($name in $names) {
  $bmp = New-Object System.Drawing.Bitmap (Join-Path $dir ($name + ".png"))
  $g.DrawImage($bmp, ($i * 180) + 10, 10, 160, 160)
  $bmp.Dispose()
  $i++
}
$sheet.Save("C:\Users\qeema\OneDrive\Desktop\Medad\_cat_preview.png")
$g.Dispose(); $sheet.Dispose()
Write-Output "preview"
