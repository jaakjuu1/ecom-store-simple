Set shell = CreateObject("Shell.Application")
Set FSO = CreateObject("Scripting.FileSystemObject")
currentPath = FSO.GetAbsolutePathName(".")
shell.ShellExecute "cmd.exe", "/c cd /d """ & currentPath & """ && npm run email-script && pause", "", "runas", 1