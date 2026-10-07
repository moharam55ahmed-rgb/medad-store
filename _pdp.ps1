Add-Type -AssemblyName System.Drawing
$base = "C:\Users\qeema\.cursor\projects\c-Users-qeema-OneDrive-Desktop-Medad\assets\c__Users_qeema_AppData_Roaming_Cursor_User_workspaceStorage_196bf47de261250a23e610080323afaa_images_"
$dest = "C:\Users\qeema\OneDrive\Desktop\Medad\public\product"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

function Cut([string]$file, [string]$outName, [int]$maxSide, [bool]$photos) {
  $src = $base + $file
  $bmp = New-Object System.Drawing.Bitmap $src
  $scale = 1.0
  $side = [Math]::Max($bmp.Width, $bmp.Height)
  if ($side -gt $maxSide) { $scale = $maxSide / $side }
  $nw = [Math]::Max(1, [int]($bmp.Width * $scale))
  $nh = [Math]::Max(1, [int]($bmp.Height * $scale))
  $scaled = New-Object System.Drawing.Bitmap $nw, $nh
  $g = [System.Drawing.Graphics]::FromImage($scaled)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($bmp, 0, 0, $nw, $nh)
  $g.Dispose(); $bmp.Dispose()
  $rect = New-Object System.Drawing.Rectangle 0, 0, $nw, $nh
  $data = $scaled.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $stride = $data.Stride
  $bytes = New-Object byte[] ($stride * $nh)
  [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)
  $limit = $(if ($photos) { 26 } else { 36 })
  for ($y = 0; $y -lt $nh; $y++) {
    $row = $y * $stride
    for ($x = 0; $x -lt $nw; $x++) {
      $i = $row + $x * 4
      $b = $bytes[$i]; $gg = $bytes[$i+1]; $r = $bytes[$i+2]
      $dark = ($r -lt $limit -and $gg -lt $limit -and $b -lt $limit)
      $fringe = (-not $photos -and $r -lt 70 -and $gg -lt 70 -and $b -lt 70 -and [Math]::Abs($r - $gg) -lt 16 -and [Math]::Abs($r - $b) -lt 16)
      if ($dark -or $fringe) { $bytes[$i+3] = 0 }
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
  $pad = [Math]::Max(4, [int](($maxX - $minX) * 0.02))
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

Cut "ChatGPT_Image_Oct_7__2026__12_05_32_PM-1_-_Copy-5040208b-352a-4d1b-9602-e40135487f06.jpg" "main.png" 1400 $true
Cut "ChatGPT_Image_Oct_7__2026__12_05_43_PM-4_-_Copy-176432bb-251f-4a0f-9c8b-3a105fc2f1d0.jpg" "jar.png" 900 $true
Cut "ChatGPT_Image_Oct_7__2026__12_05_38_PM-3_-_Copy-8d3ff79d-8fd2-4f2f-afec-6bf5871f5336.png" "smear.png" 900 $true
Cut "ChatGPT_Image_Oct_7__2026__12_05_45_PM-5-4339d128-be56-42eb-a79c-9c183384f738.jpg" "face.png" 900 $true
Cut "Pink_Wallet_with_Layered_Cards_-_Copy-593fd38d-8603-4d66-9e47-a5eb71de3ed5.jpg" "wallet.png" 1200 $true
Cut "01_tabby-2e6c805f-9268-49b1-8847-438ace67b0be.png" "tabby.png" 700 $false
Cut "02_tamara-0c46ff21-8796-4332-92e7-4df4983ea398.png" "tamara.png" 700 $false
Cut "03_visa-f829e2a4-e713-49cb-841d-bbdd82769ceb.png" "visa.png" 700 $false
Cut "04_mastercard-3c6bf474-b6ff-40e5-84f6-ea24ee3158d3.png" "mastercard.png" 700 $false
Cut "05_apple_pay-e95b3d96-619f-47df-87a7-7eb0931bda60.png" "applepay.png" 700 $false
Cut "06_benefitpay-0ce5dadb-2a52-4ffd-8132-d4df4da2d108.png" "benefit.png" 700 $false
Cut "11_authentic_products_icon-3fbdb62f-6aaa-49cc-af46-f78a61713c08.png" "ico-authentic.png" 400 $false
Cut "10_secure_payment_icon-bb71eef4-6180-4586-b47d-0f851f000252.png" "ico-pay.png" 400 $false
Cut "09_fast_delivery_icon-c8ba9f66-cc68-4ee5-bdba-a911d10ac14a.png" "ico-truck.png" 400 $false
Cut "08_easy_returns_icon-82bdda76-f2be-4aa6-bcb5-d93b450d5b18.png" "ico-return.png" 400 $false
Cut "07_customer_support_icon-e29986c5-6fe0-44d4-9233-08fe3d40d6fe.png" "ico-support.png" 400 $false
Cut "ChatGPT_Image_Oct_7__2026__12_26_11_PM-1-b09a1695-a10f-4ff5-82e1-262cc8d608d8.png" "feat-drop.png" 400 $false
Cut "ChatGPT_Image_Oct_7__2026__12_26_21_PM-7-3f45c4d4-5b34-4f96-a41c-cfed22a773a8.png" "feat-spark.png" 400 $false
Cut "ChatGPT_Image_Oct_7__2026__12_26_20_PM-6-80a52138-4276-454b-86a7-b78d6f6d90b3.png" "feat-waves.png" 400 $false
Cut "ChatGPT_Image_Oct_7__2026__12_26_18_PM-5-4380ad8e-a3b5-43f8-9156-ce5a07cd0efb.png" "feat-lotus.png" 400 $false
Cut "ChatGPT_Image_Oct_7__2026__12_26_16_PM-4-10088ead-0af6-41cd-a3fc-42d5f734fba5.png" "feat-shield.png" 400 $false
