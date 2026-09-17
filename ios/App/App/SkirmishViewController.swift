import Capacitor
import WebKit

// Capacitor's bridge view controller, extended only to tell the page what kind of build it is
// running in. Developer Mode (see Platform.canUseDeveloperMode) is for working on the game, so a
// Debug build offers it and a Release build never does. Every archive, TestFlight upload and
// App Store build is Release, where the code below isn't compiled at all.
class SkirmishViewController: CAPBridgeViewController {
    // This is the last point before the web view exists. The script can't go in
    // webViewConfiguration(for:), which runs earlier: Capacitor replaces the configuration's
    // user content controller with its own straight afterwards, discarding anything added there.
    override func webView(with frame: CGRect, configuration: WKWebViewConfiguration) -> WKWebView {
        #if DEBUG
        // Injected at document start, so the flag is already set when the game's own scripts run
        let flag = WKUserScript(source: "window.skirmishDebugBuild = true;", injectionTime: .atDocumentStart, forMainFrameOnly: true)
        configuration.userContentController.addUserScript(flag)
        #endif

        return super.webView(with: frame, configuration: configuration)
    }
}
