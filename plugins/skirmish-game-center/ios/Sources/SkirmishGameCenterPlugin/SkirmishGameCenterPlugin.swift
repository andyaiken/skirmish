import Capacitor
import Foundation
import GameKit

// Bridges Game Center to the web layer, matching the GameCenter interface in
// src/platform/game-center.ts: sign the player in, report achievements and scores, and show
// Apple's own Game Center interface.
//
// Everything here deals in the identifiers set up in App Store Connect. What earns an
// achievement or a score is the web layer's business, so this file knows nothing about the game.
@objc(SkirmishGameCenterPlugin)
public class SkirmishGameCenterPlugin: CAPPlugin, CAPBridgedPlugin {
	public let identifier = "SkirmishGameCenterPlugin"
	public let jsName = "SkirmishGameCenter"
	public let pluginMethods: [CAPPluginMethod] = [
		CAPPluginMethod(name: "authenticate", returnType: CAPPluginReturnPromise),
		CAPPluginMethod(name: "reportAchievements", returnType: CAPPluginReturnPromise),
		CAPPluginMethod(name: "submitScores", returnType: CAPPluginReturnPromise),
		CAPPluginMethod(name: "setAccessPointVisible", returnType: CAPPluginReturnPromise),
		CAPPluginMethod(name: "showDashboard", returnType: CAPPluginReturnPromise)
	]

	// Starts sign-in and returns at once. Game Center may need to show its own sign-in sheet, and
	// can report back several times (signing in, or out, in Settings), so the answer comes as an
	// "authenticationChanged" event rather than as this call's result.
	@objc func authenticate(_ call: CAPPluginCall) {
		DispatchQueue.main.async {
			GKLocalPlayer.local.authenticateHandler = { [weak self] viewController, _ in
				if let viewController {
					self?.bridge?.viewController?.present(viewController, animated: true)
					return
				}
				self?.notifyListeners("authenticationChanged", data: [ "authenticated": GKLocalPlayer.local.isAuthenticated ])
			}
			call.resolve()
		}
	}

	// Each entry is an id and how far along it is, 0 to 100. Game Center keeps the highest
	// value it has been given, so reporting the same progress twice does no harm.
	@objc func reportAchievements(_ call: CAPPluginCall) {
		guard GKLocalPlayer.local.isAuthenticated else {
			call.resolve()
			return
		}

		let entries = call.getArray("achievements", JSObject.self) ?? []
		let achievements = entries.compactMap { entry -> GKAchievement? in
			guard let id = entry["id"] as? String, let percent = entry["percent"] as? Double else {
				return nil
			}
			let achievement = GKAchievement(identifier: id)
			achievement.percentComplete = min(max(percent, 0), 100)
			achievement.showsCompletionBanner = true
			return achievement
		}

		if achievements.isEmpty {
			call.resolve()
			return
		}

		GKAchievement.report(achievements) { error in
			if let error {
				call.reject("Could not report achievements.", nil, error)
			} else {
				call.resolve()
			}
		}
	}

	// A leaderboard keeps the player's best score, so a lower one later is simply ignored
	@objc func submitScores(_ call: CAPPluginCall) {
		guard GKLocalPlayer.local.isAuthenticated else {
			call.resolve()
			return
		}

		let entries = call.getArray("scores", JSObject.self) ?? []
		let group = DispatchGroup()
		let lock = NSLock()
		var failure: Error?

		for entry in entries {
			guard let id = entry["id"] as? String, let score = entry["score"] as? Int else {
				continue
			}
			group.enter()
			GKLeaderboard.submitScore(score, context: 0, player: GKLocalPlayer.local, leaderboardIDs: [ id ]) { error in
				if let error {
					lock.lock()
					failure = error
					lock.unlock()
				}
				group.leave()
			}
		}

		group.notify(queue: .main) {
			if let failure {
				call.reject("Could not submit scores.", nil, failure)
			} else {
				call.resolve()
			}
		}
	}

	// The small Game Center badge Apple draws over the app. Apple only shows it for a signed-in player.
	@objc func setAccessPointVisible(_ call: CAPPluginCall) {
		let visible = call.getBool("visible") ?? false

		DispatchQueue.main.async {
			GKAccessPoint.shared.location = .topTrailing
			GKAccessPoint.shared.isActive = visible
			call.resolve()
		}
	}

	@objc func showDashboard(_ call: CAPPluginCall) {
		guard GKLocalPlayer.local.isAuthenticated else {
			call.resolve()
			return
		}

		DispatchQueue.main.async {
			GKAccessPoint.shared.trigger(state: .dashboard) {
				call.resolve()
			}
		}
	}
}
