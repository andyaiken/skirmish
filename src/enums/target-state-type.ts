// The states a target can be in that an action can pay attention to. These deliberately mirror the
// states ActionPrerequisites can check on the acting combatant - prerequisites are evaluated before
// a target exists, so this is the only place the same questions can be asked about the target
export enum TargetStateType {
	Prone = 'prone',
	Stunned = 'stunned',
	Damaged = 'damaged',
	Wounded = 'wounded',
	Afflicted = 'afflicted'
}
