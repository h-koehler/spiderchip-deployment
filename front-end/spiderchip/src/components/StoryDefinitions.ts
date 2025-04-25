export enum StoryBeatType {
    MEMO = "memo",
    DIALOGUE = "dialogue"
}

/*
 * All types contain a story_number and associated_puzzle.
 * Events appear AFTER the associated_puzzle, in the order of their story_number.
 * The associated_puzzle may be 0. In this case, put at the beginning.
 * The description field should be used as a short blub to represent it before reading (i.e. level select).
 */
export type StoryBeat<BeatType = StoryBeatType> =
    BeatType extends StoryBeatType.MEMO ? {
        type: BeatType;
        story_number: number;
        associated_puzzle: number;
        description: string;
        department: string | undefined; // if left off, no letterhead
        text: string;
    } : BeatType extends StoryBeatType.DIALOGUE ? {
        type: BeatType;
        story_number: number;
        associated_puzzle: number;
        description: string;
        character: string; // don't support dialogues with multiple characters at the moment - but story doesn't do that
        entries: string[];
    } : {
        type: never;
    }

const beats: StoryBeat[] = [
    {
        type: StoryBeatType.MEMO,
        story_number: 1,
        associated_puzzle: 0,
        description: "Summary of the lore.",
        department: undefined,
        text: `Two nations share the fragmented remains of a continent.
To the east lies the Valen Empire, an autocracy that has survived through its strong military and technology.
To the west lies the Liuren Republic, an alliance of survivors who reject the Empire.
The two have been at war for ages.
Despite the Empire’s attempts to gain control, through both conquest and deception, the Republic has held.

Over a hundred years ago, war tore through the land.
The nation that once ruled the continent broke apart, and in its place a number of nation-states formed.
One of these, the Valen Empire, used its remaining resources to conquer many of its neighbors.

Their goal: To rule over the entire continent.

In opposition, the Liuren Republic formed; a banner to reject the Empire's expansion.
However, without the Empire's technology, they are ill-equipped to defend themselves.
They have survived until now, but the Liuren banner is at risk of being taken down.

And so, the Republic seeks to replicate the Empire's technology.
Their control is strong, but some of their computers have made their way into Liuren hands.
However, much of the recovered technology is broken, needing repair.
Without the Empire's tools, it is difficult to decipher everything.

But not impossible.`
    },
    {
        type: StoryBeatType.MEMO,
        story_number: 2,
        associated_puzzle: 0,
        description: "A welcome letter from the head of the Liuren Technology Program.",
        department: "Liuren Technology Program",
        text: `Welcome!

Congratulations on being selected to the Liuren Technology Program. We believe your skills and insight will be invaluable to help with replicating and surpassing the Valen Empire’s technology.

This program was founded fourteen years ago in an effort to boost the Liuren Republic’s technology and reduce reliance on old fragment technology. Since its conception, we have fought hard to reverse engineer Valen technology, relying on recovered – often damaged – computers and other devices. Our efforts have been vital to protecting our borders against their unyielding attempts at conquest, and our banner stands tall. It is through this program that we defend our way of life.

Much of what we recover in the field is damaged in some way. Your tasks will include repairing broken software components, implementing missing algorithms, and understanding the inner workings of Valen technology. We wish you luck.

Your supervisor is Rosa Trigo. You will receive further instructions shortly.



Director Gerald Svenson
Liuren Technology Program – Defense through Technological Excellence`
    },
    {
        type: StoryBeatType.DIALOGUE,
        story_number: 3,
        associated_puzzle: 0,
        description: "Introductory dialogue with your supervisor, Rosa Trigo.",
        character: "Rosa Trigo",
        entries: [
            "Hi!",
            "I'm Rosa, I'll be showing you the ropes here.",
            "You're new to the program, so let me get you up to speed.",
            "Every so often we get a new batch of stolen tech from the Empire, but they've got some kind of protection on them that makes them pretty much unusable.",
            "Everything we get is broken in some way.",
            "Well, that's where we come in.",
            "We take their tech and try to figure out what's wrong so we can fix it.",
            "Anything we can get working is super useful.",
            "I'm giving you one of the computers from the latest batch.",
            "The hardware is pretty much intact, but something's wrong with the software.",
            "I want you to try and get it working. It'll be great to have another functional computer around.",
            "I know you're new, so don't be afraid to ask for help if something doesn't make sense.",
            "I'll be around to provide some guidance when you need it.",
            "Good luck!"
        ]
    },
    {
        type: StoryBeatType.MEMO,
        story_number: 4,
        associated_puzzle: 5,
        description: "Important emergency alert.",
        department: "Defense Oversight Committee",
        text: `WARNING: SEEK IMMEDIATE SHELTER

Empire attacks at eastern mountain pass and southern forest. Proceed immediately to emergency bunkers and await further instructions.

Current objectives remain unknown at this time, but intelligence indicates that the Valen Empire is attempting to establish a forward base near or beyond the mountain border. This would provide a dangerous position from which to launch strikes deeper into the Liuren Republic's main homeland.

Intelligence indicates that some details of this attack and their future plans may be present on stolen hardware currently under repair and investigation by the Liuren Technology Program. I am recommending the Program focus their efforts on these devices.



Colonel William Stafford`
    },
    {
        type: StoryBeatType.DIALOGUE,
        story_number: 5,
        associated_puzzle: 6,
        description: "Rosa talks about the emergency alert.",
        character: "Rosa Trigo",
        entries: [
            "Hey.",
            "I hope you're not too shaken up about that memo.",
            "We're not too close to that area, but it's good to be informed about those sorts of things.",
            "Still, that's the reason we're working on all of this stuff. Anything we can fix is a great help to those guys on the front lines.",
            "...",
            "Say, how's your computer going?",
            "It's part of the batch the Colonel was talking about.",
            "Forensics has been finding some weird stuff on those and it looks like there's some on yours, too.",
            "Seems like the Empire is planning an assassination or something like that.",
            "This one was stolen from a military outpost, so I suppose that might be why we're seeing that sort of thing.",
            "Still, they couldn't get all of the details.",
            "They say some of their codebreaking relies on bits of the system that still aren't working right.",
            "The more you've got fixed, the easier it is for the forensics team to take a look at the information stored on it.",
            "So, I guess you'll need to keep at it. Hopefully that'll help them find out what's going on.",
            "Don't be afraid to ask for help if you need it."
        ]
    },
    {
        type: StoryBeatType.MEMO,
        story_number: 6,
        associated_puzzle: 9,
        description: "Further developments concerning the Empire's activity and the Program.",
        department: "Defense Oversight Committee",
        text: `For Liuren Protection Force:

Spy intelligence indicates that the Empire is planning to make major moves within the next few weeks. Current goals are as of yet uncertain, but estimates based on prior actions indicate a possible attack on the Liuren capital of Revea.

I am directing force redeployments to focus defenses on the capital and key infrastructure based on these assessments. Liuren officials are being moved to a secure location for the time being. Affected units will be receiving specific instructions soon.



For Liuren Technology Program:

Intelligence confirms that certain details of the attack were leaked as early as three months ago and would be contained on recovered computers. I urge the Program to apply all available resources and haste to uncovering these details where possible.

Any information discovered, however apparently irrelevant or outdated, must be reported immediately. We must not let negligence allow the Empire the opening they need.



Colonel William Stafford`
    },
    {
        type: StoryBeatType.DIALOGUE,
        story_number: 7,
        associated_puzzle: 13,
        description: "Rosa thinks you might be onto something important.",
        character: "Rosa Trigo",
        entries: [
            "Hey.",
            "The Colonel's been breathing down my neck for a bit now.",
            "Most of the computers we've been working on have been intelligence dead ends. Not much information on them.",
            "Yours still looks promising, though, so we really want to get more out of it.",
            "Forensics is digging, but without it being fully functional there's only so much they can do.",
            "Right now, it looks like the Empire has embedded agents somewhere that are planning to attack sometime soon.",
            "Hopefully getting the leaders out of the capital will keep them safe, but we still don't know all of the details.",
            "I'm keeping the Colonel updated about everything forensics finds.",
            "I know you're still fairly new, but you have the best understanding of this computer.",
            "So... We're counting on you for this.",
            "Keep at it.",
            "Let me know if you find anything interesting or need some help."
        ]
    },
    {
        type: StoryBeatType.DIALOGUE,
        story_number: 8,
        associated_puzzle: 15,
        description: "Rosa thanks you for successfully fixing the computer.",
        character: "Rosa Trigo",
        entries: [
            "Nice work with the computer.",
            "Forensics took a look and it seems like they figured it out.",
            "It looks like the Empire wanted part of the information to leak, but I don't think they thought we'd get this much out of it.",
            "Turns out they actually can't get into the capital for the assassination.",
            "Something about us having closed off their way in a couple years ago.",
            "Instead, they wanted us to notice their attack plans and extract the government to a secure bunker.",
            "They have a spy working within the bunker who's going to do it once they give the signal.",
            "Well, had a spy.",
            "Thanks to your work, we found them.",
            "You did a great job. That'll really put a thorn in the Empire's side for a while.",
            "So, want another computer to fix?"
        ]
    },
    {
        type: StoryBeatType.MEMO,
        story_number: 9,
        associated_puzzle: 15,
        description: "Congratulations for your effort.",
        department: "Liuren Technology Program",
        text: `Congratulations, programmer.

Thanks to your effort, and the effort of the entire Liuren Technology Program, a devastating plot against the Republic’s government has been averted. In recognition of your work, we are honored to award you with the Distinguished Medal of Exceptional Service.

Unfortunately, due to the nature of this incident, we are unable to publicly acknowledge your direct contributions in preventing the attack. As such, your medal will be withheld for the time being. We apologize, but rest assured your valor has been recognized and will be remembered.



Director Gerald Svenson
Liuren Technology Program – Defense through Technological Excellence`
    }
];

export function getSpecificStoryBeat(storyNumber: number): StoryBeat | undefined {
    return beats.find((l) => l.story_number === storyNumber);
}

export function getAllStoryBeats(): StoryBeat[] {
    return beats.slice().sort((a: StoryBeat, b: StoryBeat) => a.story_number - b.story_number);
}
