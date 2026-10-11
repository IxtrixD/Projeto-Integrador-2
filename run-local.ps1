$ErrorActionPreference = 'Stop'

Push-Location -LiteralPath $PSScriptRoot
try {
	& .\mvnw.cmd '-Dspring-boot.run.profiles=local' spring-boot:run
}
finally {
	Pop-Location
}