export enum PersonalityType {
	Bold = 'Bold',
	Cautious = 'Cautious',
	Cheerful = 'Cheerful',
	Gloomy = 'Gloomy',
	Greedy = 'Greedy',
	Generous = 'Generous',
	Curious = 'Curious',
	Content = 'Content',
	Proud = 'Proud',
	Humble = 'Humble',
	Loyal = 'Loyal',
	Independent = 'Independent',
	Wry = 'Wry',
	Sincere = 'Sincere',
	Devout = 'Devout',
	Skeptical = 'Skeptical'
}

export enum PersonalityAxis {
	BoldCautious = 'BoldCautious',
	CheerfulGloomy = 'CheerfulGloomy',
	GreedyGenerous = 'GreedyGenerous',
	ProudHumble = 'ProudHumble',
	CuriousContent = 'CuriousContent',
	LoyalIndependent = 'LoyalIndependent',
	WrySincere = 'WrySincere',
	DevoutSkeptical = 'DevoutSkeptical'
}

export const personalityAxes: Record<PersonalityAxis, { left: PersonalityType; right: PersonalityType; legacyIndependent?: boolean }> = {
	[PersonalityAxis.BoldCautious]: { left: PersonalityType.Bold, right: PersonalityType.Cautious },
	[PersonalityAxis.CheerfulGloomy]: { left: PersonalityType.Cheerful, right: PersonalityType.Gloomy },
	[PersonalityAxis.GreedyGenerous]: { left: PersonalityType.Greedy, right: PersonalityType.Generous },
	[PersonalityAxis.ProudHumble]: { left: PersonalityType.Proud, right: PersonalityType.Humble },
	[PersonalityAxis.CuriousContent]: { left: PersonalityType.Curious, right: PersonalityType.Content, legacyIndependent: true },
	[PersonalityAxis.LoyalIndependent]: { left: PersonalityType.Loyal, right: PersonalityType.Independent, legacyIndependent: true },
	[PersonalityAxis.WrySincere]: { left: PersonalityType.Wry, right: PersonalityType.Sincere, legacyIndependent: true },
	[PersonalityAxis.DevoutSkeptical]: { left: PersonalityType.Devout, right: PersonalityType.Skeptical, legacyIndependent: true }
};
