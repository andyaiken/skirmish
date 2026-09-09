import Capacitor
import Foundation
import StoreKit

// Bridges StoreKit to the web layer. Three jobs, matching the Store interface in
// src/platform/store.ts: list what is for sale, buy one thing, and report everything
// already owned.
//
// Everything here deals in *product identifiers* - the full reverse-DNS strings such as
// com.andyaiken.skirmish.pack_codex_arcanum. Turning those into pack IDs is the web
// layer's job, so this file needs to know nothing about packs or the game.
// Traces the store round trip in debug builds only - these were what made the bridge
// problems findable, and Phase 07's sandbox testing on real hardware will want them
// again. The compiler strips the whole body from a release build.
private func storeLog(_ message: String) {
	#if DEBUG
	NSLog("SKIRMISH-STORE: %@", message)
	#endif
}

@objc(SkirmishStorePlugin)
public class SkirmishStorePlugin: CAPPlugin, CAPBridgedPlugin {
	public let identifier = "SkirmishStorePlugin"
	public let jsName = "SkirmishStore"
	public let pluginMethods: [CAPPluginMethod] = [
		CAPPluginMethod(name: "getProducts", returnType: CAPPluginReturnPromise),
		CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
		CAPPluginMethod(name: "restore", returnType: CAPPluginReturnPromise),
		CAPPluginMethod(name: "getOwned", returnType: CAPPluginReturnPromise)
	]

	// A purchase can complete when we are not asking about it - an Ask to Buy approval
	// arriving hours later, or a purchase finished on another device. StoreKit delivers
	// those here, and we tell the web layer to re-read what is owned.
	private var updates: Task<Void, Never>?

	override public func load() {
		storeLog("plugin loaded")
		updates = Task.detached { [weak self] in
			for await update in Transaction.updates {
				guard let self else { return }
				if case .verified(let transaction) = update {
					// Telling StoreKit we have handed over the goods. Without this the
					// transaction is offered again on every launch, forever.
					await transaction.finish()
				}
				await self.notifyOwnershipChanged()
			}
		}
	}

	deinit {
		updates?.cancel()
	}

	@MainActor
	private func notifyOwnershipChanged() {
		notifyListeners("ownershipChanged", data: [:])
	}

	// Asks the App Store what these products cost. The price comes back already formatted
	// in the viewer's own currency, which is why the app never builds a price string.
	@objc func getProducts(_ call: CAPPluginCall) {
		guard let identifiers = call.getArray("productIDs", String.self) else {
			call.reject("productIDs is required")
			return
		}

		storeLog("getProducts called with \(identifiers.count) identifiers: \(identifiers.joined(separator: ", "))")

		Task {
			do {
				let products = try await Product.products(for: identifiers)
				storeLog("StoreKit returned \(products.count) products")
				let payload = products.map { product in
					[
						"productID": product.id,
						"price": product.displayPrice,
						"title": product.displayName
					]
				}
				call.resolve([ "products": payload ])
			} catch {
				storeLog("getProducts failed: \(error.localizedDescription)")
				call.reject("Could not reach the App Store.", nil, error)
			}
		}
	}

	// Buys one product and resolves with everything owned afterwards, so the caller never
	// has to merge a purchase into its own idea of what is owned.
	@objc func purchase(_ call: CAPPluginCall) {
		guard let productID = call.getString("productID") else {
			call.reject("productID is required")
			return
		}

		Task {
			do {
				guard let product = try await Product.products(for: [ productID ]).first else {
					call.reject("That pack is not for sale here.")
					return
				}

				let result = try await product.purchase()

				switch result {
					case .success(let verification):
						switch verification {
							case .verified(let transaction):
								await transaction.finish()
								await resolveWithOwned(call)
							case .unverified:
								// The signature did not check out. Refusing is the only safe
								// answer; App Review would call anything else a vulnerability.
								call.reject("That purchase could not be verified.")
						}
					case .userCancelled:
						// Not an error the player needs telling about - they know.
						call.reject("cancelled", "cancelled")
					case .pending:
						// Ask to Buy, or a payment method needing action. The transaction
						// listener above picks it up whenever it is approved.
						call.reject("pending", "pending")
					@unknown default:
						call.reject("That purchase did not complete.")
				}
			} catch {
				call.reject("That purchase did not complete.", nil, error)
			}
		}
	}

	// What StoreKit already knows is owned, without contacting the App Store. Safe to call
	// unprompted at launch, unlike restore() below - reading cached entitlements never
	// asks the player to sign in.
	@objc func getOwned(_ call: CAPPluginCall) {
		storeLog("getOwned called")
		Task {
			await resolveWithOwned(call)
		}
	}

	// Everything currently owned, straight from StoreKit. This is the whole of restore:
	// there is no receipt to parse and nothing of ours to ask.
	@objc func restore(_ call: CAPPluginCall) {
		Task {
			do {
				// Pulls anything bought on another device before reading entitlements. This
				// is why restore must stay behind the button: sync can ask the player to
				// sign in, which would be indefensible on a cold launch.
				try await AppStore.sync()
			} catch {
				// A failed sync is not fatal - local entitlements are still worth reading,
				// and this is exactly the case where the player has no network.
			}
			await resolveWithOwned(call)
		}
	}

	private func resolveWithOwned(_ call: CAPPluginCall) async {
		var owned: [String] = []

		for await entitlement in Transaction.currentEntitlements {
			if case .verified(let transaction) = entitlement {
				// Revoked covers refunds and Family Sharing being turned off.
				if transaction.revocationDate == nil {
					owned.append(transaction.productID)
				}
			}
		}

		storeLog("entitlements: \(owned.count) owned")
		call.resolve([ "productIDs": owned ])
	}
}
