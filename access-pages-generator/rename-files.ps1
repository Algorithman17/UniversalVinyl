# Chemin du dossier contenant les fichiers
$folderPath = "c:\Users\a.pavageau\Desktop\Projets\access-pages-generator\src\_data\establishment_of_declaration"

# Récupérer tous les fichiers JSON dans le dossier
Get-ChildItem -Path $folderPath -Filter "establishmentOfDeclaration-*.json" | ForEach-Object {
    # Nouveau nom de fichier en remplaçant "cookies" par "inaccessibleContents"
    $newName = $_.Name -replace "^establishmentOfDeclaration-", ""
    
    # Renommer le fichier
    Rename-Item -Path $_.FullName -NewName $newName
}