# Complete Cloud Storage Infrastructure Map

## Summary
Your system has **5 different cloud storage services** configured across **14+ locations**

---

## 1. Microsoft OneDrive (7 Locations)
### Active Instances
- **BCD Holdings Business**: `C:\Users\dusta\OneDrive - BCD Holdings` (33.77 GB)
- **BigChubbyDog Organization**: `C:\Users\dusta\05-CloudStorage\OneDrive - Big Chubby Dog Inc` (10.02 GB)
- **MortgageLC Business**: 
  - `C:\Users\dusta\05-CloudStorage\OneDrive - mortgagelc.com` (0.62 GB)
  - `C:\Users\dusta\05-CloudStorage\OneDrive - mortgagelc.com (1)` (8.8 GB)
- **Personal**: `C:\PersonalOneDrive\OneDrive`
- **Empty/Archive**: 2 additional OneDrive folders

**Total OneDrive Storage**: ~53.21 GB

---

## 2. Dropbox
### Location
- **Path**: `C:\Dropbox`
- **Status**: Active with content
- **Sample Contents**:
  - AI-Content-Generator-System
  - BRANDING_VERIFICATION_COMPLETE
  - context automations
  - d365-power-automate-configs
  - Facebook-Automation-Documentation

---

## 3. Apple iCloud
### Locations
- **iCloud Drive**: `C:\Users\dusta\iCloudDrive` (100 items)
- **iCloud Photos**: `C:\Users\dusta\iCloudPhotos` (1 item)

---

## 4. Google Drive
### Status
- **Application**: Google Drive File Stream (Installed)
- **Installation Path**: `C:\Program Files\Google\Drive File Stream`
- **Type**: Virtual Drive System
- **Note**: Creates virtual drive letter when active

---

## 5. Network Storage
### Mapped Drives
- **Y: Drive**: `\\DALLANCOMP\Users` (Network share)

---

## Quick Access Commands

### Check OneDrive Status
```powershell
Get-Process OneDrive -ErrorAction SilentlyContinue
```

### Check Dropbox Status
```powershell
Get-Process Dropbox -ErrorAction SilentlyContinue
```

### Check Google Drive Status
```powershell
Get-Process GoogleDriveFS -ErrorAction SilentlyContinue
```

### List All Cloud Storage Sizes
```powershell
Get-ChildItem C:\Users\dusta\*OneDrive*, C:\Dropbox, C:\Users\dusta\iCloud* -Directory | 
    ForEach-Object { 
        $size = (Get-ChildItem $_.FullName -Recurse -ErrorAction SilentlyContinue | 
                 Measure-Object -Property Length -Sum).Sum / 1GB
        "$($_.Name): $([math]::Round($size, 2)) GB"
    }
```

---

## Configuration Files
- **OneDrive Settings**: `%LOCALAPPDATA%\Microsoft\OneDrive\settings`
- **Dropbox Settings**: `%APPDATA%\Dropbox`
- **Google Drive Settings**: `%LOCALAPPDATA%\Google\Drive`
- **iCloud Settings**: `%APPDATA%\Apple Computer\Preferences`

---

## Total Cloud Storage Summary
- **5 Cloud Services Active**
- **14+ Storage Locations**
- **~60+ GB Synchronized Content**
- **1 Network Drive Mapped**

Last Updated: 2025-08-16