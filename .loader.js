import { register } from "node:module"
import { pathToFileURL } from "node:url"

register("esbuild-register/loader", pathToFileURL("./"))
