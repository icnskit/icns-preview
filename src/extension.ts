import * as vscode from 'vscode'
import { icnsApp, readIcns } from './icns'
import { FormatError, Title, Wrap } from './msg'

const renderHTML = (incs: icnsApp)=> {
	let options = ``
	let firstImage = ``
	incs.images.forEach((item, index)=> {
		const type = item.osType
		const image = incs.toImage(item.image)
		if (index == 0) firstImage = image
		options += `<option value="${ image }">${ type }</option>`
		return {
			type,
			image
		}
	})
	return `
		<style>
			#app select {
				border-radius: 4px;
				width: 20vw;
				padding: 4px 12px;
				min-width: 120px;
				max-width: 420px;
				margin: 12px 0;
				outline: none;
			}
		</style>
		<div id="app" class="select">
			<select onChange="window.changeShowImg(this.value)" name="" id="">
				${ options }
			</select>
			<div>
				<img id="img" src="${ firstImage }" />
			</div>
		</div>
		<script type="text/javascript">
			const img = document.getElementById('img')
			window.changeShowImg = function (val) {
				img.setAttribute("src", val)
			}
		</script>
	`
}

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('icns_preview.preview', (uri: vscode.Uri | undefined) => {

		if (!uri) return

	  const next = readIcns(uri.fsPath)

		if (!next) {
			vscode.window.showErrorMessage(Wrap(FormatError))
			return
		}

		const pan =	vscode.window.createWebviewPanel(Title, Title, vscode.ViewColumn.Active, {
			enableScripts: true,
		})

		pan.webview.html = renderHTML(next)

	})

	context.subscriptions.push(disposable)
}

export function deactivate() {}
