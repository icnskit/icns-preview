import * as vscode from 'vscode'
import { readIcns } from './icns'
import { FormatError, Title, Wrap } from './msg'

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('icns_preview.preview', (uri: vscode.Uri | undefined) => {

		if (!uri) return

	  const next = readIcns(uri.fsPath)

		if (!next) {
			vscode.window.showErrorMessage(Wrap(FormatError))
			return
		}

		const pan =	vscode.window.createWebviewPanel(Title, Title, vscode.ViewColumn.Active)

		let index = 4

		if (next.images.length <= 4) index = 0

		const img = next.toImage(next.images[index].image)

		pan.webview.html = `<div><img src="${ img }" /></div>`

	})

	context.subscriptions.push(disposable)
}

export function deactivate() {}
