import Capacitor
import Foundation
import UIKit

private func cloudLog(_ message: String) {
    #if DEBUG
    NSLog("SKIRMISH-CLOUD: %@", message)
    #endif
}

// iCloud's key-value store, which carries the campaign between a player's devices. All of the
// deciding - what to upload, what to take, when to ask - happens in the page; this only reads,
// writes, and says when another device has changed something.
@objc(SkirmishCloudPlugin)
public class SkirmishCloudPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "SkirmishCloudPlugin"
    public let jsName = "SkirmishCloud"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getDeviceName", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "get", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "set", returnType: CAPPluginReturnPromise)
    ]

    private let store = NSUbiquitousKeyValueStore.default

    override public func load() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(storeChangedExternally(_:)),
            name: NSUbiquitousKeyValueStore.didChangeExternallyNotification,
            object: store
        )
        // Fetches anything written by another device while this app wasn't running
        store.synchronize()
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }

    @objc private func storeChangedExternally(_ notification: Notification) {
        let reason: String
        switch notification.userInfo?[NSUbiquitousKeyValueStoreChangeReasonKey] as? Int {
        case NSUbiquitousKeyValueStoreServerChange:
            reason = "server"
        case NSUbiquitousKeyValueStoreInitialSyncChange:
            reason = "initialSync"
        case NSUbiquitousKeyValueStoreQuotaViolationChange:
            reason = "quota"
        case NSUbiquitousKeyValueStoreAccountChange:
            reason = "account"
        default:
            reason = "unknown"
        }
        let keys = notification.userInfo?[NSUbiquitousKeyValueStoreChangedKeysKey] as? [String] ?? []
        cloudLog("changed externally (\(reason)): \(keys.joined(separator: ", "))")
        notifyListeners("changed", data: ["reason": reason, "keys": keys])
    }

    // What the other device will be called when a player is asked which campaign to keep. The
    // name a person has given their device needs a special entitlement to read since iOS 16, so
    // this is the kind of device instead.
    @objc func getDeviceName(_ call: CAPPluginCall) {
        #if targetEnvironment(macCatalyst)
        call.resolve(["deviceName": "Mac"])
        #else
        call.resolve(["deviceName": UIDevice.current.model])
        #endif
    }

    @objc func get(_ call: CAPPluginCall) {
        guard let key = call.getString("key") else {
            call.reject("A key is required")
            return
        }

        // Always an object: resolving with nothing reaches the page as undefined, not as {}
        if let value = store.string(forKey: key) {
            call.resolve(["value": value])
        } else {
            call.resolve([:])
        }
    }

    @objc func set(_ call: CAPPluginCall) {
        guard let key = call.getString("key"), let value = call.getString("value") else {
            call.reject("A key and a value are required")
            return
        }

        store.set(value, forKey: key)
        // Only a hint that now is a good moment: the system still decides when to upload
        store.synchronize()
        cloudLog("set \(key): \(value.count) characters")
        call.resolve()
    }
}
